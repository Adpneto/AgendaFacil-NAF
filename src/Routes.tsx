import { Route, Routes } from "react-router-dom"
import Home from "./pages/home"
import AdminAppointments from "./pages/admin"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminAppointments />} />
    </Routes>
  )
}

export default App
