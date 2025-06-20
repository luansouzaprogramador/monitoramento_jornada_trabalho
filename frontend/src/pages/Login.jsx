import { useState } from "react";
import api from "../services/api";
import { salvarToken } from "../utils/auth";
import "./Login.css";

export default function Login({ onLogin }) {
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/usuarios/login", { matricula, senha });
      salvarToken(res.data.token);
      onLogin(res.data.usuario); // leva para dashboard com base no tipo
    } catch (err) {
      setErro("Usuário ou senha incorretos.");
    }
  };

  return (
    <div className="login-container">
      <h2>Bem-vindo ao Sistema</h2>
      <input
        type="text"
        placeholder="Matrícula"
        value={matricula}
        onChange={(e) => setMatricula(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      {erro && <p className="erro">{erro}</p>}
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}
