# Drosera One-Click Deployment System

A comprehensive Web3 application that democratizes access to Drosera Network's security Traps, transforming complex developer-only security tools into a user-friendly, one-click deployment platform accessible to non-technical users.

## 🚀 Features

- **One-Click Deployment**: Deploy sophisticated security traps with a single click
- **AI-Powered Analysis**: Intelligent contract analysis that identifies vulnerabilities
- **Multi-Chain Support**: Protect assets across Ethereum, Polygon, Arbitrum, Base, and more
- **Template Marketplace**: Browse and deploy from curated, audited security trap templates
- **Real-Time Monitoring**: 24/7 monitoring with instant alerts when threats are detected
- **Community Driven**: Contribute templates, share strategies, and earn rewards

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for global state
- **Web3 Integration**: Wagmi v2, Viem, ConnectKit
- **UI Components**: Headless UI, Heroicons, Lucide React

### Backend
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL via Supabase
- **Authentication**: JWT with wallet signature verification
- **Real-time**: Socket.IO for live updates
- **AI Integration**: OpenAI API for contract analysis

### Smart Contracts
- **Language**: Solidity
- **Framework**: Hardhat
- **Testing**: Jest + Hardhat testing
- **Deployment**: Multi-chain deployment scripts

## 📁 Project Structure

```
drosera-one-click/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   │   ├── ui/          # Reusable UI components
│   │   │   ├── layout/      # Layout components
│   │   │   ├── wallet/      # Wallet integration
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   ├── marketplace/ # Marketplace components
│   │   │   └── deployment/  # Deployment wizard
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and services
│   │   ├── types/           # TypeScript definitions
│   │   └── styles/          # Global styles
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Express.js backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript definitions
│   ├── package.json
│   └── tsconfig.json
├── packages/                 # Shared packages
│   └── shared/              # Common utilities
├── contracts/                # Smart contracts
├── docs/                     # Documentation
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Ethereum node access (Alchemy/Infura)
- OpenAI API key

### 1. Clone the Repository

```bash
git clone https://github.com/drosera-network/drosera-one-click.git
cd drosera-one-click
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 3. Environment Configuration

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

#### Backend (.env)
```bash
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://username:password@localhost:5432/drosera_db
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_key
JWT_SECRET=your_super_secret_jwt_key
OPENAI_API_KEY=your_openai_api_key
ALCHEMY_API_KEY=your_alchemy_api_key
```

### 4. Database Setup

```bash
# Create PostgreSQL database
createdb drosera_db

# Run database migrations (backend will auto-create tables)
cd backend
npm run dev
```

### 5. Start Development Servers

```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory, in new terminal)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## 🔧 Development

### Frontend Development

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run linting
npm run lint
```

### Backend Development

```bash
cd backend

# Start development server with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Run tests
npm test

# Run linting
npm run lint
```

### Database Management

```bash
# Connect to database
psql drosera_db

# View tables
\dt

# View table structure
\d+ users
```

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test                    # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Generate coverage report
npm run test:e2e           # Run end-to-end tests
```

### Backend Tests
```bash
cd backend
npm test                   # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report
npm run test:integration  # Run integration tests
```

## 📊 API Documentation

### Authentication Endpoints

- `POST /api/auth/connect` - Connect wallet with signature
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/settings` - Update user settings
- `POST /api/auth/disconnect` - Disconnect wallet
- `POST /api/auth/refresh` - Refresh JWT token

### Trap Management

- `GET /api/traps/templates` - Get available templates
- `POST /api/traps/deploy` - Deploy new trap
- `GET /api/traps/user/:address` - Get user's deployed traps
- `PUT /api/traps/:id/configure` - Update trap configuration
- `DELETE /api/traps/:id` - Deactivate trap

### Contract Analysis

- `POST /api/analyze/contract` - Analyze contract for vulnerabilities
- `GET /api/analyze/recommendations/:address` - Get AI recommendations

### Alerts & Monitoring

- `GET /api/alerts/user/:address` - Get user alerts
- `POST /api/alerts/webhook` - Receive blockchain event webhooks
- `PUT /api/alerts/:id/acknowledge` - Mark alert as read

### Marketplace

- `GET /api/marketplace/templates` - Browse marketplace templates
- `GET /api/marketplace/stats` - Get platform statistics

## 🔐 Security Features

- **Wallet Authentication**: Secure wallet connection with signature verification
- **JWT Tokens**: Stateless authentication with configurable expiration
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive input sanitization and validation
- **SQL Injection Protection**: Parameterized queries and input validation
- **CORS Configuration**: Secure cross-origin resource sharing
- **Helmet Security**: Security headers and middleware

## 🌐 Supported Networks

- **Ethereum Mainnet** (Chain ID: 1)
- **Polygon** (Chain ID: 137)
- **Arbitrum One** (Chain ID: 42161)
- **Base** (Chain ID: 8453)
- **Testnets**: Sepolia, Mumbai, Arbitrum Goerli, Base Goerli

## 🚀 Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Railway/Render)

```bash
cd backend
npm run build
# Deploy to Railway or Render with environment variables
```

### Database (Supabase)

1. Create new Supabase project
2. Run database migrations
3. Configure environment variables
4. Deploy backend with database connection

## 📈 Monitoring & Analytics

- **Application Monitoring**: Real-time performance metrics
- **Error Tracking**: Sentry integration for error monitoring
- **User Analytics**: PostHog integration for user behavior analysis
- **Database Monitoring**: Connection pool and query performance
- **Blockchain Monitoring**: Transaction status and gas usage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Use conventional commit messages
- Follow the existing code style
- Add JSDoc comments for complex functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.drosera.xyz](https://docs.drosera.xyz)
- **Discord**: [discord.gg/drosera](https://discord.gg/drosera)
- **Twitter**: [@drosera](https://twitter.com/drosera)
- **Email**: support@drosera.xyz

## 🙏 Acknowledgments

- Drosera Network team for the vision and guidance
- OpenZeppelin for security best practices
- Ethereum community for Web3 standards
- All contributors and beta testers

---

**Built with ❤️ for the DeFi community**