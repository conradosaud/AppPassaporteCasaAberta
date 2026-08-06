import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, MapPin, Sun, UtensilsCrossed, ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';
import './DetalhesOficina.css';

export default function DetalhesOficina() {
  const navigate = useNavigate();
  const [concluida, setConcluida] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const mockData = {
    nome: "Moqueca de Peixe: A Culinária Angolana no Nordeste Brasileiro",
    categoria: "Gastronomia e Alimentação",
    periodo: "Tarde",
    descricao: "Nesta oficina, os participantes vão aprender a preparar a autêntica moqueca de peixe, um prato afro-brasileiro típico do Nordeste, conhecendo ingredientes e, ao final, realizando uma degustação.",
    inicio: "12h30",
    fim: "13h00",
    local: "Laboratório 15"
  };

  const handleConcluir = () => {
    setShowModal(true);
  };

  const handleAvaliacao = (gostou) => {
    setConcluida(true);
    setShowModal(false);
    // Posteriormente, salvar no banco de dados e redirecionar para cronograma:
    // navigate('/cronograma');
  };

  return (
    <div className="detalhes-container">
      {/* Topo */}
      <header className="detalhes-header">
        <button className="btn-voltar" onClick={() => navigate(-1)} aria-label="Voltar">
          <ChevronLeft size={24} color="#004587" />
        </button>
        <h1 className="titulo-pagina">Detalhes da Oficina</h1>
        <div style={{ width: 40 }}></div>
      </header>

      {/* Conteúdo Principal */}
      <main className="detalhes-main">

        {/* Nome + Badges */}
        <div className="info-principal">
          <h2 className="nome-oficina">{mockData.nome}</h2>
          <div className="badges-row">
            <span className="badge-categoria">
              <UtensilsCrossed size={13} />
              {mockData.categoria}
            </span>
            <span className="badge-periodo">
              <Sun size={13} />
              {mockData.periodo}
            </span>
          </div>
        </div>

        {/* Card de Informações */}
        <div className="card-info">
          {/* Grid de horários */}
          <div className="horarios-grid">
            <div className="info-row">
              <Clock size={20} className="info-icon" />
              <div className="info-text">
                <span className="info-label">Início</span>
                <span className="info-value">{mockData.inicio}</span>
              </div>
            </div>
            <div className="info-row">
              <Clock size={20} className="info-icon" />
              <div className="info-text">
                <span className="info-label">Término</span>
                <span className="info-value">{mockData.fim}</span>
              </div>
            </div>
          </div>

          {/* Divisor */}
          <div className="card-divider" />

          {/* Local em linha própria */}
          <div className="info-row">
            <MapPin size={20} className="info-icon" />
            <div className="info-text">
              <span className="info-label">Local / Sala</span>
              <span className="info-value">{mockData.local}</span>
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div className="descricao-section">
          <h3 className="titulo-secao">Sobre a oficina</h3>
          <p className="texto-descricao">{mockData.descricao}</p>
        </div>
      </main>

      {/* Área Inferior Fixa */}
      <footer className="detalhes-footer">
        {!concluida ? (
          <button className="btn-concluir" onClick={handleConcluir}>
            <span className="btn-icon-circle">
              <CheckCircle size={22} />
            </span>
            <span>Concluir oficina</span>
          </button>
        ) : (
          <div className="selo-concluido">
            <CheckCircle size={24} color="#28a745" />
            <span>Oficina concluída</span>
          </div>
        )}
      </footer>

      {/* Modal de Avaliação */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Você gostou da experiência desta oficina?</h3>
            <div className="modal-actions">
              <button className="btn-avaliacao like" onClick={() => handleAvaliacao(true)}>
                <ThumbsUp size={32} />
                <span>Sim</span>
              </button>
              <button className="btn-avaliacao dislike" onClick={() => handleAvaliacao(false)}>
                <ThumbsDown size={32} />
                <span>Não</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
