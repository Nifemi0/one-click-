import express from 'express';
import { ContractCompilationService } from '../services/contractCompilation';
import { RealContractDeploymentService } from '../services/realContractDeployment';
import { DatabaseService } from '../services/database';
import { NotificationService } from '../services/notification';

const router = express.Router();

// Initialize services
const db = new DatabaseService();
const notification = new NotificationService(db);
const compilation = new ContractCompilationService();
const realDeployment = new RealContractDeploymentService(db, notification, compilation);

/**
 * @route GET /api/real-contracts/status
 * @desc Get the status of real contract services
 * @access Public
 */
router.get('/status', async (req, res) => {
  try {
    const compilationStatus = {
      available: true,
      contracts: await compilation.getAvailableContracts()
    };

    const deploymentStatus = realDeployment.getStatus();
    
    return res.status(200).json({
      success: true,
      data: {
        compilation: compilationStatus,
        deployment: deploymentStatus,
        overall: compilationStatus.available && deploymentStatus.initialized
      }
    });
  } catch (error: any) {
    console.error('❌ Real contracts status error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route POST /api/real-contracts/compile
 * @desc Compile all contracts using Hardhat
 * @access Public
 */
router.post('/compile', async (req, res) => {
  try {
    console.log('🔨 Starting contract compilation...');
    
    const result = await compilation.compileAllContracts();
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Contracts compiled successfully',
        data: {
          contractsCount: result.contracts.length,
          contracts: result.contracts.map(c => ({
            name: c.name,
            compilerVersion: c.compilerVersion,
            optimization: c.optimization,
            runs: c.runs
          })),
          warnings: result.warnings
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Compilation failed',
        details: result.errors
      });
    }
  } catch (error: any) {
    console.error('❌ Contract compilation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route POST /api/real-contracts/compile/:contractName
 * @desc Compile a specific contract
 * @access Public
 */
router.post('/compile/:contractName', async (req, res) => {
  try {
    const { contractName } = req.params;
    
    console.log(`🔨 Compiling specific contract: ${contractName}`);
    
    const contract = await compilation.compileContract(contractName);
    
    if (contract) {
      return res.status(200).json({
        success: true,
        message: `Contract ${contractName} compiled successfully`,
        data: {
          name: contract.name,
          compilerVersion: contract.compilerVersion,
          optimization: contract.optimization,
          runs: contract.runs,
          hasBytecode: !!contract.bytecode,
          hasAbi: contract.abi.length > 0
        }
      });
    } else {
      return res.status(404).json({
        success: false,
        error: `Contract ${contractName} not found or compilation failed`
      });
    }
  } catch (error: any) {
    console.error('❌ Specific contract compilation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route POST /api/real-contracts/deploy
 * @desc Deploy a real compiled contract
 * @access Public
 */
router.post('/deploy', async (req, res) => {
  try {
    const {
      userId,
      contractName,
      constructorArgs = [],
      network,
      customName,
      customDescription
    } = req.body;

    // Validate required fields
    if (!userId || !contractName || !network) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, contractName, network'
      });
    }

    // Validate network
    if (network !== 560048) {
      return res.status(400).json({
        success: false,
        error: 'Only Hoodi testnet (560048) is supported for real deployments'
      });
    }

    // Check if deployment service is initialized
    if (!realDeployment.isInitialized()) {
      return res.status(503).json({
        success: false,
        error: 'Real contract deployment service not initialized'
      });
    }

    console.log(`🚀 Deploying real contract: ${contractName}`);

    const result = await realDeployment.deployRealContract({
      userId,
      contractName,
      constructorArgs,
      network,
      customName,
      customDescription
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Real contract deployed successfully',
        data: {
          contractAddress: result.contractAddress,
          transactionHash: result.transactionHash,
          gasUsed: result.gasUsed,
          deploymentCost: result.deploymentCost,
          contractName: result.contractName,
          network: result.network
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error || 'Deployment failed'
      });
    }

  } catch (error: any) {
    console.error('❌ Real contract deployment error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route GET /api/real-contracts/available
 * @desc Get list of available contracts for compilation
 * @access Public
 */
router.get('/available', async (req, res) => {
  try {
    const contracts = await compilation.getAvailableContracts();
    
    return res.status(200).json({
      success: true,
      data: {
        contracts,
        count: contracts.length
      }
    });
  } catch (error: any) {
    console.error('❌ Get available contracts error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route POST /api/real-contracts/validate/:contractName
 * @desc Validate contract source code
 * @access Public
 */
router.post('/validate/:contractName', async (req, res) => {
  try {
    const { contractName } = req.params;
    
    const validation = await compilation.validateContractSource(contractName);
    
    if (validation.valid) {
      return res.status(200).json({
        success: true,
        message: `Contract ${contractName} is valid`,
        data: {
          contractName,
          valid: true
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Contract validation failed',
        details: validation.errors
      });
    }
  } catch (error: any) {
    console.error('❌ Contract validation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * @route GET /api/real-contracts/deployment-status/:txHash
 * @desc Get deployment status by transaction hash
 * @access Public
 */
router.get('/deployment-status/:txHash', async (req, res) => {
  try {
    const { txHash } = req.params;
    
    const status = await realDeployment.getDeploymentStatus(txHash);
    
    return res.status(200).json({
      success: true,
      data: status
    });
  } catch (error: any) {
    console.error('❌ Get deployment status error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

export default router;
