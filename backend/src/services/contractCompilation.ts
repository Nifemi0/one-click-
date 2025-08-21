import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

export interface CompiledContract {
  name: string;
  abi: any[];
  bytecode: string;
  deployedBytecode?: string;
  sourceMap?: string;
  compilerVersion: string;
  optimization: boolean;
  runs: number;
}

export interface CompilationResult {
  success: boolean;
  contracts: CompiledContract[];
  errors?: string[];
  warnings?: string[];
}

/**
 * @title ContractCompilationService
 * @dev Service for compiling Solidity smart contracts using Hardhat
 * @dev Provides integration between the backend and Hardhat compilation system
 */
export class ContractCompilationService {
  private projectRoot: string;
  private contractsDir: string;
  private artifactsDir: string;

  constructor() {
    this.projectRoot = path.resolve(__dirname, '../../..');
    this.contractsDir = path.join(this.projectRoot, 'contracts');
    this.artifactsDir = path.join(this.projectRoot, 'artifacts');
  }

  /**
   * @dev Compile all contracts in the contracts directory
   */
  async compileAllContracts(): Promise<CompilationResult> {
    try {
      console.log('🔨 Starting contract compilation...');
      
      // Check if Hardhat is available
      if (!await this.isHardhatAvailable()) {
        throw new Error('Hardhat is not available. Please install Hardhat first.');
      }

      // Clean previous artifacts
      await this.cleanArtifacts();

      // Compile contracts using Hardhat
      const { stdout, stderr } = await execAsync('npx hardhat compile', {
        cwd: this.projectRoot,
        timeout: 60000 // 60 second timeout
      });

      if (stderr && !stderr.includes('Warning')) {
        console.error('❌ Compilation errors:', stderr);
        return {
          success: false,
          contracts: [],
          errors: [stderr]
        };
      }

      console.log('✅ Compilation completed successfully');
      console.log('📝 Compilation output:', stdout);

      // Extract compiled contracts
      const contracts = await this.extractCompiledContracts();
      
      return {
        success: true,
        contracts,
        warnings: stderr ? [stderr] : undefined
      };

    } catch (error: any) {
      console.error('❌ Contract compilation failed:', error);
      return {
        success: false,
        contracts: [],
        errors: [error.message]
      };
    }
  }

  /**
   * @dev Compile a specific contract by name
   */
  async compileContract(contractName: string): Promise<CompiledContract | null> {
    try {
      console.log(`🔨 Compiling specific contract: ${contractName}`);
      
      // First check if the contract source exists
      const contractPath = path.join(this.contractsDir, `${contractName}.sol`);
      if (!fs.existsSync(contractPath)) {
        console.error(`❌ Contract source not found: ${contractPath}`);
        return null;
      }

      // Compile all contracts (Hardhat doesn't support single contract compilation easily)
      const result = await this.compileAllContracts();
      
      if (!result.success) {
        console.error('❌ Compilation failed:', result.errors);
        return null;
      }

      // Find the specific contract in the results
      const contract = result.contracts.find(c => c.name === contractName);
      
      if (!contract) {
        console.error(`❌ Contract ${contractName} not found in compilation results`);
        return null;
      }

      console.log(`✅ Successfully compiled ${contractName}`);
      return contract;

    } catch (error: any) {
      console.error(`❌ Failed to compile contract ${contractName}:`, error);
      return null;
    }
  }

  /**
   * @dev Get contract artifacts (ABI and bytecode) for a specific contract
   */
  async getContractArtifacts(contractName: string): Promise<{ abi: any[]; bytecode: string; sourceCode: string } | null> {
    try {
      // First try to get from existing artifacts (Hardhat format: artifacts/contracts/ContractName.sol/ContractName.json)
      const artifactsPath = path.join(this.artifactsDir, 'contracts', `${contractName}.sol`, `${contractName}.json`);
      
      if (fs.existsSync(artifactsPath)) {
        const contractData = JSON.parse(fs.readFileSync(artifactsPath, 'utf8'));
        
        // Get source code
        const sourcePath = path.join(this.contractsDir, `${contractName}.sol`);
        const sourceCode = fs.existsSync(sourcePath) ? fs.readFileSync(sourcePath, 'utf8') : '';
        
        return {
          abi: contractData.abi || [],
          bytecode: contractData.bytecode || '',
          sourceCode
        };
      }

      // If artifacts don't exist, try to compile the contract
      const contract = await this.compileContract(contractName);
      if (contract) {
        const sourcePath = path.join(this.contractsDir, `${contractName}.sol`);
        const sourceCode = fs.existsSync(sourcePath) ? fs.readFileSync(sourcePath, 'utf8') : '';
        
        return {
          abi: contract.abi,
          bytecode: contract.bytecode,
          sourceCode
        };
      }

      return null;

    } catch (error) {
      console.error(`❌ Error getting artifacts for ${contractName}:`, error);
      return null;
    }
  }

  /**
   * @dev Get contract templates for the frontend
   */
  async getContractTemplates(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    type: 'honeypot' | 'sandbox' | 'monitoring' | 'basic';
    complexity: 'basic' | 'medium' | 'advanced';
    estimatedCost: number;
    estimatedGas: number;
    features: string[];
    abi: any[];
    bytecode: string;
    sourceCode: string;
    optimizerRuns: number;
  }>> {
    try {
      const availableContracts = await this.getAvailableContracts();
      const templates: Array<{
        id: string;
        name: string;
        description: string;
        type: 'honeypot' | 'sandbox' | 'monitoring' | 'basic';
        complexity: 'basic' | 'medium' | 'advanced';
        estimatedCost: number;
        estimatedGas: number;
        features: string[];
        abi: any[];
        bytecode: string;
        sourceCode: string;
        optimizerRuns: number;
      }> = [];

      for (const contractName of availableContracts) {
        const artifacts = await this.getContractArtifacts(contractName);
        if (artifacts) {
          // Determine contract type and complexity based on name
          let type: 'honeypot' | 'sandbox' | 'monitoring' | 'basic' = 'basic';
          let complexity: 'basic' | 'medium' | 'advanced' = 'medium';
          let features: string[] = ['Security Protection'];

          if (contractName.includes('Honeypot')) {
            type = 'honeypot';
            complexity = 'advanced';
            features.push('Fund Capture', 'Attack Detection');
          } else if (contractName.includes('MEV')) {
            type = 'monitoring';
            complexity = 'advanced';
            features.push('MEV Protection', 'Sandwich Attack Prevention');
          } else if (contractName.includes('MultiSig')) {
            type = 'basic';
            complexity = 'medium';
            features.push('Multi-Signature', 'Access Control');
          } else if (contractName.includes('FlashLoan')) {
            type = 'monitoring';
            complexity = 'advanced';
            features.push('Flash Loan Protection', 'Attack Prevention');
          }

          // Estimate gas and cost (more accurate calculation)
          const baseGas = 21000; // Base transaction gas
          const contractGas = Math.ceil(artifacts.bytecode.length / 2); // Contract deployment gas
          const estimatedGas = baseGas + contractGas;
          const estimatedCost = (estimatedGas * 0.000000001).toFixed(6); // Rough ETH cost

          templates.push({
            id: contractName.toLowerCase(),
            name: contractName,
            description: `${type.charAt(0).toUpperCase() + type.slice(1)} security trap with ${complexity} complexity`,
            type,
            complexity,
            estimatedCost: parseFloat(estimatedCost),
            estimatedGas,
            features,
            abi: artifacts.abi,
            bytecode: artifacts.bytecode,
            sourceCode: artifacts.sourceCode,
            optimizerRuns: 200
          });
        }
      }

      return templates;

    } catch (error) {
      console.error('❌ Error getting contract templates:', error);
      return [];
    }
  }

  /**
   * @dev Get list of available contract names
   */
  async getAvailableContracts(): Promise<string[]> {
    try {
      if (!fs.existsSync(this.contractsDir)) {
        return [];
      }

      const files = fs.readdirSync(this.contractsDir);
      return files
        .filter(file => file.endsWith('.sol'))
        .map(file => path.basename(file, '.sol'));

    } catch (error) {
      console.error('❌ Error reading contracts directory:', error);
      return [];
    }
  }

  /**
   * @dev Validate contract source code
   */
  async validateContractSource(contractName: string): Promise<{
    valid: boolean;
    errors?: string[];
    warnings?: string[];
  }> {
    try {
      const contractPath = path.join(this.contractsDir, `${contractName}.sol`);
      
      if (!fs.existsSync(contractPath)) {
        return {
          valid: false,
          errors: [`Contract ${contractName}.sol not found`]
        };
      }

      // Try to compile just this contract
      const contract = await this.compileContract(contractName);
      
      if (!contract) {
        return {
          valid: false,
          errors: [`Failed to compile contract ${contractName}`]
        };
      }

      return {
        valid: true
      };

    } catch (error: any) {
      return {
        valid: false,
        errors: [error.message]
      };
    }
  }

  /**
   * @dev Check if Hardhat is available in the project
   */
  private async isHardhatAvailable(): Promise<boolean> {
    try {
      await execAsync('npx hardhat --version', { cwd: this.projectRoot });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * @dev Clean previous compilation artifacts
   */
  private async cleanArtifacts(): Promise<void> {
    try {
      if (fs.existsSync(this.artifactsDir)) {
        fs.rmSync(this.artifactsDir, { recursive: true, force: true });
        console.log('🧹 Cleaned previous artifacts');
      }
    } catch (error) {
      console.warn('⚠️ Could not clean artifacts:', error);
    }
  }

  /**
   * @dev Extract compiled contracts from Hardhat artifacts
   */
  private async extractCompiledContracts(): Promise<CompiledContract[]> {
    const contracts: CompiledContract[] = [];
    
    try {
      if (!fs.existsSync(this.artifactsDir)) {
        console.warn('⚠️ Artifacts directory not found');
        return contracts;
      }

      // Hardhat creates artifacts in artifacts/contracts/ContractName.sol/ContractName.json format
      const contractsDir = path.join(this.artifactsDir, 'contracts');
      
      if (!fs.existsSync(contractsDir)) {
        console.warn('⚠️ Contracts artifacts directory not found');
        return contracts;
      }

      // Read contracts artifacts directory
      const contractDirs = fs.readdirSync(contractsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name.endsWith('.sol'));

      for (const contractDir of contractDirs) {
        const contractName = contractDir.name.replace('.sol', '');
        const contractPath = path.join(contractsDir, contractDir.name);
        const contractJsonPath = path.join(contractPath, `${contractName}.json`);
        
        if (fs.existsSync(contractJsonPath)) {
          try {
            const contractData = JSON.parse(fs.readFileSync(contractJsonPath, 'utf8'));
            
            const contract: CompiledContract = {
              name: contractName,
              abi: contractData.abi || [],
              bytecode: contractData.bytecode || '',
              deployedBytecode: contractData.deployedBytecode || '',
              sourceMap: contractData.sourceMap || '',
              compilerVersion: contractData.compilerVersion || 'unknown',
              optimization: contractData.optimization || false,
              runs: contractData.runs || 0
            };
            
            contracts.push(contract);
            console.log(`📋 Extracted contract: ${contract.name}`);
          } catch (parseError) {
            console.warn(`⚠️ Could not parse contract ${contractName}:`, parseError);
          }
        } else {
          console.warn(`⚠️ Contract JSON not found for ${contractName} at ${contractJsonPath}`);
        }
      }

    } catch (error) {
      console.error('❌ Error extracting compiled contracts:', error);
    }

    return contracts;
  }
}
