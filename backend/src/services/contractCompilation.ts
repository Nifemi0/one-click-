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
      
      // First compile all contracts
      const result = await this.compileAllContracts();
      
      if (!result.success) {
        throw new Error(`Compilation failed: ${result.errors?.join(', ')}`);
      }

      // Find the specific contract
      const contract = result.contracts.find(c => c.name === contractName);
      
      if (!contract) {
        throw new Error(`Contract ${contractName} not found in compilation results`);
      }

      return contract;

    } catch (error: any) {
      console.error(`❌ Failed to compile contract ${contractName}:`, error);
      return null;
    }
  }

  /**
   * @dev Get contract ABI and bytecode for deployment
   */
  async getContractArtifacts(contractName: string): Promise<{
    abi: any[];
    bytecode: string;
  } | null> {
    try {
      const contract = await this.compileContract(contractName);
      
      if (!contract) {
        return null;
      }

      return {
        abi: contract.abi,
        bytecode: contract.bytecode
      };

    } catch (error: any) {
      console.error(`❌ Failed to get artifacts for ${contractName}:`, error);
      return null;
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

      // Read artifacts directory
      const contractDirs = fs.readdirSync(this.artifactsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name !== 'build-info');

      for (const contractDir of contractDirs) {
        const contractPath = path.join(this.artifactsDir, contractDir.name);
        const contractJsonPath = path.join(contractPath, `${contractDir.name}.json`);
        
        if (fs.existsSync(contractJsonPath)) {
          try {
            const contractData = JSON.parse(fs.readFileSync(contractJsonPath, 'utf8'));
            
            const contract: CompiledContract = {
              name: contractDir.name,
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
            console.warn(`⚠️ Could not parse contract ${contractDir.name}:`, parseError);
          }
        }
      }

    } catch (error) {
      console.error('❌ Error extracting compiled contracts:', error);
    }

    return contracts;
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
}
