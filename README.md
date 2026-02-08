# @sagar-1609/frontend-terminal-logger

Streams your frontend browser console logs (`console.log`, `warn`, `error`) directly to your terminal. No need to switch windows or open Chrome DevTools for quick debugging!

## Features

- 🔥 **Real-time Logging**: Streams logs from browser to terminal instantly.
- 🎨 **Color Coded**: Warns are yellow, errors are red, logs are blue.
- 🔌 **Plug & Play**: Works with any frontend framework (React, Vue, Svelte, plain JS).
- 🛡️ **Dev Mode Safe**: Built-in protection to run only in development.

## Installation

```bash
npm install @sagar-1609/frontend-terminal-logger
```

## Usage

### 1. Start the Terminal Listener

In your terminal, run:

```bash
npx @sagar-1609/frontend-terminal-logger
```

You should see:

```
🚀 Frontend Terminal Logger running at ws://localhost:5000
```

### 2. Initialize in your Frontend App

In your main entry file (e.g., `src/index.js` or `src/main.jsx`):

```javascript
import { initLogger } from "@sagar-1609/frontend-terminal-logger";

// Initialize logger
initLogger({
  serverUrl: "ws://localhost:5000", // default
  level: "log", // 'log' | 'warn' | 'error'
});
```

Now, whenever you use `console.log()` in your browser, it will appear in your terminal!

## Configuration

| Option      | Type     | Default               | Description                                         |
| :---------- | :------- | :-------------------- | :-------------------------------------------------- |
| `serverUrl` | `string` | `ws://localhost:5000` | WebSocket server URL.                               |
| `level`     | `string` | `log`                 | Minimum log level to send ('log', 'warn', 'error'). |

## Example Output

**Terminal:**

```
🔥 Browser connected
[FRONTEND LOG] "User logged in", { id: 123, name: "Alice" }
[FRONTEND WARN] "API response slow"
[FRONTEND ERROR] "Failed to fetch data", Error: 500
```

## Documentation

- [Code Explanation](CODE_EXPLANATION.md) - Deep dive into how the tool works.
- [Publishing Guide](PUBLISHING_GUIDE.md) - Steps to publish this to NPM.

## Development

```bash
# Clone the repo
git clone https://github.com/Sagar-1609/frontend_logger.git
cd frontend_logger

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
