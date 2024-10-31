import { Route, Routes } from "react-router-dom"
import Sign from "./pages/sign"
import Home from "./pages/home"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign" element={<Sign />} />
      </Routes>
    </div>
  )
}

export default App
