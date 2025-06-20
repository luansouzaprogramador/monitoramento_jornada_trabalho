import { useEffect, useState } from "react";
import api from "../services/api";
import { obterToken } from "../utils/auth";

export default function AprovarJornada() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [resposta, setResposta] = useState({});

  useEffect(() => {
    const fetchPendentes = async () => {
      const res = await api.get("/jornada/solicitacoes", {
        headers: { Authorization: obterToken() },
      });
      setSolicitacoes(res.data);
    };
    fetchPendentes();
  }, []);

  const handleAprovar = async (id, aprovado) => {
    const justificativa = resposta[id] || "";
    await api.put(
      `/jornada/aprovar/${id}`,
      { aprovado, justificativa },
      { headers: { Authorization: obterToken() } }
    );
    alert("Jornada analisada!");
    setSolicitacoes((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Solicitações de Aprovação de Jornada</h2>
      {solicitacoes.length === 0 && <p>Nenhuma solicitação pendente.</p>}

      {solicitacoes.map((s) => (
        <div
          key={s.id}
          style={{
            background: "#333",
            padding: "15px",
            margin: "10px 0",
            borderRadius: "8px",
          }}
        >
          <p>
            <strong>NS:</strong> {s.numero_servico}
          </p>
          <textarea
            placeholder="Justificativa (opcional)"
            rows={2}
            onChange={(e) =>
              setResposta((r) => ({ ...r, [s.id]: e.target.value }))
            }
          />
          <button
            onClick={() => handleAprovar(s.id, true)}
            style={{ marginRight: "10px" }}
          >
            Aprovar
          </button>
          <button
            onClick={() => handleAprovar(s.id, false)}
            style={{ background: "#bb4444" }}
          >
            Rejeitar
          </button>
        </div>
      ))}
    </div>
  );
}
