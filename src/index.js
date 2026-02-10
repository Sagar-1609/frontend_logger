function initLogger(config = {}) {
  const {
    serverUrl = 'ws://localhost:5000',
    level = 'log', // 'log' includes info, warn, error. 'warn' includes warn, error. 'error' only error.
  } = config;
// testing by prince
  // Attempt to detect development mode. 
  // Vite uses import.meta.env.DEV
  // Create React App / Webpack often uses process.env.NODE_ENV
  const isDev = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) || 
                (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development');

  if (!isDev) {
    console.warn('Frontend Terminal Logger: Not in development mode, logger will not start.');
    return;
  }

  const ws = new WebSocket(serverUrl);

  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
  };

  ws.onopen = () => {
    // console.log('Connected to Frontend Terminal Logger');
    // Don't log this to avoid loop if we override log immediately, 
    // though we override safely.
  };
  
  ws.onerror = (err) => {
    // Fail silently or warn?
    // originalConsole.error('Frontend Terminal Logger Connection Error', err);
  };

  const send = (type, args) => {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        // Handle circular references or complex objects by safe stringifying if needed.
        // For simplicity, we try basic JSON.stringify. 
        // If args contains non-serializable, we might want to sanitize.
        // We will map args to a serializable format.
        const serializableArgs = args.map(arg => {
          if (typeof arg === 'undefined') return 'undefined';
          if (arg === null) return null;
          if (typeof arg === 'function') return `[Function: ${arg.name || 'anonymous'}]`;
          if (arg instanceof Error) return { message: arg.message, stack: arg.stack };
          return arg;
        });

        ws.send(JSON.stringify({ type, args: serializableArgs }));
      } catch (e) {
        // originalConsole.error('Failed to send log to terminal', e);
      }
    }
  };

  const levels = ['log', 'warn', 'error'];
  const shouldLog = (methodLevel) => {
    const validLevels = {
      'log': ['log', 'warn', 'error'],
      'warn': ['warn', 'error'],
      'error': ['error']
    };
    return (validLevels[level] || validLevels['log']).includes(methodLevel);
  };

  if (shouldLog('log')) {
    console.log = (...args) => {
      originalConsole.log.apply(console, args);
      send('log', args);
    };
  }

  if (shouldLog('warn')) {
    console.warn = (...args) => {
      originalConsole.warn.apply(console, args);
      send('warn', args);
    };
  }

  if (shouldLog('error')) {
    console.error = (...args) => {
      originalConsole.error.apply(console, args);
      send('error', args);
    };
  }
}

// ESM Export
export { initLogger };

// CommonJS Backward Compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initLogger };
}
