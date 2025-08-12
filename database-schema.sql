-- =====================================================
-- DROSERA SECURITY TRAP SYSTEM DATABASE SCHEMA
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255),
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    subscription_tier VARCHAR(20) DEFAULT 'free',
    subscription_expires TIMESTAMP,
    total_deployments INTEGER DEFAULT 0,
    total_revenue DECIMAL(18,8) DEFAULT 0
);

-- =====================================================
-- NETWORKS TABLE
-- =====================================================
CREATE TABLE networks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chain_id INTEGER UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    rpc_url TEXT NOT NULL,
    block_explorer TEXT,
    native_currency_name VARCHAR(20) DEFAULT 'ETH',
    native_currency_symbol VARCHAR(10) DEFAULT 'ETH',
    native_currency_decimals INTEGER DEFAULT 18,
    is_active BOOLEAN DEFAULT TRUE,
    is_testnet BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- RPC_PROVIDERS TABLE
-- =====================================================
CREATE TABLE rpc_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    network_id UUID REFERENCES networks(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    rpc_url TEXT NOT NULL,
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_healthy BOOLEAN DEFAULT TRUE,
    last_health_check TIMESTAMP,
    response_time_ms INTEGER,
    failure_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    rate_limit_remaining INTEGER,
    rate_limit_reset TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SMART_CONTRACTS TABLE
-- =====================================================
CREATE TABLE smart_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    network_id UUID REFERENCES networks(id) ON DELETE CASCADE,
    contract_type VARCHAR(50) NOT NULL, -- 'factory', 'registry', 'oracle'
    contract_address VARCHAR(42) NOT NULL,
    contract_name VARCHAR(100),
    contract_version VARCHAR(20),
    abi TEXT,
    bytecode TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    deployment_block INTEGER,
    deployment_tx_hash VARCHAR(66),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SECURITY_TRAPS TABLE
-- =====================================================
CREATE TABLE security_traps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    network_id UUID REFERENCES networks(id) ON DELETE CASCADE,
    trap_name VARCHAR(100) NOT NULL,
    trap_description TEXT,
    trap_type VARCHAR(50) NOT NULL, -- 'honeypot', 'sandbox', 'monitoring', 'custom'
    contract_address VARCHAR(42),
    contract_code TEXT NOT NULL,
    deployment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'deploying', 'deployed', 'failed'
    deployment_tx_hash VARCHAR(66),
    deployment_block INTEGER,
    deployment_gas_used BIGINT,
    deployment_cost DECIMAL(18,8),
    is_active BOOLEAN DEFAULT TRUE,
    risk_score INTEGER DEFAULT 0, -- 0-100
    vulnerability_count INTEGER DEFAULT 0,
    threat_level VARCHAR(20) DEFAULT 'low', -- 'low', 'medium', 'high', 'critical'
    ai_analysis_result JSONB,
    monitoring_enabled BOOLEAN DEFAULT TRUE,
    alert_thresholds JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deployed_at TIMESTAMP
);

-- =====================================================
-- AI_ANALYSES TABLE
-- =====================================================
CREATE TABLE ai_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trap_id UUID REFERENCES security_traps(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ai_provider VARCHAR(50) NOT NULL, -- 'cursor', 'gemini', 'claude', 'openai'
    analysis_type VARCHAR(50) NOT NULL, -- 'security', 'deployment', 'monitoring', 'threat'
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    risk_score INTEGER,
    vulnerabilities_detected JSONB,
    recommendations JSONB,
    processing_time_ms INTEGER,
    tokens_used INTEGER,
    cost DECIMAL(18,8),
    is_successful BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TRAP_DEPLOYMENTS TABLE
-- =====================================================
CREATE TABLE trap_deployments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trap_id UUID REFERENCES security_traps(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    network_id UUID REFERENCES networks(id) ON DELETE CASCADE,
    deployment_type VARCHAR(50) NOT NULL, -- 'basic', 'premium', 'enterprise'
    deployment_fee DECIMAL(18,8) NOT NULL,
    gas_cost DECIMAL(18,8),
    total_cost DECIMAL(18,8) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
    payment_tx_hash VARCHAR(66),
    deployment_status VARCHAR(20) DEFAULT 'pending',
    deployment_tx_hash VARCHAR(66),
    deployment_block INTEGER,
    deployment_gas_used BIGINT,
    deployment_timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- REVENUE_TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE revenue_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- 'deployment', 'subscription', 'feature', 'refund'
    amount DECIMAL(18,8) NOT NULL,
    currency VARCHAR(10) DEFAULT 'ETH',
    network_id UUID REFERENCES networks(id) ON DELETE CASCADE,
    tx_hash VARCHAR(66),
    block_number INTEGER,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'failed', 'refunded'
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subscription_tier VARCHAR(20) NOT NULL, -- 'free', 'basic', 'premium', 'enterprise'
    monthly_fee DECIMAL(18,8) NOT NULL,
    features JSONB NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    auto_renew BOOLEAN DEFAULT TRUE,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ALERTS TABLE
-- =====================================================
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trap_id UUID REFERENCES security_traps(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL, -- 'threat', 'vulnerability', 'deployment', 'system'
    severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MONITORING_LOGS TABLE
-- =====================================================
CREATE TABLE monitoring_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trap_id UUID REFERENCES security_traps(id) ON DELETE CASCADE,
    log_type VARCHAR(50) NOT NULL, -- 'transaction', 'event', 'error', 'warning'
    log_level VARCHAR(20) NOT NULL, -- 'debug', 'info', 'warn', 'error'
    message TEXT NOT NULL,
    tx_hash VARCHAR(66),
    block_number INTEGER,
    block_timestamp TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- FEATURE_USAGE TABLE
-- =====================================================
CREATE TABLE feature_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    feature_name VARCHAR(100) NOT NULL,
    usage_count INTEGER DEFAULT 1,
    last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Networks
CREATE INDEX idx_networks_chain_id ON networks(chain_id);
CREATE INDEX idx_networks_is_active ON networks(is_active);

-- RPC Providers
CREATE INDEX idx_rpc_providers_network_id ON rpc_providers(network_id);
CREATE INDEX idx_rpc_providers_priority ON rpc_providers(priority);
CREATE INDEX idx_rpc_providers_is_healthy ON rpc_providers(is_healthy);

-- Smart Contracts
CREATE INDEX idx_smart_contracts_network_id ON smart_contracts(network_id);
CREATE INDEX idx_smart_contracts_contract_type ON smart_contracts(contract_type);
CREATE INDEX idx_smart_contracts_contract_address ON smart_contracts(contract_address);

-- Security Traps
CREATE INDEX idx_security_traps_user_id ON security_traps(user_id);
CREATE INDEX idx_security_traps_network_id ON security_traps(network_id);
CREATE INDEX idx_security_traps_deployment_status ON security_traps(deployment_status);
CREATE INDEX idx_security_traps_risk_score ON security_traps(risk_score);
CREATE INDEX idx_security_traps_created_at ON security_traps(created_at);

-- AI Analyses
CREATE INDEX idx_ai_analyses_trap_id ON ai_analyses(trap_id);
CREATE INDEX idx_ai_analyses_user_id ON ai_analyses(user_id);
CREATE INDEX idx_ai_analyses_ai_provider ON ai_analyses(ai_provider);
CREATE INDEX idx_ai_analyses_created_at ON ai_analyses(created_at);

-- Trap Deployments
CREATE INDEX idx_trap_deployments_trap_id ON trap_deployments(trap_id);
CREATE INDEX idx_trap_deployments_user_id ON trap_deployments(user_id);
CREATE INDEX idx_trap_deployments_payment_status ON trap_deployments(payment_status);
CREATE INDEX idx_trap_deployments_deployment_status ON trap_deployments(deployment_status);

-- Revenue Transactions
CREATE INDEX idx_revenue_transactions_user_id ON revenue_transactions(user_id);
CREATE INDEX idx_revenue_transactions_transaction_type ON revenue_transactions(transaction_type);
CREATE INDEX idx_revenue_transactions_status ON revenue_transactions(status);
CREATE INDEX idx_revenue_transactions_created_at ON revenue_transactions(created_at);

-- Subscriptions
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_subscription_tier ON subscriptions(subscription_tier);
CREATE INDEX idx_subscriptions_is_active ON subscriptions(is_active);

-- Alerts
CREATE INDEX idx_alerts_trap_id ON alerts(trap_id);
CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_is_read ON alerts(is_read);
CREATE INDEX idx_alerts_created_at ON alerts(created_at);

-- Monitoring Logs
CREATE INDEX idx_monitoring_logs_trap_id ON monitoring_logs(trap_id);
CREATE INDEX idx_monitoring_logs_log_type ON monitoring_logs(log_type);
CREATE INDEX idx_monitoring_logs_created_at ON monitoring_logs(created_at);

-- Feature Usage
CREATE INDEX idx_feature_usage_user_id ON feature_usage(user_id);
CREATE INDEX idx_feature_usage_feature_name ON feature_usage(feature_name);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_networks_updated_at BEFORE UPDATE ON networks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rpc_providers_updated_at BEFORE UPDATE ON rpc_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_smart_contracts_updated_at BEFORE UPDATE ON smart_contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_security_traps_updated_at BEFORE UPDATE ON security_traps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trap_deployments_updated_at BEFORE UPDATE ON trap_deployments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_revenue_transactions_updated_at BEFORE UPDATE ON revenue_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feature_usage_updated_at BEFORE UPDATE ON feature_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INITIAL DATA INSERTION
-- =====================================================

-- Insert Hoodi Testnet network
INSERT INTO networks (chain_id, name, rpc_url, block_explorer, native_currency_name, native_currency_symbol, native_currency_decimals, is_testnet) 
VALUES (
    560048, 
    'Ethereum Hoodi Testnet', 
    'https://eth-hoodi.g.alchemy.com/v2/ZETFuZOXiKo3Rg4GKKAyZ',
    'https://hoodi.etherscan.io',
    'Ether',
    'ETH',
    18,
    TRUE
);

-- Insert RPC providers for Hoodi testnet
INSERT INTO rpc_providers (network_id, name, rpc_url, priority, is_active) 
SELECT 
    n.id,
    'Alchemy Hoodi',
    'https://eth-hoodi.g.alchemy.com/v2/ZETFuZOXiKo3Rg4GKKAyZ',
    1,
    TRUE
FROM networks n WHERE n.chain_id = 560048;

INSERT INTO rpc_providers (network_id, name, rpc_url, priority, is_active) 
SELECT 
    n.id,
    'Hoodi Official',
    'https://rpc.hoodi.network',
    2,
    TRUE
FROM networks n WHERE n.chain_id = 560048;

INSERT INTO rpc_providers (network_id, name, rpc_url, priority, is_active) 
SELECT 
    n.id,
    'Hoodi Alternative',
    'https://rpc2.hoodi.network',
    3,
    TRUE
FROM networks n WHERE n.chain_id = 560048;

INSERT INTO rpc_providers (network_id, name, rpc_url, priority, is_active) 
SELECT 
    n.id,
    'Public Hoodi',
    'https://public-rpc.hoodi.network',
    4,
    TRUE
FROM networks n WHERE n.chain_id = 560048;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE users IS 'User accounts and wallet information';
COMMENT ON TABLE networks IS 'Supported blockchain networks';
COMMENT ON TABLE rpc_providers IS 'RPC endpoints for each network with fallback support';
COMMENT ON TABLE smart_contracts IS 'Deployed smart contract addresses and metadata';
COMMENT ON TABLE security_traps IS 'Security trap contracts and deployment information';
COMMENT ON TABLE ai_analyses IS 'AI-powered security analysis results';
COMMENT ON TABLE trap_deployments IS 'Trap deployment transactions and costs';
COMMENT ON TABLE revenue_transactions IS 'Revenue tracking for all transactions';
COMMENT ON TABLE subscriptions IS 'User subscription plans and billing';
COMMENT ON TABLE alerts IS 'Security alerts and notifications';
COMMENT ON TABLE monitoring_logs IS 'Real-time monitoring and logging data';
COMMENT ON TABLE feature_usage IS 'Feature usage tracking for billing';

COMMENT ON COLUMN users.wallet_address IS 'Ethereum wallet address (0x...)';
COMMENT ON COLUMN users.subscription_tier IS 'Current subscription level';
COMMENT ON COLUMN networks.chain_id IS 'EVM chain ID (e.g., 560048 for Hoodi)';
COMMENT ON COLUMN rpc_providers.priority IS 'Priority order for fallback (1 = highest)';
COMMENT ON COLUMN security_traps.risk_score IS 'Security risk score 0-100';
COMMENT ON COLUMN ai_analyses.ai_provider IS 'AI service used for analysis';
COMMENT ON COLUMN revenue_transactions.amount IS 'Transaction amount in ETH';
COMMENT ON COLUMN monitoring_logs.metadata IS 'Additional log data in JSON format';

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================

SELECT 'Drosera Security Trap System database schema created successfully!' as status;