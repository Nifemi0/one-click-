import { test, expect } from '@playwright/test';

test.describe('One Click Security - Full Integration Tests', () => {
  const BASE_URL = 'https://oneclick1.netlify.app';
  const BACKEND_URL = 'https://one-click-c308.onrender.com';

  test.beforeEach(async ({ page }) => {
    // Navigate to the main page before each test
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test.describe('Homepage & Navigation', () => {
    test('should load homepage successfully', async ({ page }) => {
      // Check if page loads
      await expect(page).toHaveTitle(/One Click/);
      await expect(page.locator('h1')).toContainText('Secure Your DeFi withOne Click');
      
      // Check if main sections are present
      await expect(page.locator('text=Features')).toBeVisible();
      await expect(page.locator('text=Security')).toBeVisible();
      await expect(page.locator('text=Marketplace')).toBeVisible();
    });

    test('should have working navigation links', async ({ page }) => {
      // Test navigation to different pages - handle trailing slashes
      await page.click('text=Deploy');
      await expect(page).toHaveURL(`${BASE_URL}/deploy/`);
      
      await page.click('text=Marketplace');
      await expect(page).toHaveURL(`${BASE_URL}/marketplace/`);
      
      await page.click('text=Dashboard');
      await expect(page).toHaveURL(`${BASE_URL}/app/`);
      
      await page.click('text=Home');
      await expect(page).toHaveURL(BASE_URL);
    });

    test('should have wallet connection button', async ({ page }) => {
      const connectButton = page.locator('button:has-text("Connect Wallet")');
      await expect(connectButton).toBeVisible();
      await expect(connectButton).toBeEnabled();
    });
  });

  test.describe('Wallet Connection', () => {
    test('should prompt for wallet connection on protected pages', async ({ page }) => {
      // Try to access deploy page without wallet
      await page.goto(`${BASE_URL}/deploy/`);
      await expect(page.locator('h1:has-text("Connect Your Wallet")')).toBeVisible();
      await expect(page.locator('text=Connect your wallet to deploy security traps')).toBeVisible();
      
      // Try to access marketplace without wallet
      await page.goto(`${BASE_URL}/marketplace/`);
      await expect(page.locator('h1:has-text("Connect Your Wallet")')).toBeVisible();
      await expect(page.locator('text=Connect your wallet to access the marketplace')).toBeVisible();
      
      // Try to access dashboard without wallet
      await page.goto(`${BASE_URL}/app/`);
      await expect(page.locator('h1:has-text("Connect Your Wallet")')).toBeVisible();
      await expect(page.locator('text=Connect your wallet to access One Click Security features')).toBeVisible();
    });
  });

  test.describe('Deploy Page Functionality', () => {
    test('should show trap templates when wallet is connected', async ({ page }) => {
      // Mock wallet connection (in real test, you'd connect actual wallet)
      await page.addInitScript(() => {
        window.ethereum = {
          request: async () => ['0x1234567890123456789012345678901234567890'],
          on: () => {},
          removeListener: () => {}
        };
        window.ethereum.isMetaMask = true;
      });
      
      await page.goto(`${BASE_URL}/deploy/`);
      await page.waitForTimeout(2000); // Wait for wallet detection
      
      // Check if templates are visible - use more flexible selectors
      await expect(page.locator('text=Basic Honeypot')).toBeVisible();
      await expect(page.locator('text=Reentrancy Guard')).toBeVisible();
      await expect(page.locator('text=Flash Loan Detector')).toBeVisible();
    });

    test('should allow template selection and configuration', async ({ page }) => {
      // Mock wallet connection
      await page.addInitScript(() => {
        window.ethereum = {
          request: async () => ['0x1234567890123456789012345678901234567890'],
          on: () => {},
          removeListener: () => {}
        };
        window.ethereum.isMetaMask = true;
      });
      
      await page.goto(`${BASE_URL}/deploy/`);
      await page.waitForTimeout(2000);
      
      // Select a template
      await page.click('text=Basic Honeypot');
      
      // Should show configuration step
      await expect(page.locator('text=Configure Your Trap')).toBeVisible();
      await expect(page.locator('text=Trap Name')).toBeVisible();
      await expect(page.locator('text=Description')).toBeVisible();
      
      // Fill configuration
      await page.fill('input[placeholder="Enter trap name"]', 'Test Trap');
      await page.fill('textarea[placeholder="Describe your trap"]', 'This is a test trap');
      
      // Should show proceed to payment button
      await expect(page.locator('button:has-text("Proceed to Payment")')).toBeVisible();
    });
  });

  test.describe('Marketplace Functionality', () => {
    test('should display marketplace items', async ({ page }) => {
      // Mock wallet connection
      await page.addInitScript(() => {
        window.ethereum = {
          request: async () => ['0x1234567890123456789012345678901234567890'],
          on: () => {},
          removeListener: () => {}
        };
        window.ethereum.isMetaMask = true;
      });
      
      await page.goto(`${BASE_URL}/marketplace/`);
      await page.waitForTimeout(2000);
      
      // Check if marketplace items are visible - use more flexible selectors
      await expect(page.locator('text=Advanced Honeypot Suite')).toBeVisible();
      await expect(page.locator('text=Flash Loan Defender Pro')).toBeVisible();
      await expect(page.locator('text=Multi-Sig Vault System')).toBeVisible();
    });

    test('should allow adding items to cart', async ({ page }) => {
      // Mock wallet connection
      await page.addInitScript(() => {
        window.ethereum = {
          request: async () => ['0x1234567890123456789012345678901234567890'],
          on: () => {},
          removeListener: () => {}
        };
        window.ethereum.isMetaMask = true;
      });
      
      await page.goto(`${BASE_URL}/marketplace/`);
      await page.waitForTimeout(2000);
      
      // Add item to cart
      await page.click('button:has-text("Add")');
      
      // Check if cart shows item
      await expect(page.locator('text=1 items in cart')).toBeVisible();
      await expect(page.locator('button:has-text("Checkout")')).toBeVisible();
    });

    test('should have working search and filters', async ({ page }) => {
      // Mock wallet connection
      await page.addInitScript(() => {
        window.ethereum = {
          request: async () => ['0x1234567890123456789012345678901234567890'],
          on: () => {},
          removeListener: () => {}
        };
        window.ethereum.isMetaMask = true;
      });
      
      await page.goto(`${BASE_URL}/marketplace/`);
      await page.waitForTimeout(2000);
      
      // Test search functionality
      await page.fill('input[placeholder="Search templates..."]', 'Honeypot');
      await page.waitForTimeout(1000);
      
      // Should show filtered results
      await expect(page.locator('text=Advanced Honeypot Suite')).toBeVisible();
      await expect(page.locator('text=Basic Honeypot')).toBeVisible();
      
      // Test category filter
      await page.selectOption('select', 'Honeypots');
      await page.waitForTimeout(1000);
      
      // Should show only honeypot items
      await expect(page.locator('text=Advanced Honeypot Suite')).toBeVisible();
    });
  });

  test.describe('Dashboard Functionality', () => {
    test('should show user dashboard when wallet is connected', async ({ page }) => {
      // Mock wallet connection
      await page.addInitScript(() => {
        window.ethereum = {
          request: async () => ['0x1234567890123456789012345678901234567890'],
          on: () => {},
          removeListener: () => {}
        };
        window.ethereum.isMetaMask = true;
      });
      
      await page.goto(`${BASE_URL}/app/`);
      await page.waitForTimeout(2000);
      
      // Check dashboard elements - use more flexible selectors
      await expect(page.locator('text=One Click Security Dashboard')).toBeVisible();
      await expect(page.locator('text=Quick Deploy')).toBeVisible();
      await expect(page.locator('text=Marketplace')).toBeVisible();
      await expect(page.locator('text=Analytics')).toBeVisible();
    });

    test('should show deployment statistics', async ({ page }) => {
      // Mock wallet connection
      await page.addInitScript(() => {
        window.ethereum = {
          request: async () => ['0x1234567890123456789012345678901234567890'],
          on: () => {},
          removeListener: () => {}
        };
        window.ethereum.isMetaMask = true;
      });
      
      await page.goto(`${BASE_URL}/app/`);
      await page.waitForTimeout(2000);
      
      // Check stats cards
      await expect(page.locator('text=Total Deployments')).toBeVisible();
      await expect(page.locator('text=Active Traps')).toBeVisible();
      await expect(page.locator('text=Total Spent')).toBeVisible();
      await expect(page.locator('text=Last Deployment')).toBeVisible();
    });
  });

  test.describe('Backend Integration', () => {
    test('should connect to backend API successfully', async ({ page }) => {
      // Test backend health endpoint
      const response = await page.request.get(`${BACKEND_URL}/health`);
      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data.status).toBe('OK');
      expect(data.service).toBe('One Click Backend API');
    });

    test('should fetch marketplace categories from backend', async ({ page }) => {
      const response = await page.request.get(`${BACKEND_URL}/api/marketplace/categories`);
      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data.success).toBeTruthy();
      expect(Array.isArray(data.data)).toBeTruthy();
    });

    test('should fetch basic trap templates from backend', async ({ page }) => {
      const response = await page.request.get(`${BACKEND_URL}/api/basic-traps/templates`);
      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data.success).toBeTruthy();
      expect(Array.isArray(data.data)).toBeTruthy();
    });
  });

  test.describe('Payment Flow', () => {
    test('should show payment step after configuration', async ({ page }) => {
      // Mock wallet connection
      await page.addInitScript(() => {
        window.ethereum = {
          request: async () => ['0x1234567890123456789012345678901234567890'],
          on: () => {},
          removeListener: () => {}
        };
        window.ethereum.isMetaMask = true;
      });
      
      await page.goto(`${BASE_URL}/deploy/`);
      await page.waitForTimeout(2000);
      
      // Select template and configure
      await page.click('text=Basic Honeypot');
      await page.fill('input[placeholder="Enter trap name"]', 'Test Trap');
      await page.click('button:has-text("Proceed to Payment")');
      
      // Should show payment step
      await expect(page.locator('text=Payment & Deployment')).toBeVisible();
      await expect(page.locator('text=Order Summary')).toBeVisible();
      await expect(page.locator('text=Payment Method')).toBeVisible();
    });

    test('should show checkout modal in marketplace', async ({ page }) => {
      // Mock wallet connection
      await page.addInitScript(() => {
        window.ethereum = {
          request: async () => ['0x1234567890123456789012345678901234567890'],
          on: () => {},
          removeListener: () => {}
        };
        window.ethereum.isMetaMask = true;
      });
      
      await page.goto(`${BASE_URL}/marketplace/`);
      await page.waitForTimeout(2000);
      
      // Add item to cart and checkout
      await page.click('button:has-text("Add")');
      await page.click('button:has-text("Checkout")');
      
      // Should show checkout modal
      await expect(page.locator('text=Checkout')).toBeVisible();
      await expect(page.locator('text=Order Summary')).toBeVisible();
      await expect(page.locator('text=Payment Method')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Mock failed network request
      await page.route('**/api/**', route => route.abort());
      
      await page.goto(`${BASE_URL}/deploy/`);
      await page.waitForTimeout(2000);
      
      // Should show appropriate error handling
      // This depends on your error handling implementation
    });

    test('should validate form inputs', async ({ page }) => {
      // Mock wallet connection
      await page.addInitScript(() => {
        window.ethereum = {
          request: async () => ['0x1234567890123456789012345678901234567890'],
          on: () => {},
          removeListener: () => {}
        };
        window.ethereum.isMetaMask = true;
      });
      
      await page.goto(`${BASE_URL}/deploy/`);
      await page.waitForTimeout(2000);
      
      // Select template and try to proceed without filling required fields
      await page.click('text=Basic Honeypot');
      await page.click('button:has-text("Proceed to Payment")');
      
      // Should show validation errors or prevent proceeding
      // This depends on your validation implementation
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto(BASE_URL);
      
      // Check if mobile menu is accessible
      const mobileMenu = page.locator('button[aria-label="Toggle menu"], button:has-text("Menu")');
      if (await mobileMenu.isVisible()) {
        await mobileMenu.click();
        await expect(page.locator('text=Home')).toBeVisible();
        await expect(page.locator('text=Deploy')).toBeVisible();
        await expect(page.locator('text=Marketplace')).toBeVisible();
        await expect(page.locator('text=Dashboard')).toBeVisible();
      }
    });
  });
});
