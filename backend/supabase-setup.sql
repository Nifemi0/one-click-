-- One Click Backend Database Setup
-- Run this in your Supabase SQL Editor

-- Create basic_traps table for real deployments
CREATE TABLE IF NOT EXISTS basic_traps (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  trap_type VARCHAR(50) NOT NULL,
  trap_name VARCHAR(255) NOT NULL,
  description TEXT,
  contract_address VARCHAR(42),
  deployment_tx_hash VARCHAR(66),
  network INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'deploying',
  estimated_cost VARCHAR(50),
  actual_cost VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  deployed_at TIMESTAMP,
  metadata JSONB
);

-- Create trap_templates table for real templates
CREATE TABLE IF NOT EXISTS trap_templates (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  complexity VARCHAR(50),
  creator_address VARCHAR(42),
  bytecode TEXT,
  abi JSONB,
  constructor_args JSONB,
  estimated_cost VARCHAR(50),
  tags TEXT[],
  is_public BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert real basic trap templates
INSERT INTO trap_templates (id, name, description, category, complexity, estimated_cost, tags, is_public) VALUES
('honeypot_basic', 'Basic Honeypot', 'Simple honeypot that looks like a legitimate contract', 'honeypot', 'simple', '0.008 ETH', ARRAY['honeypot', 'basic', 'security'], true),
('honeypot_advanced', 'Advanced Honeypot', 'Sophisticated honeypot with realistic DeFi interface', 'honeypot', 'medium', '0.012 ETH', ARRAY['honeypot', 'advanced', 'defi'], true),
('sandbox_basic', 'Security Sandbox', 'Isolated environment for testing security concepts', 'sandbox', 'simple', '0.006 ETH', ARRAY['sandbox', 'testing', 'security'], true),
('monitoring_basic', 'Basic Monitor', 'Simple monitoring contract for basic security tracking', 'monitoring', 'simple', '0.005 ETH', ARRAY['monitoring', 'tracking', 'security'], true),
('monitoring_advanced', 'Advanced Monitor', 'Comprehensive monitoring with advanced analytics', 'monitoring', 'medium', '0.010 ETH', ARRAY['monitoring', 'analytics', 'advanced'], true),
('basic_trap', 'Basic Security Trap', 'Simple security trap for basic protection', 'basic', 'simple', '0.004 ETH', ARRAY['basic', 'security', 'protection'], true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_basic_traps_user_id ON basic_traps(user_id);
CREATE INDEX IF NOT EXISTS idx_basic_traps_status ON basic_traps(status);
CREATE INDEX IF NOT EXISTS idx_trap_templates_category ON trap_templates(category);
CREATE INDEX IF NOT EXISTS idx_trap_templates_complexity ON trap_templates(complexity);

-- Grant permissions (if needed)
GRANT ALL ON basic_traps TO authenticated;
GRANT ALL ON trap_templates TO authenticated;
GRANT ALL ON basic_traps TO anon;
GRANT ALL ON trap_templates TO anon;