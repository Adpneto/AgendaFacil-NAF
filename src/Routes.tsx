import { Route, Routes } from "react-router-dom"
import Sign from "./pages/sign"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Sign />} />
      </Routes>
    </div>
  )
}

export default App
