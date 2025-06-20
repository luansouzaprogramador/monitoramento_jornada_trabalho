import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CriarOrdem from "./pages/CriarOrdem";
import AprovarJornada from "./pages/AprovarJornada";
import { useState } from "react";
import { obterToken } from "./utils/auth";

function App() {
  const [usuario, setUsuario] = useState(null);

  const logado = usuario || obterToken();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            logado ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLogin={setUsuario} />
            )
          }
        />
        <Route path="/dashboard" element={<Dashboard usuario={usuario} />} />
        <Route path="/criar-ordem" element={<CriarOrdem />} />
        <Route path="/aprovacoes" element={<AprovarJornada />} />
      </Routes>
    </Router>
  );
}

export default App;
