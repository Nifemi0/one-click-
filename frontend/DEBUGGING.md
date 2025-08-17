# Debugging Guide

This guide covers all the debugging features and tools available in the project.

## 🚀 Quick Start

### 1. Development Mode with Debugging
```bash
# Start with Node.js inspector
npm run dev:debug

# Start with trace warnings
npm run dev:trace

# Start with performance monitoring
npm run dev
```

### 2. Production Debugging
```bash
# Build with debugging enabled
npm run debug:build

# Start production with debugging
npm run start:debug
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Standard development server |
| `npm run dev:debug` | Development with Node.js inspector |
| `npm run dev:trace` | Development with trace warnings |
| `npm run start:debug` | Production with debugging |
| `npm run debug:build` | Build with debugging enabled |
| `npm run type-check` | TypeScript type checking |
| `npm run lint:fix` | Fix ESLint issues |

## 🐛 VS Code Debugging

### Server-Side Debugging
1. Open VS Code in the `frontend/` directory
2. Go to Run and Debug (Ctrl+Shift+D)
3. Select "Next.js: debug server-side"
4. Set breakpoints in your server-side code
5. Press F5 to start debugging

### Client-Side Debugging
1. Start the development server: `npm run dev`
2. Select "Next.js: debug client-side"
3. Set breakpoints in your React components
4. Press F5 to start debugging

### Full-Stack Debugging
1. Select "Next.js: debug full stack"
2. This will debug both server and client simultaneously

## 📊 Debug Utilities

### Import Debug Utilities
```typescript
import { debug, measurePerformance, getEnvironmentInfo } from '@/lib/debug';
```

### Basic Debugging
```typescript
// Log messages (only in development)
debug.log('Component mounted');
debug.error('API call failed', error);
debug.warn('Deprecated feature used');
debug.info('User action performed');

// Group related logs
debug.group('API Calls', () => {
  debug.log('Fetching user data');
  debug.log('User data received');
});

// Performance measurement
const result = measurePerformance('expensiveOperation', () => {
  return expensiveFunction();
});

// Async performance measurement
const data = await measureAsyncPerformance('apiCall', async () => {
  return await fetch('/api/data');
});
```

### Component Debugging
```typescript
import { debug } from '@/lib/debug';

function MyComponent(props: MyComponentProps) {
  // Log props
  debug.props('MyComponent', props);
  
  const [state, setState] = useState(initialState);
  
  // Log state changes
  useEffect(() => {
    debug.state('MyComponent', state);
  }, [state]);
  
  return <div>...</div>;
}
```

## 🔍 Environment Information

```typescript
import { getEnvironmentInfo } from '@/lib/debug';

const envInfo = getEnvironmentInfo();
console.log('Environment:', envInfo);
```

## 📝 Debug Configuration

The project includes a `debug.config.js` file that controls debugging features:

```javascript
const debugConfig = require('./debug.config.js');

// Check if a feature is enabled
if (debugConfig.isEnabled('performance')) {
  // Enable performance monitoring
}

// Get current debugging level
const level = debugConfig.getLevel();
```

## 🚨 Error Tracking

### Development Errors
- All errors are logged to console with stack traces
- Source maps enabled for accurate error locations
- Component error boundaries for React errors

### Production Errors
- Minimal error logging to avoid performance impact
- Error boundaries still active
- Consider integrating with error tracking services

## 📈 Performance Monitoring

### Built-in Metrics
- Component render times
- API call durations
- Web3 operation timing

### Custom Metrics
```typescript
import { measurePerformance } from '@/lib/debug';

// Measure custom operations
const result = measurePerformance('customOperation', () => {
  // Your code here
  return result;
});
```

## 🌐 Web3 Debugging

### Wallet Connection
```typescript
debug.group('Wallet Connection', () => {
  debug.log('Connecting to wallet');
  debug.log('Wallet connected:', wallet);
});
```

### Smart Contract Calls
```typescript
debug.group('Smart Contract Call', () => {
  debug.log('Contract address:', contractAddress);
  debug.log('Function:', functionName);
  debug.log('Parameters:', params);
});
```

## 🧪 Testing Debugging

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
```

### Debug Test Output
```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test with debugging
npm test -- --testNamePattern="Component Test" --verbose
```

## 🔧 Troubleshooting

### Common Issues

1. **Source maps not working**
   - Ensure `sourceMap: true` in tsconfig.json
   - Check Next.js config for `productionBrowserSourceMaps: true`

2. **Debugger not hitting breakpoints**
   - Verify you're using the correct debug configuration
   - Check that source maps are enabled
   - Ensure you're debugging the right process (client vs server)

3. **Performance issues in development**
   - Use `npm run dev:trace` to identify bottlenecks
   - Check for memory leaks with Chrome DevTools
   - Monitor bundle size with `npm run build`

### Debug Mode Verification

```typescript
// Check if debugging is enabled
if (process.env.NODE_ENV === 'development') {
  console.log('Debug mode active');
}

// Verify debug utilities are working
debug.log('Debug utilities loaded');
```

## 📚 Additional Resources

- [Next.js Debugging](https://nextjs.org/docs/advanced-features/debugging)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [VS Code Debugging](https://code.visualstudio.com/docs/editor/debugging)

## 🆘 Getting Help

If you encounter debugging issues:

1. Check this guide first
2. Verify your environment setup
3. Check the console for error messages
4. Use the debug utilities to trace the issue
5. Check the project's issue tracker

---

**Happy Debugging! 🐛✨**
