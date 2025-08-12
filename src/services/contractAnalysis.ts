constructor(db: DatabaseService, blockchain: BlockchainService) {
  this.db = db;
  this.blockchain = blockchain;
  
  // Initialize AI Providers with fallback priority
  this.initializeAIProviders();

  // Initialize block explorer APIs for Hoodie testnet
  this.initializeBlockExplorers();
}

private initializeAIProviders() {
  // Priority 1: Cursor API
  if (process.env.CURSOR_API_KEY) {
    this.aiProviders.push({
      name: 'Cursor',
      apiKey: process.env.CURSOR_API_KEY,
      endpoint: 'https://api.cursor.sh/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${process.env.CURSOR_API_KEY}`,
        'Content-Type': 'application/json',
      },
      model: 'gpt-4',
      maxTokens: 2000,
      temperature: 0.1,
    });
  }

  // Priority 2: Gemini API
  if (process.env.GEMINI_API_KEY) {
    this.aiProviders.push({
      name: 'Gemini',
      apiKey: process.env.GEMINI_API_KEY,
      endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      headers: {
        'Content-Type': 'application/json',
      },
      model: 'gemini-pro',
      maxTokens: 2000,
      temperature: 0.1,
    });
  }

  // Priority 3: Claude API
  if (process.env.CLAUDE_API_KEY) {
    this.aiProviders.push({
      name: 'Claude',
      apiKey: process.env.CLAUDE_API_KEY,
      endpoint: 'https://api.anthropic.com/v1/messages',
      headers: {
        'Authorization': `Bearer ${process.env.CLAUDE_API_KEY}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      model: 'claude-3-sonnet-20240229',
      maxTokens: 2000,
      temperature: 0.1,
    });
  }

  // Priority 4: OpenAI API (as last resort)
  if (process.env.OPENAI_API_KEY) {
    this.aiProviders.push({
      name: 'OpenAI',
      apiKey: process.env.OPENAI_API_KEY,
      endpoint: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      model: 'gpt-4',
      maxTokens: 2000,
      temperature: 0.1,
    });
  }

  if (this.aiProviders.length === 0) {
    console.warn('No AI providers configured. AI analysis will be disabled.');
  } else {
    console.log(`Initialized ${this.aiProviders.length} AI providers: ${this.aiProviders.map(p => p.name).join(', ')}`);
  }
}

private initializeBlockExplorers() {
  this.blockExplorerApis.set(560048, process.env.HOODI_ETHERSCAN_API_KEY || ''); // Ethereum Hoodi Testnet
}