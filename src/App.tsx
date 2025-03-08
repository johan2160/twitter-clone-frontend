import React from "react"

export default function App() {

  const [count, setCount] = React.useState<number>(0);

  return (
    <React.Fragment>
      <div>Current count: {count}</div>
      <button onClick={() => setCount(count + 1)}>Increment by 1</button>
      <button onClick={() => setCount(count - 1)}>Decrement by 1</button>
      <button onClick={() => setCount(0)}>Reset to 0</button>
    </React.Fragment>
  )
}