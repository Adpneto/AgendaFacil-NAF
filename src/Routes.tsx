import { Route, Routes } from "react-router-dom"
import Home from "./pages/home"
import AdminAppointments from "./pages/admin"
import ProtectedRoute from "./lib/protectedRoute"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminAppointments />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
