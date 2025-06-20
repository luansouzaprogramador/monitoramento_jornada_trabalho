import { useEffect, useState } from "react";
import api from "../services/api";
import { obterToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function CriarOrdem() {
  const [numeroServico, setNumeroServico] = useState("");
  const [encarregados, setEncarregados] = useState([]);
  const [membros, setMembros] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [form, setForm] = useState({
    encarregado_id: "",
    membros_ids: [],
    equipamentos: [],
    local_lat: "",
    local_lng: "",
    tempo_plataforma: "",
    deslocamento_ida: "",
    deslocamento_volta: "",
    manobra: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDados = async () => {
      const config = { headers: { Authorization: obterToken() } };
      const usuarios = await api.get("/usuarios/todos", config);
      const ativos = usuarios.data;

      setEncarregados(ativos.filter((u) => u.tipo === "encarregado"));
      setMembros(ativos.filter((u) => u.tipo === "membro"));

      const eqs = await api.get("/equipamentos", config);
      setEquipamentos(eqs.data);
    };

    fetchDados();
  }, []);

  const handleCriar = async () => {
    const novaOrdem = {
      numero_servico: numeroServico,
      encarregado_id: form.encarregado_id,
      membros_ids: form.membros_ids,
      equipamentos: form.equipamentos,
      local_lat: form.local_lat,
      local_lng: form.local_lng,
      tempo_plataforma: +form.tempo_plataforma,
      deslocamento_ida: +form.deslocamento_ida,
      deslocamento_volta: +form.deslocamento_volta,
      manobra: +form.manobra,
    };

    try {
      await api.post("/ordens/criar", novaOrdem, {
        headers: { Authorization: obterToken() },
      });
      alert("Ordem criada com sucesso!");
      navigate("/dashboard");
    } catch (e) {
      alert("Erro ao criar ordem");
    }
  };

  const atualizarEquipamento = (index, campo, valor) => {
    const copia = [...form.equipamentos];
    copia[index] = { ...copia[index], [campo]: valor };
    setForm((prev) => ({ ...prev, equipamentos: copia }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Criar Nova Ordem de Serviço</h2>
      <input
        placeholder="Número do Serviço"
        value={numeroServico}
        onChange={(e) => setNumeroServico(e.target.value)}
      />
      <select
        onChange={(e) =>
          setForm((f) => ({ ...f, encarregado_id: e.target.value }))
        }
      >
        <option value="">Selecione o Encarregado</option>
        {encarregados.map((e) => (
          <option key={e.id} value={e.id}>
            {e.nome}
          </option>
        ))}
      </select>

      <h4>Membros da Equipe:</h4>
      {membros.map((m) => (
        <div key={m.id}>
          <label>
            <input
              type="checkbox"
              value={m.id}
              onChange={(e) => {
                const id = +e.target.value;
                setForm((f) => ({
                  ...f,
                  membros_ids: e.target.checked
                    ? [...f.membros_ids, id]
                    : f.membros_ids.filter((mid) => mid !== id),
                }));
              }}
            />
            {m.nome}
          </label>
        </div>
      ))}

      <h4>Localização da Obra (Latitude / Longitude)</h4>
      <input
        placeholder="Latitude"
        onChange={(e) => setForm((f) => ({ ...f, local_lat: e.target.value }))}
      />
      <input
        placeholder="Longitude"
        onChange={(e) => setForm((f) => ({ ...f, local_lng: e.target.value }))}
      />
      {form.local_lat && form.local_lng && (
        <iframe
          src={`https://maps.google.com/maps?q=${form.local_lat},${form.local_lng}&z=15&output=embed`}
          width="100%"
          height="250"
          loading="lazy"
          style={{ borderRadius: "10px", marginTop: "10px" }}
        ></iframe>
      )}

      <h4>Equipamentos:</h4>
      {equipamentos.map((eq, index) => (
        <div key={eq.id}>
          <p>{eq.nome}</p>
          <input
            placeholder="Latitude"
            onChange={(e) => atualizarEquipamento(index, "lat", e.target.value)}
          />
          <input
            placeholder="Longitude"
            onChange={(e) => atualizarEquipamento(index, "lng", e.target.value)}
          />
        </div>
      ))}

      <h4>Tempos (em minutos):</h4>
      <input
        placeholder="Tempo de Plataforma"
        onChange={(e) =>
          setForm((f) => ({ ...f, tempo_plataforma: e.target.value }))
        }
      />
      <input
        placeholder="Deslocamento Ida"
        onChange={(e) =>
          setForm((f) => ({ ...f, deslocamento_ida: e.target.value }))
        }
      />
      <input
        placeholder="Deslocamento Volta"
        onChange={(e) =>
          setForm((f) => ({ ...f, deslocamento_volta: e.target.value }))
        }
      />
      <input
        placeholder="Tempo de Manobra"
        onChange={(e) => setForm((f) => ({ ...f, manobra: e.target.value }))}
      />

      <button onClick={handleCriar}>Criar Ordem</button>
    </div>
  );
}
