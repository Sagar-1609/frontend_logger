const WebSocket = require('ws');
const pc = require('picocolors');

function startServer(port = 5000) {
  const wss = new WebSocket.Server({ port });

  console.log(pc.cyan(`\n🚀 Frontend Terminal Logger running at ws://localhost:${port}\n`));

  wss.on('connection', (ws) => {
    console.log(pc.magenta('🔥 Browser connected'));

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        handleLog(data);
      } catch (err) {
        console.error(pc.red('Error parsing log message:'), err);
      }
    });

    ws.on('close', () => {
      console.log(pc.gray('Disconnected'));
    });
  });

  return wss;
}

function handleLog(data) {
  const { type, args } = data;
  const tagStr = `[FRONTEND ${type.toUpperCase()}]`;

  let tagColor;
  switch (type) {
    case 'error': tagColor = pc.red; break;
    case 'warn': tagColor = pc.yellow; break;
    default: tagColor = pc.blue; break;
  }

  const formattedTag = tagColor(tagStr);
  
  // Format args similar to how console.log does (basic space separation)
  // If args are objects, they will come in as serialized strings or objects depending on client implementation.
  // We assume client sends array of *values*. 
  // If client JSON.stringifies objects, we might want to unquote them if they are strings, but objects are better printed as objects.
  // Let's assume the client sends the raw values if possible, but JSON.stringify might have happened on the client side for transmission.
  // Actually, client MUST stringify to send over WS. So we receive JSON objects/primitives.
  
  console.log(formattedTag, ...args);
}

module.exports = { startServer };
