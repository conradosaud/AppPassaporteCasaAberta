import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Clock, CheckCircle2 } from 'lucide-react';
import ModalOficina from './ModalOficina';
import './Cronograma.css';

// Paleta de cores dinâmica por índice
const PALETA_CORES = [
  { corClass: 'bg-cor-0',  textClass: 'text-cor-0'  , borderClass: 'border-cor-0' },
  { corClass: 'bg-cor-1',  textClass: 'text-cor-1'  , borderClass: 'border-cor-1' },
  { corClass: 'bg-cor-2',  textClass: 'text-cor-2'  , borderClass: 'border-cor-2' },
  { corClass: 'bg-cor-3',  textClass: 'text-cor-3'  , borderClass: 'border-cor-3' },
  { corClass: 'bg-cor-4',  textClass: 'text-cor-4'  , borderClass: 'border-cor-4' },
  { corClass: 'bg-cor-5',  textClass: 'text-cor-5'  , borderClass: 'border-cor-5' },
  { corClass: 'bg-cor-6',  textClass: 'text-cor-6'  , borderClass: 'border-cor-6' },
  { corClass: 'bg-cor-7',  textClass: 'text-cor-7'  , borderClass: 'border-cor-7' },
  { corClass: 'bg-cor-8',  textClass: 'text-cor-8'  , borderClass: 'border-cor-8' },
  { corClass: 'bg-cor-9',  textClass: 'text-cor-9'  , borderClass: 'border-cor-9' },
  { corClass: 'bg-cor-10', textClass: 'text-cor-10' , borderClass: 'border-cor-10' },
  { corClass: 'bg-cor-11', textClass: 'text-cor-11' , borderClass: 'border-cor-11' },
  { corClass: 'bg-cor-12', textClass: 'text-cor-12' , borderClass: 'border-cor-12' },
  { corClass: 'bg-cor-13', textClass: 'text-cor-13' , borderClass: 'border-cor-13' },
  { corClass: 'bg-cor-14', textClass: 'text-cor-14' , borderClass: 'border-cor-14' },
  { corClass: 'bg-cor-15', textClass: 'text-cor-15' , borderClass: 'border-cor-15' },
  { corClass: 'bg-cor-16', textClass: 'text-cor-16' , borderClass: 'border-cor-16' },
  { corClass: 'bg-cor-17', textClass: 'text-cor-17' , borderClass: 'border-cor-17' },
  { corClass: 'bg-cor-18', textClass: 'text-cor-18' , borderClass: 'border-cor-18' },
  { corClass: 'bg-cor-19', textClass: 'text-cor-19' , borderClass: 'border-cor-19' },
];

function parseHora(str) {
  const match = str.trim().match(/^(\d{1,2})h(\d{0,2})$/);
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = match[2] ? parseInt(match[2], 10) : 0;
  return h + m / 60;
}

function parseHorario(str) {
  const partes = str.split(/\s+às\s+/i);
  if (partes.length === 2) {
    const inicio = parseHora(partes[0]);
    const fim    = parseHora(partes[1]);
    if (inicio !== null && fim !== null && fim > inicio) {
      return { inicio, duracao: fim - inicio };
    }
  }
  const inicio = parseHora(partes[0]);
  if (inicio !== null) {
    return { inicio, duracao: 1 };
  }
  return null;
}

function classificaPeriodo(inicio) {
  if (inicio < 12) return 'Manhã';
  if (inicio < 18) return 'Tarde';
  return 'Noite';
}

function formataHora(horaDecimal) {
  const horas   = Math.floor(horaDecimal);
  const minutos = Math.round((horaDecimal - horas) * 60);
  return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
}

export default function LinhaTempoVertical({ periodoAtivo }) {
  const [oficinasConcluidas, setOficinasConcluidas] = useState([]);
  const [oficinaSelecionada, setOficinaSelecionada] = useState(null);
  const [oficinasData, setOficinasData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const salvas = localStorage.getItem('oficinasConcluidas');
    if (salvas) {
      setOficinasConcluidas(JSON.parse(salvas));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('oficinasConcluidas', JSON.stringify(oficinasConcluidas));
  }, [oficinasConcluidas]);

  useEffect(() => {
    fetch('/oficinas.json')
      .then((res) => res.json())
      .then((data) => {
        setOficinasData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar oficinas.json:', err);
        setIsLoading(false);
      });
  }, []);

  const handleCheckout = (oficina) => {
    if (!oficinasConcluidas.includes(oficina.titulo)) {
      setOficinasConcluidas([...oficinasConcluidas, oficina.titulo]);
    }
  };

  const handleAbrirModal = (oficina, areaNome, sala, horarioFormatado) => {
    setOficinaSelecionada({ ...oficina, areaNome, sala, horarioFormatado });
  };

  const handleFecharModal = () => {
    setOficinaSelecionada(null);
  };

  // Mapeamento de locais para índices de cores
  const mapaLocaisCores = useMemo(() => {
    const mapa = new Map();
    let idx = 0;
    oficinasData.forEach((oficina) => {
      const localKey = oficina.local?.trim() || 'Local a definir';
      if (!mapa.has(localKey)) {
        mapa.set(localKey, PALETA_CORES[idx % PALETA_CORES.length]);
        idx++;
      }
    });
    return mapa;
  }, [oficinasData]);

  // Oficinas processadas e filtradas
  const listaOficinas = useMemo(() => {
    if (!oficinasData.length) return [];

    const lista = [];

    oficinasData.forEach((oficina) => {
      const localKey = oficina.local?.trim() || 'Local a definir';
      const corObj = mapaLocaisCores.get(localKey) || PALETA_CORES[0];

      if (oficina.horarios && oficina.horarios.length > 0) {
        oficina.horarios.forEach((horStr) => {
          const parsed = parseHorario(horStr);
          if (!parsed) return;
          const periodo = classificaPeriodo(parsed.inicio);

          lista.push({
            titulo:          oficina.titulo,
            descricao:       oficina.descricao,
            categoria:       oficina.categoria,
            observacao:      oficina.observacao,
            local:           localKey,
            inicio:          parsed.inicio,
            duracao:         parsed.duracao,
            periodo,
            horarioFormatado:`${formataHora(parsed.inicio)} – ${formataHora(parsed.inicio + parsed.duracao)}`,
            corObj,
          });
        });
      } else {
        // Exposição sem horário
        lista.push({
          titulo:          oficina.titulo,
          descricao:       oficina.descricao,
          categoria:       oficina.categoria,
          observacao:      oficina.observacao,
          local:           localKey,
          inicio:          6,
          duracao:         17,
          periodo:         'Exposição',
          horarioFormatado:'06:00 – 23:00',
          corObj,
        });
      }
    });

    // Filtrar pelo período ativo
    const filtradas = lista.filter((o) => o.periodo === periodoAtivo);

    // Ordenar cronologicamente por horário de início e depois por local
    filtradas.sort((a, b) => {
      if (a.inicio !== b.inicio) return a.inicio - b.inicio;
      return a.local.localeCompare(b.local);
    });

    return filtradas;
  }, [oficinasData, periodoAtivo, mapaLocaisCores]);

  if (isLoading) {
    return (
      <div className="tabela-wrapper" style={{ padding: '32px', textAlign: 'center', color: '#666' }}>
        Carregando linha do tempo...
      </div>
    );
  }

  return (
    <div className="tabela-wrapper">
      <div className="timeline-container">
        {listaOficinas.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '24px' }}>
            Nenhuma oficina neste período.
          </p>
        ) : (
          <div className="timeline-vertical">
            <div className="timeline-line" />
            {listaOficinas.map((oficina, idx) => {
              const isConcluida = oficinasConcluidas.includes(oficina.titulo);
              return (
                <div key={idx} className="timeline-item">
                  <div className={`timeline-badge ${isConcluida ? 'badge-concluida' : oficina.corObj.corClass}`}>
                    {isConcluida ? (
                      <CheckCircle2 size={16} color="#FFF" />
                    ) : (
                      <span>{formataHora(oficina.inicio)}</span>
                    )}
                  </div>

                  <div
                    className={`timeline-card ${isConcluida ? 'checkout-verde' : ''}`}
                    onClick={() => handleAbrirModal(oficina, oficina.local, oficina.local, oficina.horarioFormatado)}
                  >
                    <div className="timeline-card-header">
                      <span className={`timeline-tag ${oficina.corObj.textClass}`}>
                        {oficina.local}
                      </span>
                      <span className="timeline-time">
                        <Clock size={13} /> {oficina.horarioFormatado}
                      </span>
                    </div>

                    <h3 className="timeline-card-title">{oficina.titulo}</h3>

                    {oficina.categoria && (
                      <p className="timeline-card-cat">{oficina.categoria}</p>
                    )}

                    {isConcluida && (
                      <div className="timeline-concluida-badge">
                        <CheckCircle2 size={14} color="#155724" />
                        <span>Concluída</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ModalOficina
        oficina={oficinaSelecionada}
        onClose={handleFecharModal}
        onCheckout={handleCheckout}
        isConcluida={oficinaSelecionada && oficinasConcluidas.includes(oficinaSelecionada.titulo)}
      />
    </div>
  );
}
