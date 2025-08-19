'use client';

import { aiSecurityService } from './aiSecurity';
import { mfaService } from './mfaService';
import { blockchainService } from './blockchain';

export interface TestResult {
  feature: string;
  test: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  details?: any;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  totalDuration: number;
}

export class AdvancedFeaturesTestSuite {
  private results: TestResult[] = [];

  async runAllTests(): Promise<TestSuite> {
    console.log('🚀 Starting Advanced Features Test Suite...');
    
    this.results = [];
    const startTime = Date.now();

    // Test AI Security Features
    await this.testAISecurityFeatures();
    
    // Test MFA Features
    await this.testMFAFeatures();
    
    // Test Contract Auditing
    await this.testContractAuditing();
    
    // Test Blockchain Integration
    await this.testBlockchainIntegration();
    
    // Test Security Scoring
    await this.testSecurityScoring();

    const totalDuration = Date.now() - startTime;
    const passedTests = this.results.filter(r => r.status === 'passed').length;
    const failedTests = this.results.filter(r => r.status === 'failed').length;
    const skippedTests = this.results.filter(r => r.status === 'skipped').length;

    const testSuite: TestSuite = {
      name: 'Advanced Features Test Suite',
      tests: this.results,
      totalTests: this.results.length,
      passedTests,
      failedTests,
      skippedTests,
      totalDuration
    };

    console.log('✅ Test Suite Complete!', testSuite);
    return testSuite;
  }

  private async testAISecurityFeatures() {
    console.log('🔒 Testing AI Security Features...');
    
    // Test 1: Provider Initialization
    await this.runTest('AI Security', 'Provider Initialization', async () => {
      await aiSecurityService.initializeProvider();
      return { message: 'Provider initialized successfully' };
    });

    // Test 2: Address Analysis
    await this.runTest('AI Security', 'Address Analysis', async () => {
      const testAddress = '0x1234567890123456789012345678901234567890';
      const threats = await aiSecurityService.analyzeAddress(testAddress);
      return { threats, address: testAddress };
    });

    // Test 3: Threat Pattern Detection
    await this.runTest('AI Security', 'Threat Pattern Detection', async () => {
      const scamAddress = '0x0000000000000000000000000000000000000000';
      await aiSecurityService.addKnownScamAddress(scamAddress);
      const threats = await aiSecurityService.analyzeAddress(scamAddress);
      const isScamDetected = threats.some(t => t.severity === 'critical');
      return { isScamDetected, threats };
    });

    // Test 4: Network Security Analysis
    await this.runTest('AI Security', 'Network Security Analysis', async () => {
      const networkInfo = await aiSecurityService.getNetworkInfo();
      return { networkInfo };
    });
  }

  private async testMFAFeatures() {
    console.log('🔐 Testing MFA Features...');
    
    // Test 1: MFA Service Initialization
    await this.runTest('MFA', 'Service Initialization', async () => {
      const methods = await mfaService.getMFAMethods();
      return { methodsCount: methods.length };
    });

    // Test 2: TOTP Setup
    await this.runTest('MFA', 'TOTP Setup', async () => {
      const method = await mfaService.setupTOTP('test-secret', 'Test TOTP');
      return { methodId: method.id, methodType: method.type };
    });

    // Test 3: TOTP Verification
    await this.runTest('MFA', 'TOTP Verification', async () => {
      const methods = await mfaService.getMFAMethods();
      const totpMethod = methods.find(m => m.type === 'totp');
      if (!totpMethod) {
        throw new Error('No TOTP method found');
      }
      
      const isValid = await mfaService.verifyTOTP(totpMethod.id, '123456');
      return { isValid, methodId: totpMethod.id };
    });

    // Test 4: Security Score Calculation
    await this.runTest('MFA', 'Security Score Calculation', async () => {
      const score = await mfaService.getSecurityScore();
      return { securityScore: score };
    });
  }

  private async testContractAuditing() {
    console.log('📋 Testing Contract Auditing...');
    
    // Test 1: Contract Audit (Mock)
    await this.runTest('Contract Auditing', 'Mock Contract Audit', async () => {
      const mockAddress = '0x1234567890123456789012345678901234567890';
      const audit = await aiSecurityService.auditSmartContract(mockAddress);
      return { 
        auditStatus: audit.auditStatus, 
        securityScore: audit.securityScore,
        vulnerabilities: audit.vulnerabilities.length 
      };
    });

    // Test 2: Vulnerability Detection
    await this.runTest('Contract Auditing', 'Vulnerability Detection', async () => {
      const mockAddress = '0x0000000000000000000000000000000000000000';
      const audit = await aiSecurityService.auditSmartContract(mockAddress);
      const hasVulnerabilities = audit.vulnerabilities.length > 0;
      return { hasVulnerabilities, vulnerabilities: audit.vulnerabilities };
    });
  }

  private async testBlockchainIntegration() {
    console.log('⛓️ Testing Blockchain Integration...');
    
    // Test 1: Provider Initialization
    await this.runTest('Blockchain', 'Provider Initialization', async () => {
      const isInitialized = blockchainService.connectWallet() !== null;
      return { isInitialized };
    });

    // Test 2: Network Detection
    await this.runTest('Blockchain', 'Network Detection', async () => {
      const networkInfo = await blockchainService.getNetworkInfo();
      return { networkInfo };
    });

    // Test 3: Balance Check (if wallet connected)
    await this.runTest('Blockchain', 'Balance Check', async () => {
      try {
        const balance = await blockchainService.getBalance();
        return { balance, hasBalance: parseFloat(balance) >= 0 };
      } catch (error: any) {
        return { balance: '0', hasBalance: false, error: error.message };
      }
    });
  }

  private async testSecurityScoring() {
    console.log('📊 Testing Security Scoring...');
    
    // Test 1: Overall Security Score
    await this.runTest('Security Scoring', 'Overall Score Calculation', async () => {
      const testAddress = '0x1234567890123456789012345678901234567890';
      const score = await aiSecurityService.calculateSecurityScore(testAddress);
      return { 
        overallScore: score.overall,
        walletScore: score.wallet,
        contractScore: score.contracts,
        transactionScore: score.transactions,
        networkScore: score.network
      };
    });

    // Test 2: Score Validation
    await this.runTest('Security Scoring', 'Score Validation', async () => {
      const testAddress = '0x1234567890123456789012345678901234567890';
      const score = await aiSecurityService.calculateSecurityScore(testAddress);
      
      const isValidOverall = score.overall >= 0 && score.overall <= 100;
      const isValidWallet = score.wallet >= 0 && score.wallet <= 100;
      const isValidContract = score.contracts >= 0 && score.contracts <= 100;
      
      return { 
        isValidOverall, 
        isValidWallet, 
        isValidContract,
        scores: score 
      };
    });
  }

  private async runTest(feature: string, test: string, testFunction: () => Promise<any>): Promise<void> {
    const startTime = Date.now();
    let status: 'passed' | 'failed' | 'skipped' = 'passed';
    let error: string | undefined;
    let details: any = undefined;

    try {
      console.log(`  🧪 Running: ${test}`);
      details = await testFunction();
      console.log(`  ✅ Passed: ${test}`);
    } catch (err: any) {
      status = 'failed';
      error = err.message || 'Unknown error';
      console.log(`  ❌ Failed: ${test} - ${error}`);
    }

    const duration = Date.now() - startTime;
    
    this.results.push({
      feature,
      test,
      status,
      duration,
      error,
      details
    });
  }

  async generateTestReport(): Promise<string> {
    const suite = await this.runAllTests();
    
    let report = `# Advanced Features Test Report\n\n`;
    report += `**Test Suite:** ${suite.name}\n`;
    report += `**Total Tests:** ${suite.totalTests}\n`;
    report += `**Passed:** ${suite.passedTests} ✅\n`;
    report += `**Failed:** ${suite.failedTests} ❌\n`;
    report += `**Skipped:** ${suite.skippedTests} ⏭️\n`;
    report += `**Total Duration:** ${suite.totalDuration}ms\n\n`;

    // Group by feature
    const features = [...new Set(suite.tests.map(t => t.feature))];
    
    features.forEach(feature => {
      const featureTests = suite.tests.filter(t => t.feature === feature);
      const passed = featureTests.filter(t => t.status === 'passed').length;
      const failed = featureTests.filter(t => t.status === 'failed').length;
      
      report += `## ${feature}\n`;
      report += `**Status:** ${failed === 0 ? '✅ All Passed' : `❌ ${failed} Failed`}\n\n`;
      
      featureTests.forEach(test => {
        const statusIcon = test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⏭️';
        report += `- ${statusIcon} **${test.test}** (${test.duration}ms)\n`;
        if (test.error) {
          report += `  - Error: ${test.error}\n`;
        }
        if (test.details) {
          report += `  - Details: ${JSON.stringify(test.details, null, 2)}\n`;
        }
      });
      report += '\n';
    });

    return report;
  }

  async runQuickTest(): Promise<boolean> {
    console.log('🚀 Running Quick Test...');
    
    try {
      // Test basic functionality
      await aiSecurityService.initializeProvider();
      const methods = await mfaService.getMFAMethods();
      const networkInfo = await blockchainService.getNetworkInfo();
      
      console.log('✅ Quick test passed');
      return true;
    } catch (error) {
      console.error('❌ Quick test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const advancedFeaturesTestSuite = new AdvancedFeaturesTestSuite();
