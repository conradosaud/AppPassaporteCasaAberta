import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Clock, MapPin, Sun, BookOpen, ThumbsUp, ThumbsDown, CheckCircle, AlertCircle } from 'lucide-react';
import { salvarAvaliacao } from '../../supabase';
import './DetalhesOficina.css';

// Tolerância de 7 minutos (em milissegundos) entre conclusões
const TOLERANCIA_MS = 7 * 60 * 1000;
const CHAVE_ULTIMA_CONCLUSAO = 'ultimaConclusaoTimestamp';

// Calcula o período com base no horário de início (conforme documentação)
function calculaPeriodo(inicioDecimal) {
  if (inicioDecimal >= 6 && inicioDecimal < 12) return 'Manhã';
  if (inicioDecimal >= 12 && inicioDecimal < 18) return 'Tarde';
  return 'Noite';
}

// Retorna o ícone de categoria correto (ícone genérico BookOpen por padrão)
function getIconeCategoria(categoria) {
  return <BookOpen size={13} />;
}

export default function DetalhesOficina() {
  const navigate = useNavigate();
  const location = useLocation();

  const [concluida, setConcluida] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalTolerancia, setShowModalTolerancia] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroSalvar, setErroSalvar] = useState(null);

  // Lê os dados da oficina passados pela navegação
  const oficina = location.state?.oficina || null;

  // Verifica se esta oficina já foi concluída no localStorage
  useEffect(() => {
    if (!oficina) return;
    const salvas = localStorage.getItem('oficinasConcluidas');
    if (salvas) {
      const lista = JSON.parse(salvas);
      if (lista.includes(oficina.titulo)) {
        setConcluida(true);
      }
    }
  }, []);

  // Se não houver dados de navegação, exibe mensagem de erro
  if (!oficina) {
    return (
      <div className="detalhes-container">
        <header className="detalhes-header">
          <button className="btn-voltar" onClick={() => navigate('/cronograma')} aria-label="Voltar">
            <ChevronLeft size={24} color="#004587" />
          </button>
          <h1 className="titulo-pagina">Detalhes da Oficina</h1>
          <div style={{ width: 40 }}></div>
        </header>
        <main className="detalhes-main detalhes-erro">
          <AlertCircle size={48} color="#f37021" />
          <p>Nenhuma oficina selecionada.</p>
          <p>Volte ao cronograma e selecione uma oficina.</p>
          <button className="btn-concluir" style={{ marginTop: '24px' }} onClick={() => navigate('/cronograma')}>
            Ir para o Cronograma
          </button>
        </main>
      </div>
    );
  }

  const formataHora = (horaDecimal) => {
    const horas = Math.floor(horaDecimal);
    const minutos = Math.round((horaDecimal - horas) * 60);
    return `${horas.toString().padStart(2, '0')}h${minutos > 0 ? minutos.toString().padStart(2, '0') : ''}`;
  };

  const periodo = calculaPeriodo(oficina.inicio);
  const inicioFormatado = formataHora(oficina.inicio);
  const fimFormatado = formataHora(oficina.inicio + oficina.duracao);

  // Verifica se o usuário ainda está dentro do período de tolerância
  const estaEmTolerancia = () => {
    const ultimaConclusao = localStorage.getItem(CHAVE_ULTIMA_CONCLUSAO);
    if (!ultimaConclusao) return false;
    const decorrido = Date.now() - parseInt(ultimaConclusao, 10);
    return decorrido < TOLERANCIA_MS;
  };

  const handleConcluir = () => {
    setErroSalvar(null);

    if (estaEmTolerancia()) {
      // Bloqueia: exibe modal de tolerância sem mostrar o tempo
      setShowModalTolerancia(true);
      return;
    }

    // Dentro do prazo normal: exibe o modal de avaliação
    setShowModal(true);
  };

  const handleAvaliacao = async (gostou) => {
    setSalvando(true);
    setErroSalvar(null);

    try {
      // Lê nome do usuário do localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const nomeUser = userData.fullName || 'Visitante';

      // Salva avaliação no Supabase
      await salvarAvaliacao(nomeUser, oficina.titulo, gostou);

      // Marca a oficina como concluída no localStorage
      const salvas = localStorage.getItem('oficinasConcluidas');
      const lista = salvas ? JSON.parse(salvas) : [];
      if (!lista.includes(oficina.titulo)) {
        lista.push(oficina.titulo);
        localStorage.setItem('oficinasConcluidas', JSON.stringify(lista));
      }

      // Registra o timestamp desta conclusão para controle de tolerância
      localStorage.setItem(CHAVE_ULTIMA_CONCLUSAO, String(Date.now()));

      setConcluida(true);
      setShowModal(false);
    } catch (erro) {
      setErroSalvar('Não foi possível salvar sua avaliação. Tente novamente.');
      console.error(erro);
    } finally {
      setSalvando(false);
    }
  };

  // Exposições não permitem conclusão nem avaliação
  const isExposicao = oficina.periodo === 'Exposição';

  return (
    <div className="detalhes-container">
      {/* Topo */}
      <header className="detalhes-header">
        <button className="btn-voltar" onClick={() => navigate(-1)} aria-label="Voltar">
          <ChevronLeft size={24} color="#004587" />
        </button>
        <h1 className="titulo-pagina">{isExposicao ? 'Detalhes da Exposição' : 'Detalhes da Oficina'}</h1>
        <div style={{ width: 40 }}></div>
      </header>

      {/* Conteúdo Principal */}
      <main className="detalhes-main">

        {/* Nome + Badges */}
        <div className="info-principal">
          <h2 className="nome-oficina">{oficina.titulo}</h2>
          <div className="badges-row">
            <span className="badge-categoria">
              {getIconeCategoria(oficina.categoria)}
              {oficina.categoria || oficina.areaNome}
            </span>
            <span className="badge-periodo">
              <Sun size={13} />
              {periodo}
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
                <span className="info-value">{inicioFormatado}</span>
              </div>
            </div>
            <div className="info-row">
              <Clock size={20} className="info-icon" />
              <div className="info-text">
                <span className="info-label">Término</span>
                <span className="info-value">{fimFormatado}</span>
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
              <span className="info-value">{oficina.sala || '—'}</span>
            </div>
          </div>
        </div>

        {/* Descrição */}
        {oficina.descricao && (
          <div className="descricao-section">
            <h3 className="titulo-secao">Sobre a oficina</h3>
            <p className="texto-descricao">{oficina.descricao}</p>
          </div>
        )}
      </main>

      {/* Área Inferior Fixa — oculta para exposições */}
      {!isExposicao && (
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
      )}

      {/* Modal de Avaliação — não disponível para exposições */}
      {!isExposicao && showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Você gostou da experiência desta oficina?</h3>

            {erroSalvar && (
              <p className="modal-erro">{erroSalvar}</p>
            )}

            <div className="modal-actions">
              <button
                className="btn-avaliacao like"
                onClick={() => handleAvaliacao(true)}
                disabled={salvando}
              >
                <ThumbsUp size={32} />
                <span>Sim</span>
              </button>
              <button
                className="btn-avaliacao dislike"
                onClick={() => handleAvaliacao(false)}
                disabled={salvando}
              >
                <ThumbsDown size={32} />
                <span>Não</span>
              </button>
            </div>

            {salvando && <p className="modal-salvando">Salvando avaliação...</p>}
          </div>
        </div>
      )}

      {/* Modal de Tolerância — bloqueia nova conclusão dentro de 7 min */}
      {showModalTolerancia && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="tolerancia-titulo">
          <div className="modal-content modal-tolerancia">
            <div className="tolerancia-icone" aria-hidden="true">⏳</div>
            <h3 id="tolerancia-titulo" className="tolerancia-titulo">
              OPS!
            </h3>
            <p className="tolerancia-subtexto">
              Você acabou de concluir uma oficina.{' '}
              <strong>Aguarde para concluir outra.</strong>
            </p>
            <button
              className="btn-tolerancia-ok"
              onClick={() => setShowModalTolerancia(false)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
