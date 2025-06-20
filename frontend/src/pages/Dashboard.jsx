import { useEffect, useState } from "react";
import api from "../services/api";
import { obterToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ usuario }) {
  const [ordens, setOrdens] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrdens = async () => {
      const res = await api.get("/ordens", {
        headers: { Authorization: obterToken() },
      });
      setOrdens(res.data);
    };
    fetchOrdens();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Painel de {usuario?.tipo || "usuário"}</h1>

      <button onClick={() => navigate("/criar-ordem")}>Nova Ordem</button>
      {usuario?.tipo === "supervisor" && (
        <button onClick={() => navigate("/aprovacoes")}>
          Solicitações de Jornada
        </button>
      )}

      <h2>Ordens de Serviço</h2>
      <ul>
        {ordens.map((o) => (
          <li key={o.id}>
            {o.numero_servico} - Status: {o.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
