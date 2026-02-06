import React, { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  const handleLog = () => {
    console.log('This is a standard log message', { count, date: new Date() });
  }

  const handleWarn = () => {
    console.warn('This is a WARNING message!', 'Watch out!');
  }

  const handleError = () => {
    console.error('This is an ERROR message!', new Error('Something exploded'));
  }

  return (
    <div className="container">
      <h1>Frontend Terminal Logger Demo</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Open your terminal running <code>npx frontend-terminal-logger</code> to see the logs!
        </p>
      </div>

      <div className="actions">
        <button onClick={handleLog} className="btn log">Log Message</button>
        <button onClick={handleWarn} className="btn warn">Warn Message</button>
        <button onClick={handleError} className="btn error">Error Message</button>
      </div>
    </div>
  )
}

export default App
