import { Router, Request, Response } from 'express';
import { Database } from '../database';
import { authMiddleware as authenticateToken } from '../middleware/auth';

const router = Router();

// Get trap deployments for a user
router.get('/deployments', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userAddress } = req.query;
    const db = Database.getInstance();

    if (!userAddress) {
      return res.status(400).json({ error: 'User address is required' });
    }

    const { data: deployments, error } = await db
      .from('trap_deployments')
      .select('*')
      .eq('user_address', userAddress)
      .order('deployed_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch deployments' });
    }

    return res.json({ deployments: deployments || [] });
  } catch (error) {
    console.error('Error fetching deployments:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get security alerts for a user
router.get('/alerts', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userAddress } = req.query;
    const db = Database.getInstance();

    if (!userAddress) {
      return res.status(400).json({ error: 'User address is required' });
    }

    const { data: alerts, error } = await db
      .from('security_alerts')
      .select('*')
      .eq('user_address', userAddress)
      .order('timestamp', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch alerts' });
    }

    return res.json({ alerts: alerts || [] });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get trap statistics for a user
router.get('/stats', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userAddress } = req.query;
    const db = Database.getInstance();

    if (!userAddress) {
      return res.status(400).json({ error: 'User address is required' });
    }

    // Get total deployments
    const { count: totalDeployments } = await db
      .from('trap_deployments')
      .select('*', { count: 'exact', head: true })
      .eq('user_address', userAddress);

    // Get active traps
    const { count: activeTraps } = await db
      .from('trap_deployments')
      .select('*', { count: 'exact', head: true })
      .eq('user_address', userAddress)
      .eq('status', 'active');

    // Get total revenue
    const { data: revenueData } = await db
      .from('trap_deployments')
      .select('revenue_generated')
      .eq('user_address', userAddress)
      .not('revenue_generated', 'is', null);

    const totalRevenue = revenueData?.reduce((sum, trap) => sum + (trap.revenue_generated || 0), 0) || 0;

    // Get total gas used
    const { data: gasData } = await db
      .from('trap_deployments')
      .select('gas_used')
      .eq('user_address', userAddress)
      .not('gas_used', 'is', null);

    const totalGasUsed = gasData?.reduce((sum, trap) => sum + (trap.gas_used || 0), 0) || 0;

    // Get monthly deployments
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: monthlyDeployments } = await db
      .from('trap_deployments')
      .select('*', { count: 'exact', head: true })
      .eq('user_address', userAddress)
      .gte('deployed_at', thirtyDaysAgo.toISOString());

    // Calculate success rate
    const { data: successData } = await db
      .from('trap_deployments')
      .select('status')
      .eq('user_address', userAddress);

    const successfulDeployments = successData?.filter(trap => trap.status === 'active').length || 0;
    const successRate = totalDeployments ? Math.round((successfulDeployments / totalDeployments) * 100) : 0;

    // Get last deployment
    const { data: lastDeploymentData } = await db
      .from('trap_deployments')
      .select('deployed_at')
      .eq('user_address', userAddress)
      .order('deployed_at', { ascending: false })
      .limit(1);

    const lastDeployment = lastDeploymentData?.[0]?.deployed_at || null;

    // Calculate security score based on various factors
    const securityScore = Math.min(100, Math.max(0, 
      (successRate * 0.4) + 
      (Math.min(activeTraps || 0, 10) * 5) + 
      (Math.min(totalRevenue * 100, 30))
    ));

    const stats = {
      totalDeployments: totalDeployments || 0,
      activeTraps: activeTraps || 0,
      totalRevenue,
      successRate,
      totalGasUsed,
      lastDeployment,
      monthlyDeployments: monthlyDeployments || 0,
      securityScore: Math.round(securityScore)
    };

    return res.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recent activity for a user
router.get('/activity', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userAddress, limit = 10 } = req.query;
    const db = Database.getInstance();

    if (!userAddress) {
      return res.status(400).json({ error: 'User address is required' });
    }

    // Get recent deployments
    const { data: deployments } = await db
      .from('trap_deployments')
      .select('id, name, type, deployed_at, status')
      .eq('user_address', userAddress)
      .order('deployed_at', { ascending: false })
      .limit(Number(limit));

    // Get recent alerts
    const { data: alerts } = await db
      .from('security_alerts')
      .select('id, type, title, timestamp, severity')
      .eq('user_address', userAddress)
      .order('timestamp', { ascending: false })
      .limit(Number(limit));

    // Combine and sort activities
    const activities = [
      ...(deployments?.map(dep => ({
        id: dep.id,
        type: 'deployment' as const,
        title: `Deployed ${dep.name}`,
        description: `Successfully deployed ${dep.type} trap`,
        timestamp: dep.deployed_at,
        metadata: { status: dep.status }
      })) || []),
      ...(alerts?.map(alert => ({
        id: alert.id,
        type: 'security_event' as const,
        title: alert.title,
        description: `${alert.severity} priority alert`,
        timestamp: alert.timestamp,
        metadata: { severity: alert.severity }
      })) || [])
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, Number(limit));

    return res.json({ activities });
  } catch (error) {
    console.error('Error fetching activity:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
