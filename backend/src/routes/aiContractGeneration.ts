import express from 'express';
import AIIntegrationService, { AIContractRequest } from '../services/aiIntegrationService';
import { ContractCompilationService } from '../services/contractCompilation';

const router = express.Router();
const aiService = new AIIntegrationService();
const compilationService = new ContractCompilationService();

/**
 * POST /api/ai-contracts/generate
 * Generate smart contract using AI
 */
router.post('/generate', async (req, res) => {
  try {
    console.log('🤖 AI Contract Generation Request:', req.body);
    
    const {
      userPrompt,
      securityLevel = 'premium',
      complexity = 'medium',
      targetNetwork = 560048,
      customRequirements = []
    } = req.body;

    if (!userPrompt) {
      return res.status(400).json({
        success: false,
        error: 'User prompt is required'
      });
    }

    // Validate inputs
    const validSecurityLevels = ['basic', 'premium', 'enterprise'];
    const validComplexities = ['simple', 'medium', 'complex'];
    
    if (!validSecurityLevels.includes(securityLevel)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid security level. Must be basic, premium, or enterprise'
      });
    }

    if (!validComplexities.includes(complexity)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid complexity. Must be simple, medium, or complex'
      });
    }

    const aiRequest: AIContractRequest = {
      userPrompt,
      securityLevel,
      complexity,
      targetNetwork,
      customRequirements
    };

    console.log('🚀 Starting AI contract generation...');
    const aiResponse = await aiService.generateContract(aiRequest);
    
    if (!aiResponse.success) {
      throw new Error('AI contract generation failed');
    }

    console.log('✅ AI contract generated successfully');
    console.log(`📊 AI Provider: ${aiResponse.aiProvider}`);
    console.log(`🎯 Confidence: ${aiResponse.confidence * 100}%`);

    return res.status(200).json({
      success: true,
      data: {
        contractCode: aiResponse.contractCode,
        contractName: aiResponse.contractName,
        description: aiResponse.description,
        securityFeatures: aiResponse.securityFeatures,
        estimatedGas: aiResponse.estimatedGas,
        riskAssessment: aiResponse.riskAssessment,
        compilationInstructions: aiResponse.compilationInstructions,
        deploymentNotes: aiResponse.deploymentNotes,
        aiProvider: aiResponse.aiProvider,
        confidence: aiResponse.confidence,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('❌ AI Contract Generation Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate contract',
      details: error.message
    });
  }
});

/**
 * POST /api/ai-contracts/compile
 * Compile the AI-generated contract
 */
router.post('/compile', async (req, res) => {
  try {
    console.log('📋 AI Contract Compilation Request');
    
    const { contractCode, contractName } = req.body;

    if (!contractCode || !contractName) {
      return res.status(400).json({
        success: false,
        error: 'Contract code and name are required'
      });
    }

    console.log('🔨 Starting contract compilation...');
    
    // Compile the contract using the dynamic compilation method
    const compilationResult = await compilationService.compileDynamicContract(
      contractCode,
      contractName
    );

    if (!compilationResult.success) {
      throw new Error(`Compilation failed: ${compilationResult.error}`);
    }

    console.log('✅ Contract compiled successfully');
    console.log(`📊 Gas Estimate: ${compilationResult.gasEstimate}`);
    console.log(`📄 Bytecode Size: ${compilationResult.bytecode?.length || 0} bytes`);

    return res.status(200).json({
      success: true,
      data: {
        contractName,
        abi: compilationResult.abi,
        bytecode: compilationResult.bytecode,
        gasEstimate: compilationResult.gasEstimate,
        compilerVersion: compilationResult.compilerVersion,
        optimization: compilationResult.optimization,
        runs: compilationResult.runs,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('❌ AI Contract Compilation Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to compile contract',
      details: error.message
    });
  }
});

/**
 * POST /api/ai-contracts/deploy
 * Deploy the compiled AI contract
 */
router.post('/deploy', async (req, res) => {
  try {
    console.log('🚀 AI Contract Deployment Request');
    
    const {
      contractName,
      abi,
      bytecode,
      constructorArgs = [],
      gasLimit,
      gasPrice
    } = req.body;

    if (!contractName || !abi || !bytecode) {
      return res.status(400).json({
        success: false,
        error: 'Contract name, ABI, and bytecode are required'
      });
    }

    console.log('⛓️ Starting contract deployment...');
    
    // For now, return a mock deployment result since RealContractDeploymentService is not properly initialized
    // TODO: Implement proper deployment service integration
    const deploymentResult = {
      success: true,
      contractAddress: '0x' + '0'.repeat(40), // Mock address
      transactionHash: '0x' + '0'.repeat(64), // Mock hash
      gasUsed: gasLimit || 300000,
      deploymentCost: '0.001' // Mock cost
    };

    console.log('✅ Contract deployment simulation completed');
    console.log(`📍 Contract Address: ${deploymentResult.contractAddress}`);
    console.log(`🔗 Transaction Hash: ${deploymentResult.transactionHash}`);

    return res.status(200).json({
      success: true,
      data: {
        contractName,
        contractAddress: deploymentResult.contractAddress,
        transactionHash: deploymentResult.transactionHash,
        gasUsed: deploymentResult.gasUsed,
        deploymentCost: deploymentResult.deploymentCost,
        network: 'Hoodi Testnet',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('❌ AI Contract Deployment Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to deploy contract',
      details: error.message
    });
  }
});

/**
 * POST /api/ai-contracts/generate-and-deploy
 * Complete workflow: Generate, compile, and deploy in one request
 */
router.post('/generate-and-deploy', async (req, res) => {
  try {
    console.log('🔄 Full AI Contract Workflow Request');
    
    const {
      userPrompt,
      securityLevel = 'premium',
      complexity = 'medium',
      targetNetwork = 560048,
      customRequirements = [],
      autoDeploy = false
    } = req.body;

    if (!userPrompt) {
      return res.status(400).json({
        success: false,
        error: 'User prompt is required'
      });
    }

    const workflowSteps: string[] = [];
    const startTime = Date.now();

    // Step 1: AI Generation
    console.log('🤖 Step 1: AI Contract Generation');
    workflowSteps.push('AI Generation');
    
    const aiRequest: AIContractRequest = {
      userPrompt,
      securityLevel,
      complexity,
      targetNetwork,
      customRequirements
    };

    const aiResponse = await aiService.generateContract(aiRequest);
    if (!aiResponse.success) {
      throw new Error('AI contract generation failed');
    }

    // Step 2: Compilation
    console.log('🔨 Step 2: Contract Compilation');
    workflowSteps.push('Compilation');
    
    const compilationResult = await compilationService.compileDynamicContract(
      aiResponse.contractCode,
      aiResponse.contractName
    );

    if (!compilationResult.success) {
      throw new Error(`Compilation failed: ${compilationResult.error}`);
    }

    let deploymentResult: any = null;
    
    // Step 3: Deployment (if requested)
    if (autoDeploy) {
      console.log('🚀 Step 3: Contract Deployment');
      workflowSteps.push('Deployment');
      
      // For now, return a mock deployment result since RealContractDeploymentService is not properly initialized
      // TODO: Implement proper deployment service integration
      deploymentResult = {
        success: true,
        contractAddress: '0x' + '0'.repeat(40), // Mock address
        transactionHash: '0x' + '0'.repeat(64), // Mock hash
        gasUsed: Math.floor((compilationResult.gasEstimate || 150000) * 1.2),
        deploymentCost: '0.001' // Mock cost
      };
    }

    const totalTime = Date.now() - startTime;

    console.log('✅ Full workflow completed successfully');
    console.log(`⏱️ Total time: ${totalTime}ms`);
    console.log(`📊 Steps completed: ${workflowSteps.join(' → ')}`);

    return res.status(200).json({
      success: true,
      data: {
        workflow: {
          steps: workflowSteps,
          totalTime,
          timestamp: new Date().toISOString()
        },
        aiGeneration: {
          contractCode: aiResponse.contractCode,
          contractName: aiResponse.contractName,
          description: aiResponse.description,
          securityFeatures: aiResponse.securityFeatures,
          estimatedGas: aiResponse.estimatedGas,
          riskAssessment: aiResponse.riskAssessment,
          aiProvider: aiResponse.aiProvider,
          confidence: aiResponse.confidence
        },
        compilation: {
          abi: compilationResult.abi,
          bytecode: compilationResult.bytecode,
          gasEstimate: compilationResult.gasEstimate,
          compilerVersion: compilationResult.compilerVersion
        },
        deployment: deploymentResult ? {
          contractAddress: deploymentResult.contractAddress,
          transactionHash: deploymentResult.transactionHash,
          gasUsed: deploymentResult.gasUsed,
          deploymentCost: deploymentResult.deploymentCost
        } : null
      }
    });

  } catch (error: any) {
    console.error('❌ Full AI Workflow Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Workflow failed',
      details: error.message
    });
  }
});

/**
 * GET /api/ai-contracts/status
 * Get status of AI services
 */
router.get('/status', async (req, res) => {
  try {
    const status = {
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY,
      compilation: true,
      deployment: true,
      timestamp: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      data: status
    });

  } catch (error: any) {
    console.error('❌ AI Status Check Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to check status',
      details: error.message
    });
  }
});

export default router;
