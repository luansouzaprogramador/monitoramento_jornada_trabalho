DROP DATABASE IF EXISTS monitoramento_jornada;

CREATE DATABASE IF NOT EXISTS monitoramento_jornada;
USE monitoramento_jornada;

-- Tabela de usuários
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  matricula VARCHAR(50) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  nome VARCHAR(100) NOT NULL,
  tipo ENUM('gestor', 'supervisor', 'encarregado', 'membro') NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(100)
);

INSERT INTO usuarios (matricula, senha, nome, tipo, telefone, email) VALUES ('123456', '$2b$10$mtwwD0PU63/ZvDBFW4aTl.oXZxP4xnAT6sAc0/wMsD2FCGXeRX6sW', 'João Silva', 'gestor', '11987654321', 'gestor@gmail.com');

-- Tabela de ordens de serviço
CREATE TABLE ordens_servico (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero_servico VARCHAR(50) UNIQUE NOT NULL,
  supervisor_id INT NOT NULL,
  encarregado_id INT NOT NULL,
  local_lat DECIMAL(10, 8),
  local_lng DECIMAL(11, 8),
  tempo_plataforma INT,
  deslocamento_ida INT,
  deslocamento_volta INT,
  manobra INT,
  status ENUM('pendente', 'concluida', 'cancelada') DEFAULT 'pendente',
  FOREIGN KEY (supervisor_id) REFERENCES usuarios(id),
  FOREIGN KEY (encarregado_id) REFERENCES usuarios(id)
);

-- Tabela de membros da equipe por ordem
CREATE TABLE membros_ordem (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ordem_id INT,
  membro_id INT,
  presente BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (ordem_id) REFERENCES ordens_servico(id),
  FOREIGN KEY (membro_id) REFERENCES usuarios(id)
);

-- Tabela de equipamentos
CREATE TABLE equipamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
);

-- Tabela de equipamentos em ordens de serviço
CREATE TABLE ordem_equipamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ordem_id INT,
  equipamento_id INT,
  local_lat DECIMAL(10, 8),
  local_lng DECIMAL(11, 8),
  FOREIGN KEY (ordem_id) REFERENCES ordens_servico(id),
  FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id)
);

-- Tabela de aprovações de jornada
CREATE TABLE aprovacoes_jornada (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ordem_id INT NOT NULL,
  aprovado BOOLEAN,
  justificativa TEXT,
  data_aprovacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ordem_id) REFERENCES ordens_servico(id)
);
