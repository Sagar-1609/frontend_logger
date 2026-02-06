# Frontend Terminal Logger

Streams your frontend browser console logs (`console.log`, `warn`, `error`) directly to your terminal. No need to switch windows or open Chrome DevTools for quick debugging!

## Features

- 🔥 **Real-time Logging**: Streams logs from browser to terminal instantly.
- 🎨 **Color Coded**: Warns are yellow, errors are red, logs are blue.
- 🔌 **Plug & Play**: Works with any frontend framework (React, Vue, Svelte, plain JS).
- 🛡️ **Dev Mode Safe**: Easily configured to run only in development.

## Installation

```bash
npm install frontend-terminal-logger
```

## Usage

### 1. Start the Terminal Listener

In your terminal, run:

```bash
npx frontend-terminal-logger
```

You should see:

```
🚀 Frontend Terminal Logger running at ws://localhost:5000
```

### 2. Initialize in your Frontend App

In your main entry file (e.g., `src/index.js` or `src/main.jsx`):

```javascript
import { initLogger } from "frontend-terminal-logger";

// Initialize logger (only in dev mode is handled automatically or manually)
if (import.meta.env.DEV) {
  // Or process.env.NODE_ENV === 'development'
  initLogger({
    serverUrl: "ws://localhost:5000", // default
    level: "log", // 'log' | 'warn' | 'error'
  });
}
```

Now, whenever you use `console.log()` in your browser, it will appear in your terminal!

## Configuration

| Option | Type | Default | Description |
|Path | | | |
| `serverUrl` | `string` | `ws://localhost:5000` | WebSocket server URL. |
| `level` | `string` | `log` | Minimum log level to send. |

## Example Output

**Terminal:**

```
🔥 Browser connected
[FRONTEND LOG] "User logged in", { id: 123, name: "Alice" }
[FRONTEND WARN] "API response slow"
[FRONTEND ERROR] "Failed to fetch data", Error: 500
```

## Development

```bash
# Clone the repo
git clone https://github.com/your-username/frontend-terminal-logger.git
cd frontend-terminal-logger

# Install dependencies
npm install

# Run the server
npm start

# Run the example
cd examples/vite-react-demo
npm install
npm run dev
```

## License

MIT
