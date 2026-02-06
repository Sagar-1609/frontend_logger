# Codebase Explanation: Frontend Terminal Logger

This document provides a detailed, line-by-line explanation of the core files in the `frontend-terminal-logger` project.

## Overview

The project consists of three main components:

1.  **CLI Entry Point (`bin/cli.js`)**: Starts the application from the command line.
2.  **Server Logic (`src/server.js`)**: A WebSocket server that receives logs and prints them to the terminal.
3.  **Client Logic (`src/index.js`)**: A browser-side script that intercepts console logs and streams them to the server.

---

## 1. CLI Entry Point (`bin/cli.js`)

This file is the executable script that runs when you use the tool via the command line.

```javascript
1: #!/usr/bin/env node
```

- **Shebang**: Tells the operating system to execute this file using the `node` interpreter.

```javascript
3: const { startServer } = require('../src/server');
```

- Imports the `startServer` function from the server logic file.

```javascript
5: const args = process.argv.slice(2);
6: const portStart = args.indexOf('--port');
7: const port = portStart !== -1 ? parseInt(args[portStart + 1]) : 5000;
```

- **Argument Parsing**:
  - `process.argv.slice(2)`: Gets the command line arguments passed by the user (skipping the Node executable path and script path).
  - `indexOf('--port')`: Checks if the `--port` flag was provided.
  - If found, it parses the next argument as an integer.
  - If not found, it defaults to port `5000`.

```javascript
9: startServer(port);
```

- Calls `startServer` with the determined port to launch the application.

---

## 2. Server Logic (`src/server.js`)

This file handles the WebSocket server and the actual printing of logs to the terminal.

```javascript
1: const WebSocket = require('ws');
2: const pc = require('picocolors');
```

- **Dependencies**:
  - `ws`: A library to create and manage WebSocket connections.
  - `picocolors`: A library to add colors to terminal output (e.g., red for errors, yellow for warnings).

```javascript
4: function startServer(port = 5000) {
5:   const wss = new WebSocket.Server({ port });
```

- Creates a new WebSocket server instance listening on the specified `port`.

```javascript
7:   console.log(pc.cyan(`\n🚀 Frontend Terminal Logger running at ws://localhost:${port}\n`));
```

- Prints a startup message in **cyan** to indicate the server is running.

```javascript
9:   wss.on('connection', (ws) => {
10:     console.log(pc.magenta('🔥 Browser connected'));
```

- **Connection Listener**: Listens for new connections. When a browser connects, it logs "Browser connected" in **magenta**.

```javascript
12:     ws.on('message', (message) => {
13:       try {
14:         const data = JSON.parse(message);
15:         handleLog(data);
16:       } catch (err) {
17:         console.error(pc.red('Error parsing log message:'), err);
18:       }
19:     });
```

- **Message Listener**: Listens for data coming from the browser.
  - It attempts to `JSON.parse` the raw message string.
  - If successful, it passes the data to `handleLog`.
  - If parsing fails, it catches the error and logs it in **red**.

```javascript
21:     ws.on('close', () => {
22:       console.log(pc.gray('Disconnected'));
23:     });
```

- **Close Listener**: Detects when a browser disconnects (e.g., closing the tab) and prints "Disconnected" in **gray**.

```javascript
29: function handleLog(data) {
30:   const { type, args } = data;
31:   const tagStr = `[FRONTEND ${type.toUpperCase()}]`;
32:
33:   let tagColor;
34:   switch (type) {
35:     case 'error': tagColor = pc.red; break;
36:     case 'warn': tagColor = pc.yellow; break;
37:     default: tagColor = pc.blue; break;
38:   }
```

- **Log Handler**:
  - Extracts the log `type` (log, warn, error) and `args` (content).
  - Creates a tag string like `[FRONTEND ERROR]`.
  - Selects a color for the tag based on the type (Red for error, Yellow for warn, Blue for others).

```javascript
49:   console.log(formattedTag, ...args);
```

- Prints the colored tag followed by the log contents to the terminal.

---

## 3. Client Logic (`src/index.js`)

This file runs in the browser. It intercepts `console` calls and sends them to the server.

```javascript
1: function initLogger(config = {}) {
2:   const {
3:     serverUrl = 'ws://localhost:5000',
4:     level = 'log',
5:   } = config;
```

- **Configuration**: Accepts an optional `config` object.
  - `serverUrl`: Defaults to localhost:5000.
  - `level`: Sets the minimum logging level (default includes logs, warns, and errors).

```javascript
10:   const isDev = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) ||
11:                 (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development');
12:
13:   if (!isDev) {
14:     console.warn('Frontend Terminal Logger: Not in development mode, logger will not start.');
15:     return;
16:   }
```

- **Dev Mode Detection**: Checks if the app is running in development (supports Vite and Webpack/CRA envs).
- **Safety Guard**: If not in dev mode, it warns and exits. This prevents logs from being streamed in production.

```javascript
18:   const ws = new WebSocket(serverUrl);
```

- Opens a WebSocket connection to the server.

```javascript
20:   const originalConsole = {
21:     log: console.log,
22:     warn: console.warn,
23:     error: console.error,
24:   };
```

- **Backup**: Saves the original console methods so they can still be used (and to avoid infinite loops when we override them).

```javascript
37:   const send = (type, args) => {
38:     if (ws.readyState === WebSocket.OPEN) {
44:         const serializableArgs = args.map(arg => {
45:           if (typeof arg === 'undefined') return 'undefined';
46:           if (arg === null) return null;
47:           if (typeof arg === 'function') return `[Function: ${arg.name || 'anonymous'}]`;
48:           if (arg instanceof Error) return { message: arg.message, stack: arg.stack };
49:           return arg;
50:         });
```

- **Send Helper**:
  - Checks if the WebSocket is open.
  - **Sanitization**: Maps over arguments to ensure they can be sent as JSON.
    - Converts `undefined`, Functions, and Errors into strings/objects because standard JSON.stringify fails or drops them.
- Sends the sanitized data: `ws.send(...)`.

```javascript
69:   if (shouldLog('log')) {
70:     console.log = (...args) => {
71:       originalConsole.log.apply(console, args);
72:       send('log', args);
73:     };
74:   }
```

- **Overriding Console**:
  - Replaces `console.log` with a custom function.
  - Calls `originalConsole.log` (so you still see logs in the browser dev tools).
  - Calls `send('log', args)` to stream the log to your terminal.
  - Repeats this pattern for `warn` and `error`.
