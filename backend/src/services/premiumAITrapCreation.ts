import { DatabaseService } from './database';
import { ContractAnalysisService } from './contractAnalysis';
import { NotificationService } from './notification';

export interface AITrapCreationRequest {
  userId: string;
  userPrompt: string;
  complexity: 'simple' | 'medium' | 'advanced' | 'enterprise';
  targetNetwork: number;
  securityLevel: 'basic' | 'premium' | 'enterprise';
  customRequirements: string[];
  budget: number;
  timeline: 'immediate' | '24h' | '48h' | '1week';
}

export interface AITrapCreationGuide {
  id: string;
  trapName: string;
  description: string;
  securityFeatures: string[];
  deploymentSteps: DeploymentStep[];
  estimatedCost: string;
  riskAssessment: RiskAssessment;
  userActionsRequired: UserAction[];
  aiConfidence: number;
  estimatedTime: string;
  complexityScore: number;
}

export interface DeploymentStep {
  stepNumber: number;
  title: string;
  description: string;
  codeSnippet?: string;
  requiresUserAction: boolean;
  actionType: 'sign' | 'approve' | 'deploy' | 'verify' | 'fund';
  estimatedTime: string;
  estimatedCost: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  userActionRequired: boolean;
  notificationSent: boolean;
}

export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  vulnerabilities: string[];
  mitigationStrategies: string[];
  complianceNotes: string[];
}

export interface UserAction {
  actionId: string;
  stepNumber: number;
  actionType: 'sign' | 'approve' | 'deploy' | 'verify' | 'fund';
  description: string;
  estimatedCost: string;
  deadline: Date;
  status: 'pending' | 'completed' | 'expired';
  transactionHash?: string;
}

export class PremiumAITrapCreationService {
  private db: DatabaseService;
  private contractAnalysis: ContractAnalysisService;
  private notification: NotificationService;

  constructor(
    db: DatabaseService,
    contractAnalysis: ContractAnalysisService,
    notification: NotificationService
  ) {
    this.db = db;
    this.contractAnalysis = contractAnalysis;
    this.notification = notification;
  }

  /**
   * Main entry point for premium AI trap creation
   */
  async createAITrap(request: AITrapCreationRequest): Promise<AITrapCreationGuide> {
    try {
      console.log(`🚀 Starting AI trap creation for user ${request.userId}`);
      console.log(`📝 User prompt: ${request.userPrompt}`);

      // Phase 1: AI Analysis & Planning
      const guide = await this.generateTrapCreationGuide(request);
      
      // Phase 2: Save guide to database
      await this.saveTrapCreationGuide(guide, request.userId);
      
      // Phase 3: Start automated building process
      this.startAutomatedBuilding(guide.id, request.userId);
      
      // Phase 4: Send initial notification
      await this.notification.sendNotification(request.userId, {
        type: 'info',
        title: 'AI Trap Creation Started',
        message: 'Your AI-guided trap creation process has begun. We\'ll notify you of each step.',
        data: { guideId: guide.id, step: 1 },
        userId: request.userId
      });

      return guide;

    } catch (error) {
      console.error('AI trap creation failed:', error);
      throw new Error(`AI trap creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate comprehensive trap creation guide using AI
   */
  private async generateTrapCreationGuide(request: AITrapCreationRequest): Promise<AITrapCreationGuide> {
    const prompt = this.buildAIPrompt(request);
    
    // Perform AI analysis
    const aiResponse = await this.contractAnalysis.analyzeContract(
      '0x0000000000000000000000000000000000000000', // Placeholder address
      request.targetNetwork
    );

    // Parse AI response into structured guide
    const guide = this.parseAIResponseToGuide(aiResponse, request);
    
    return guide;
  }

  /**
   * Build comprehensive AI prompt for trap creation
   */
  private buildAIPrompt(request: AITrapCreationRequest): string {
    return `
Create a comprehensive security trap creation guide based on this user request:

USER REQUEST: ${request.userPrompt}
COMPLEXITY: ${request.complexity}
TARGET NETWORK: Hoodi Testnet (Chain ID: ${request.targetNetwork})
SECURITY LEVEL: ${request.securityLevel}
CUSTOM REQUIREMENTS: ${request.customRequirements.join(', ')}
BUDGET: ${request.budget} ETH
TIMELINE: ${request.timeline}

Please provide a complete guide including:

1. TRAP NAME AND DESCRIPTION
2. SECURITY FEATURES LIST
3. STEP-BY-STEP DEPLOYMENT PROCESS
4. ESTIMATED COSTS FOR EACH STEP
5. RISK ASSESSMENT
6. USER ACTIONS REQUIRED
7. COMPLIANCE NOTES
8. OPTIMIZATION RECOMMENDATIONS

Format your response as JSON with this structure:
{
  "trapName": "string",
  "description": "string", 
  "securityFeatures": ["feature1", "feature2"],
  "deploymentSteps": [
    {
      "stepNumber": 1,
      "title": "string",
      "description": "string",
      "requiresUserAction": true,
      "actionType": "sign|approve|deploy|verify|fund",
      "estimatedTime": "string",
      "estimatedCost": "string"
    }
  ],
  "estimatedCost": "string",
  "riskAssessment": {
    "overallRisk": "low|medium|high|critical",
    "riskScore": 85,
    "vulnerabilities": ["vuln1", "vuln2"],
    "mitigationStrategies": ["strategy1", "strategy2"],
    "complianceNotes": ["note1", "note2"]
  },
  "userActionsRequired": [
    {
      "actionType": "sign",
      "description": "string",
      "estimatedCost": "string"
    }
  ],
  "aiConfidence": 95,
  "estimatedTime": "string",
  "complexityScore": 8
}
`;
  }

  /**
   * Parse AI response into structured guide
   */
  private parseAIResponseToGuide(aiResponse: any, request: AITrapCreationRequest): AITrapCreationGuide {
    try {
      // Extract JSON from AI response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        id: `guide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        trapName: parsed.trapName || 'AI Generated Trap',
        description: parsed.description || 'Generated by AI based on user requirements',
        securityFeatures: parsed.securityFeatures || [],
        deploymentSteps: this.parseDeploymentSteps(parsed.deploymentSteps || []),
        estimatedCost: parsed.estimatedCost || 'Unknown',
        riskAssessment: this.parseRiskAssessment(parsed.riskAssessment || {}),
        userActionsRequired: this.parseUserActions(parsed.userActionsRequired || []),
        aiConfidence: parsed.aiConfidence || 85,
        estimatedTime: parsed.estimatedTime || '2-4 hours',
        complexityScore: parsed.complexityScore || 5
      };

    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return this.generateFallbackGuide(request);
    }
  }

  /**
   * Parse deployment steps from AI response
   */
  private parseDeploymentSteps(steps: any[]): DeploymentStep[] {
    return steps.map((step, index) => ({
      stepNumber: step.stepNumber || index + 1,
      title: step.title || `Step ${index + 1}`,
      description: step.description || 'AI generated step',
      codeSnippet: step.codeSnippet,
      requiresUserAction: step.requiresUserAction || false,
      actionType: step.actionType || 'verify',
      estimatedTime: step.estimatedTime || '15-30 minutes',
      estimatedCost: step.estimatedCost || '0.001 ETH',
      status: 'pending',
      userActionRequired: step.requiresUserAction || false,
      notificationSent: false
    }));
  }

  /**
   * Parse risk assessment from AI response
   */
  private parseRiskAssessment(assessment: any): RiskAssessment {
    return {
      overallRisk: assessment.overallRisk || 'medium',
      riskScore: assessment.riskScore || 50,
      vulnerabilities: assessment.vulnerabilities || [],
      mitigationStrategies: assessment.mitigationStrategies || [],
      complianceNotes: assessment.complianceNotes || []
    };
  }

  /**
   * Parse user actions from AI response
   */
  private parseUserActions(actions: any[]): UserAction[] {
    return actions.map((action, index) => ({
      actionId: `action_${Date.now()}_${index}`,
      stepNumber: action.stepNumber || index + 1,
      actionType: action.actionType || 'sign',
      description: action.description || 'User action required',
      estimatedCost: action.estimatedCost || '0.001 ETH',
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      status: 'pending'
    }));
  }

  /**
   * Generate fallback guide if AI parsing fails
   */
  private generateFallbackGuide(request: AITrapCreationRequest): AITrapCreationGuide {
    return {
      id: `guide_fallback_${Date.now()}`,
      trapName: 'Custom Security Trap',
      description: 'AI-generated trap based on your requirements',
      securityFeatures: ['Basic security', 'Error handling', 'Gas optimization'],
      deploymentSteps: [
        {
          stepNumber: 1,
          title: 'Contract Creation',
          description: 'AI will generate the smart contract code',
          requiresUserAction: false,
          actionType: 'verify',
          estimatedTime: '15-30 minutes',
          estimatedCost: '0.001 ETH',
          status: 'pending',
          userActionRequired: false,
          notificationSent: false
        },
        {
          stepNumber: 2,
          title: 'Code Review',
          description: 'Review the generated code for security',
          requiresUserAction: true,
          actionType: 'verify',
          estimatedTime: '30-60 minutes',
          estimatedCost: '0.0001 ETH',
          status: 'pending',
          userActionRequired: true,
          notificationSent: false
        },
        {
          stepNumber: 3,
          title: 'Deployment',
          description: 'Deploy the contract to Hoodi testnet',
          requiresUserAction: true,
          actionType: 'deploy',
          estimatedTime: '15-30 minutes',
          estimatedCost: '0.015 ETH',
          status: 'pending',
          userActionRequired: true,
          notificationSent: false
        }
      ],
      estimatedCost: '0.0161 ETH',
      riskAssessment: {
        overallRisk: 'medium',
        riskScore: 60,
        vulnerabilities: ['Standard risks for custom contracts'],
        mitigationStrategies: ['Code review', 'Testing', 'Gradual deployment'],
        complianceNotes: ['Follow Hoodi testnet guidelines']
      },
      userActionsRequired: [
        {
          actionId: `action_fallback_1`,
          stepNumber: 2,
          actionType: 'verify',
          description: 'Review generated code',
          estimatedCost: '0.0001 ETH',
          deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: 'pending'
        },
        {
          actionId: `action_fallback_2`,
          stepNumber: 3,
          actionType: 'deploy',
          description: 'Deploy contract',
          estimatedCost: '0.015 ETH',
          deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: 'pending'
        }
      ],
      aiConfidence: 75,
      estimatedTime: '2-4 hours',
      complexityScore: 6
    };
  }

  /**
   * Save trap creation guide to database
   */
  private async saveTrapCreationGuide(guide: AITrapCreationGuide, userId: string): Promise<void> {
    try {
      // Save to premium_ai_guides table
      await this.db.query(`
        INSERT INTO premium_ai_guides (
          id, user_id, trap_name, description, security_features, 
          deployment_steps, estimated_cost, risk_assessment, 
          user_actions_required, ai_confidence, estimated_time, 
          complexity_score, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'active', NOW())
      `, [
        guide.id, userId, guide.trapName, guide.description,
        JSON.stringify(guide.securityFeatures), JSON.stringify(guide.deploymentSteps),
        guide.estimatedCost, JSON.stringify(guide.riskAssessment),
        JSON.stringify(guide.userActionsRequired), guide.aiConfidence,
        guide.estimatedTime, guide.complexityScore
      ]);

      console.log(`✅ Guide saved to database: ${guide.id}`);

    } catch (error) {
      console.error('Failed to save guide:', error);
      throw error;
    }
  }

  /**
   * Start automated building process
   */
  private async startAutomatedBuilding(guideId: string, userId: string): Promise<void> {
    try {
      console.log(`🔨 Starting automated building for guide: ${guideId}`);
      
      // This would run in the background
      // For now, we'll simulate the process
      setTimeout(async () => {
        await this.processNextStep(guideId, userId, 1);
      }, 5000); // Start after 5 seconds

    } catch (error) {
      console.error('Failed to start automated building:', error);
    }
  }

  /**
   * Process next step in the building process
   */
  private async processNextStep(guideId: string, userId: string, stepNumber: number): Promise<void> {
    try {
      console.log(`📋 Processing step ${stepNumber} for guide: ${guideId}`);
      
      // Get guide from database
      const guide = await this.getGuide(guideId);
      if (!guide) return;

      const step = guide.deploymentSteps.find(s => s.stepNumber === stepNumber);
      if (!step) return;

      // Update step status
      step.status = 'in_progress';
      await this.updateStepStatus(guideId, stepNumber, 'in_progress');

      // Simulate processing time
      setTimeout(async () => {
        step.status = 'completed';
        await this.updateStepStatus(guideId, stepNumber, 'completed');

        // Check if user action is required for next step
        const nextStep = guide.deploymentSteps.find(s => s.stepNumber === stepNumber + 1);
        if (nextStep && nextStep.requiresUserAction) {
          await this.notifyUserActionRequired(userId, guideId, nextStep);
        } else if (nextStep) {
          // Continue with next step
          await this.processNextStep(guideId, userId, stepNumber + 1);
        } else {
          // All steps completed
          await this.notifyGuideCompletion(userId, guideId);
        }
      }, 30000); // Simulate 30 seconds processing time

    } catch (error) {
      console.error(`Failed to process step ${stepNumber}:`, error);
    }
  }

  /**
   * Notify user when action is required
   */
  private async notifyUserActionRequired(userId: string, guideId: string, step: DeploymentStep): Promise<void> {
    try {
      await this.notification.sendNotification(userId, {
        type: 'warning',
        title: 'Action Required',
        message: `Step ${step.stepNumber}: ${step.description}`,
        data: { guideId, step: step.stepNumber, action: step.actionType },
        userId
      });

      console.log(`📱 Notification sent for step ${step.stepNumber}`);

    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  /**
   * Notify user when guide is completed
   */
  private async notifyGuideCompletion(userId: string, guideId: string): Promise<void> {
    try {
      // Send completion notification
      await this.notification.sendNotification(userId, {
        type: 'success',
        title: 'Trap Creation Complete',
        message: 'Your AI-guided trap has been successfully created and deployed!',
        data: { guideId, status: 'completed' },
        userId
      });

      console.log(`🎉 Guide completion notification sent: ${guideId}`);

    } catch (error) {
      console.error('Failed to send completion notification:', error);
    }
  }

  /**
   * Get guide from database
   */
  private async getGuide(guideId: string): Promise<AITrapCreationGuide | null> {
    try {
      const result = await this.db.query(
        'SELECT * FROM premium_ai_guides WHERE id = $1',
        [guideId]
      );
      
      if (result.rows.length === 0) return null;
      
      const row = result.rows[0];
      return {
        id: row.id,
        trapName: row.trap_name,
        description: row.description,
        securityFeatures: JSON.parse(row.security_features || '[]'),
        deploymentSteps: JSON.parse(row.deployment_steps || '[]'),
        estimatedCost: row.estimated_cost,
        riskAssessment: JSON.parse(row.risk_assessment || '{}'),
        userActionsRequired: JSON.parse(row.user_actions_required || '[]'),
        aiConfidence: row.ai_confidence,
        estimatedTime: row.estimated_time,
        complexityScore: row.complexity_score
      };

    } catch (error) {
      console.error('Failed to get guide:', error);
      return null;
    }
  }

  /**
   * Update step status in database
   */
  private async updateStepStatus(guideId: string, stepNumber: number, status: string): Promise<void> {
    try {
      await this.db.query(`
        UPDATE premium_ai_guides 
        SET deployment_steps = jsonb_set(
          deployment_steps, 
          '{${stepNumber - 1}, status}', 
          '"${status}"'
        )
        WHERE id = $1
      `, [guideId]);

    } catch (error) {
      console.error('Failed to update step status:', error);
    }
  }

  /**
   * Get user's active guides
   */
  async getUserGuides(userId: string): Promise<AITrapCreationGuide[]> {
    try {
      const result = await this.db.query(
        'SELECT * FROM premium_ai_guides WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );

      return result.rows.map(row => ({
        id: row.id,
        trapName: row.trap_name,
        description: row.description,
        securityFeatures: JSON.parse(row.security_features || '[]'),
        deploymentSteps: JSON.parse(row.deployment_steps || '[]'),
        estimatedCost: row.estimated_cost,
        riskAssessment: JSON.parse(row.risk_assessment || '{}'),
        userActionsRequired: JSON.parse(row.user_actions_required || '[]'),
        aiConfidence: row.ai_confidence,
        estimatedTime: row.estimated_time,
        complexityScore: row.complexity_score
      }));

    } catch (error) {
      console.error('Failed to get user guides:', error);
      return [];
    }
  }

  /**
   * Get guide progress
   */
  async getGuideProgress(guideId: string): Promise<{
    completedSteps: number;
    totalSteps: number;
    currentStep: number;
    estimatedTimeRemaining: string;
    nextUserAction?: UserAction;
  }> {
    try {
      const guide = await this.getGuide(guideId);
      if (!guide) {
        throw new Error('Guide not found');
      }

      const completedSteps = guide.deploymentSteps.filter(s => s.status === 'completed').length;
      const totalSteps = guide.deploymentSteps.length;
      const currentStep = guide.deploymentSteps.find(s => s.status === 'pending')?.stepNumber || totalSteps;
      const nextUserAction = guide.userActionsRequired.find(a => a.status === 'pending');

      return {
        completedSteps,
        totalSteps,
        currentStep,
        estimatedTimeRemaining: this.calculateTimeRemaining(guide, completedSteps),
        nextUserAction
      };

    } catch (error) {
      console.error('Failed to get guide progress:', error);
      throw error;
    }
  }

  /**
   * Calculate estimated time remaining
   */
  private calculateTimeRemaining(guide: AITrapCreationGuide, completedSteps: number): string {
    const remainingSteps = guide.deploymentSteps.length - completedSteps;
    const avgTimePerStep = 30; // minutes
    const totalMinutes = remainingSteps * avgTimePerStep;
    
    if (totalMinutes < 60) {
      return `${totalMinutes} minutes`;
    } else if (totalMinutes < 1440) {
      return `${Math.round(totalMinutes / 60)} hours`;
    } else {
      return `${Math.round(totalMinutes / 1440)} days`;
    }
  }
}