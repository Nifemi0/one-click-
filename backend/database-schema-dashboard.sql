-- Dashboard Database Schema for One Click Backend
-- This creates the necessary tables for real dashboard functionality

-- Trap Deployments Table
CREATE TABLE IF NOT EXISTS trap_deployments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_address VARCHAR(42) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'deploying' CHECK (status IN ('deploying', 'active', 'inactive', 'failed')),
    deployed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    contract_address VARCHAR(42) NOT NULL,
    transaction_hash VARCHAR(66) NOT NULL,
    gas_used BIGINT NOT NULL DEFAULT 0,
    gas_price BIGINT NOT NULL DEFAULT 0,
    total_cost DECIMAL(20, 18) NOT NULL DEFAULT 0,
    security_score INTEGER DEFAULT 0 CHECK (security_score >= 0 AND security_score <= 100),
    revenue_generated DECIMAL(20, 18) DEFAULT 0,
    triggers INTEGER DEFAULT 0,
    last_triggered TIMESTAMP WITH TIME ZONE,
    network VARCHAR(50) DEFAULT 'hoodi_testnet',
    configuration JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security Alerts Table
CREATE TABLE IF NOT EXISTS security_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_address VARCHAR(42) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('threat_detected', 'trap_triggered', 'suspicious_activity', 'system_alert')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trap_id UUID REFERENCES trap_deployments(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Activity Table
CREATE TABLE IF NOT EXISTS user_activity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_address VARCHAR(42) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('deployment', 'alert', 'revenue', 'security_event')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trap_deployments_user_address ON trap_deployments(user_address);
CREATE INDEX IF NOT EXISTS idx_trap_deployments_status ON trap_deployments(status);
CREATE INDEX IF NOT EXISTS idx_trap_deployments_deployed_at ON trap_deployments(deployed_at);
CREATE INDEX IF NOT EXISTS idx_trap_deployments_contract_address ON trap_deployments(contract_address);

CREATE INDEX IF NOT EXISTS idx_security_alerts_user_address ON security_alerts(user_address);
CREATE INDEX IF NOT EXISTS idx_security_alerts_timestamp ON security_alerts(timestamp);
CREATE INDEX IF NOT EXISTS idx_security_alerts_type ON security_alerts(type);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON security_alerts(severity);

CREATE INDEX IF NOT EXISTS idx_user_activity_user_address ON user_activity(user_address);
CREATE INDEX IF NOT EXISTS idx_user_activity_timestamp ON user_activity(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity(type);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_trap_deployments_updated_at 
    BEFORE UPDATE ON trap_deployments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (optional)
INSERT INTO trap_deployments (
    user_address, 
    name, 
    type, 
    status, 
    contract_address, 
    transaction_hash, 
    gas_used, 
    gas_price, 
    total_cost, 
    security_score, 
    network
) VALUES 
(
    '0x1234567890123456789012345678901234567890',
    'Sample Honeypot Trap',
    'Honeypot',
    'active',
    '0xabcdef1234567890abcdef1234567890abcdef12',
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    210000,
    20000000000,
    0.0042,
    85,
    'hoodi_testnet'
) ON CONFLICT DO NOTHING;

INSERT INTO security_alerts (
    user_address,
    type,
    severity,
    title,
    description,
    trap_id
) VALUES 
(
    '0x1234567890123456789012345678901234567890',
    'trap_triggered',
    'medium',
    'Honeypot Trap Triggered',
    'Your honeypot trap detected and blocked a potential attack',
    (SELECT id FROM trap_deployments LIMIT 1)
) ON CONFLICT DO NOTHING;
