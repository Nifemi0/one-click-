'use client';

import { ethers } from 'ethers';

export interface MFAMethod {
  id: string;
  type: 'totp' | 'biometric' | 'hardware' | 'email' | 'sms';
  name: string;
  isEnabled: boolean;
  isVerified: boolean;
  createdAt: number;
  lastUsed?: number;
}

export interface MFASession {
  id: string;
  userId: string;
  walletAddress: string;
  isActive: boolean;
  createdAt: number;
  expiresAt: number;
  lastActivity: number;
}

export interface BiometricData {
  type: 'fingerprint' | 'face' | 'voice';
  isAvailable: boolean;
  isEnrolled: boolean;
  lastUsed?: number;
}

export class MFAService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private mfaMethods: Map<string, MFAMethod> = new Map();
  private activeSessions: Map<string, MFASession> = new Map();

  constructor() {
    this.initializeProvider();
    this.loadStoredMFAMethods();
  }

  private async initializeProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        console.log('MFA service provider initialized');
      } catch (error) {
        console.error('Failed to initialize MFA provider:', error);
      }
    }
  }

  private loadStoredMFAMethods() {
    try {
      if (typeof window === 'undefined') return;
      const stored = localStorage.getItem('mfaMethods');
      if (stored) {
        const methods: MFAMethod[] = JSON.parse(stored);
        methods.forEach(method => {
          this.mfaMethods.set(method.id, method);
        });
      }
    } catch (error) {
      console.error('Failed to load stored MFA methods:', error);
    }
  }

  private saveMFAMethods() {
    try {
      if (typeof window === 'undefined') return;
      const methods = Array.from(this.mfaMethods.values());
      localStorage.setItem('mfaMethods', JSON.stringify(methods));
    } catch (error) {
      console.error('Failed to save MFA methods:', error);
    }
  }

  async setupTOTP(secret: string, name: string): Promise<MFAMethod> {
    const method: MFAMethod = {
      id: `totp_${Date.now()}_${Math.random()}`,
      type: 'totp',
      name,
      isEnabled: false,
      isVerified: false,
      createdAt: Date.now()
    };

    this.mfaMethods.set(method.id, method);
    this.saveMFAMethods();

    return method;
  }

  async verifyTOTP(methodId: string, code: string): Promise<boolean> {
    const method = this.mfaMethods.get(methodId);
    if (!method || method.type !== 'totp') {
      return false;
    }

    // In a real implementation, you would verify the TOTP code
    // For now, we'll simulate verification with a simple check
    const isValid = code.length === 6 && /^\d{6}$/.test(code);
    
    if (isValid) {
      method.isVerified = true;
      method.isEnabled = true;
      method.lastUsed = Date.now();
      this.saveMFAMethods();
    }

    return isValid;
  }

  async setupBiometric(type: 'fingerprint' | 'face' | 'voice'): Promise<MFAMethod> {
    // Check if biometric authentication is available
    if (!this.isBiometricAvailable(type)) {
      throw new Error(`Biometric authentication (${type}) is not available on this device`);
    }

    const method: MFAMethod = {
      id: `biometric_${type}_${Date.now()}_${Math.random()}`,
      type: 'biometric',
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Authentication`,
      isEnabled: false,
      isVerified: false,
      createdAt: Date.now()
    };

    this.mfaMethods.set(method.id, method);
    this.saveMFAMethods();

    return method;
  }

  async verifyBiometric(methodId: string): Promise<boolean> {
    const method = this.mfaMethods.get(methodId);
    if (!method || method.type !== 'biometric') {
      return false;
    }

    try {
      // In a real implementation, you would trigger biometric authentication
      // For now, we'll simulate it
      const isVerified = await this.simulateBiometricAuth();
      
      if (isVerified) {
        method.isVerified = true;
        method.isEnabled = true;
        method.lastUsed = Date.now();
        this.saveMFAMethods();
      }

      return isVerified;
    } catch (error) {
      console.error('Biometric verification failed:', error);
      return false;
    }
  }

  private async simulateBiometricAuth(): Promise<boolean> {
    // Simulate biometric authentication
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 90% success rate
        resolve(Math.random() > 0.1);
      }, 1000);
    });
  }

  private isBiometricAvailable(type: 'fingerprint' | 'face' | 'voice'): boolean {
    if (typeof window === 'undefined') return false;

    // Check for WebAuthn support
    if (window.PublicKeyCredential) {
      return true;
    }

    // Check for specific biometric APIs
    if (type === 'fingerprint' && 'credentials' in navigator) {
      return true;
    }

    return false;
  }

  async setupHardwareWallet(): Promise<MFAMethod> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    const address = await this.signer.getAddress();
    
    const method: MFAMethod = {
      id: `hardware_${Date.now()}_${Math.random()}`,
      type: 'hardware',
      name: `Hardware Wallet (${address.slice(0, 6)}...${address.slice(-4)})`,
      isEnabled: true,
      isVerified: true,
      createdAt: Date.now(),
      lastUsed: Date.now()
    };

    this.mfaMethods.set(method.id, method);
    this.saveMFAMethods();

    return method;
  }

  async verifyHardwareWallet(methodId: string): Promise<boolean> {
    const method = this.mfaMethods.get(methodId);
    if (!method || method.type !== 'hardware') {
      return false;
    }

    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      // Request signature to verify hardware wallet access
      const message = `Verify MFA access: ${Date.now()}`;
      const signature = await this.signer.signMessage(message);
      
      if (signature) {
        method.lastUsed = Date.now();
        this.saveMFAMethods();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Hardware wallet verification failed:', error);
      return false;
    }
  }

  async createSession(walletAddress: string, userId: string): Promise<MFASession> {
    const session: MFASession = {
      id: `session_${Date.now()}_${Math.random()}`,
      userId,
      walletAddress,
      isActive: true,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      lastActivity: Date.now()
    };

    this.activeSessions.set(session.id, session);
    return session;
  }

  async validateSession(sessionId: string): Promise<boolean> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return false;
    }

    if (!session.isActive || Date.now() > session.expiresAt) {
      this.activeSessions.delete(sessionId);
      return false;
    }

    session.lastActivity = Date.now();
    return true;
  }

  async requireMFAVerification(sessionId: string): Promise<boolean> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return false;
    }

    // Check if any MFA method is enabled
    const enabledMethods = Array.from(this.mfaMethods.values())
      .filter(method => method.isEnabled && method.isVerified);

    if (enabledMethods.length === 0) {
      return true; // No MFA required
    }

    // For now, we'll require verification if MFA is enabled
    // In a real implementation, you might check session age, risk level, etc.
    return false;
  }

  async getMFAMethods(): Promise<MFAMethod[]> {
    return Array.from(this.mfaMethods.values());
  }

  async enableMFAMethod(methodId: string): Promise<boolean> {
    const method = this.mfaMethods.get(methodId);
    if (!method) {
      return false;
    }

    method.isEnabled = true;
    this.saveMFAMethods();
    return true;
  }

  async disableMFAMethod(methodId: string): Promise<boolean> {
    const method = this.mfaMethods.get(methodId);
    if (!method) {
      return false;
    }

    method.isEnabled = false;
    this.saveMFAMethods();
    return true;
  }

  async deleteMFAMethod(methodId: string): Promise<boolean> {
    const deleted = this.mfaMethods.delete(methodId);
    if (deleted) {
      this.saveMFAMethods();
    }
    return deleted;
  }

  async getSecurityScore(): Promise<number> {
    const methods = Array.from(this.mfaMethods.values());
    const enabledMethods = methods.filter(m => m.isEnabled && m.isVerified);
    
    let score = 0;
    
    // Base score for having any MFA
    if (enabledMethods.length > 0) {
      score += 30;
    }

    // Additional points for multiple methods
    if (enabledMethods.length > 1) {
      score += 20;
    }

    // Points for specific method types
    enabledMethods.forEach(method => {
      switch (method.type) {
        case 'hardware':
          score += 25; // Hardware wallets are most secure
          break;
        case 'biometric':
          score += 20; // Biometric is very secure
          break;
        case 'totp':
          score += 15; // TOTP is secure
          break;
        case 'email':
          score += 10; // Email is less secure
          break;
        case 'sms':
          score += 5; // SMS is least secure
          break;
      }
    });

    return Math.min(100, score);
  }

  async isSessionSecure(sessionId: string): Promise<boolean> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return false;
    }

    // Check if session is recent and active
    const isRecent = Date.now() - session.lastActivity < (5 * 60 * 1000); // 5 minutes
    const isActive = session.isActive && Date.now() < session.expiresAt;

    return isRecent && isActive;
  }

  async refreshSession(sessionId: string): Promise<boolean> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return false;
    }

    session.lastActivity = Date.now();
    session.expiresAt = Date.now() + (24 * 60 * 60 * 1000); // Extend by 24 hours
    return true;
  }
}

// Export singleton instance
export const mfaService = new MFAService();
