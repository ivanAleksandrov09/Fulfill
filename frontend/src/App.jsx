import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { FileProvider } from "./components/FileContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Study from "./pages/Study";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  // we clear the local storage to prevent errors when accidentally submiting tokens on register page
  localStorage.clear();
  return <Register />;
}
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            //protected route here makes sure you are logged in before accesing
            <ProtectedRoute>
              <FileProvider>
                <Home />
              </FileProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/Study"
          element={
            <ProtectedRoute>
              <FileProvider>
                <Study />
              </FileProvider>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
