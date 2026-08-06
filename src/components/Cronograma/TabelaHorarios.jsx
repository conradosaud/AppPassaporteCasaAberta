import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Clock } from 'lucide-react';
import ModalOficina from './ModalOficina';
import './Cronograma.css';

// Paleta de cores dinâmica por índice (Opção A)
const PALETA_CORES = [
  { corClass: 'bg-cor-0',  textClass: 'text-cor-0'  },
  { corClass: 'bg-cor-1',  textClass: 'text-cor-1'  },
  { corClass: 'bg-cor-2',  textClass: 'text-cor-2'  },
  { corClass: 'bg-cor-3',  textClass: 'text-cor-3'  },
  { corClass: 'bg-cor-4',  textClass: 'text-cor-4'  },
  { corClass: 'bg-cor-5',  textClass: 'text-cor-5'  },
  { corClass: 'bg-cor-6',  textClass: 'text-cor-6'  },
  { corClass: 'bg-cor-7',  textClass: 'text-cor-7'  },
  { corClass: 'bg-cor-8',  textClass: 'text-cor-8'  },
  { corClass: 'bg-cor-9',  textClass: 'text-cor-9'  },
  { corClass: 'bg-cor-10', textClass: 'text-cor-10' },
  { corClass: 'bg-cor-11', textClass: 'text-cor-11' },
  { corClass: 'bg-cor-12', textClass: 'text-cor-12' },
  { corClass: 'bg-cor-13', textClass: 'text-cor-13' },
  { corClass: 'bg-cor-14', textClass: 'text-cor-14' },
  { corClass: 'bg-cor-15', textClass: 'text-cor-15' },
  { corClass: 'bg-cor-16', textClass: 'text-cor-16' },
  { corClass: 'bg-cor-17', textClass: 'text-cor-17' },
  { corClass: 'bg-cor-18', textClass: 'text-cor-18' },
  { corClass: 'bg-cor-19', textClass: 'text-cor-19' },
];

/**
 * Converte string "14h30" ou "9h" em número decimal.
 * "14h30" → 14.5 | "9h" → 9 | "09h00" → 9
 */
function parseHora(str) {
  const match = str.trim().match(/^(\d{1,2})h(\d{0,2})$/);
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = match[2] ? parseInt(match[2], 10) : 0;
  return h + m / 60;
}

/**
 * Converte string de horário em { inicio, duracao }.
 * "14h às 15h30"  → { inicio: 14,   duracao: 1.5 }
 * "10h30 às 11h"  → { inicio: 10.5, duracao: 0.5 }
 * "9h10"          → { inicio: 9.17, duracao: 1   }  (ponto único → 1h padrão)
 */
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

/** Classifica o período com base no horário de início. */
function classificaPeriodo(inicio) {
  if (inicio < 12) return 'Manhã';
  if (inicio < 18) return 'Tarde';
  return 'Noite';
}

export default function TabelaHorarios({ periodoAtivo }) {
  const [oficinasConcluidas, setOficinasConcluidas] = useState([]);
  const [oficinaSelecionada, setOficinaSelecionada] = useState(null);
  const [oficinasData, setOficinasData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar do localStorage ao montar
  useEffect(() => {
    const salvas = localStorage.getItem('oficinasConcluidas');
    if (salvas) {
      setOficinasConcluidas(JSON.parse(salvas));
    }
  }, []);

  // Salvar no localStorage ao alterar
  useEffect(() => {
    localStorage.setItem('oficinasConcluidas', JSON.stringify(oficinasConcluidas));
  }, [oficinasConcluidas]);

  // Carregar oficinas do JSON real
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

  // Configuração de horários por período
  const configuracaoPeriodos = {
    'Manhã':     { inicio: 8,  fim: 12, intervalos: [8, 9, 10, 11, 12] },
    'Tarde':     { inicio: 12, fim: 18, intervalos: [12, 13, 14, 15, 16, 17, 18] },
    'Noite':     { inicio: 18, fim: 22, intervalos: [18, 19, 20, 21, 22] },
    'Exposição': { inicio: 6,  fim: 23, intervalos: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] }
  };

  const configAtual = configuracaoPeriodos[periodoAtivo];

  /**
   * Transforma o JSON em áreas agrupadas por local,
   * expandindo cada horário em um card individual.
   * Oficinas sem horário → Exposição (06h–23h).
   */
  const areasDinamicas = useMemo(() => {
    if (!oficinasData.length) return [];

    const mapaLocais = new Map();

    oficinasData.forEach((oficina) => {
      const localKey = oficina.local?.trim() || 'Local a definir';
      if (!mapaLocais.has(localKey)) mapaLocais.set(localKey, []);

      if (oficina.horarios && oficina.horarios.length > 0) {
        oficina.horarios.forEach((horStr) => {
          const parsed = parseHorario(horStr);
          if (!parsed) return;
          mapaLocais.get(localKey).push({
            titulo:          oficina.titulo,
            descricao:       oficina.descricao,
            categoria:       oficina.categoria,
            observacao:      oficina.observacao,
            local:           localKey,
            inicio:          parsed.inicio,
            duracao:         parsed.duracao,
            periodo:         classificaPeriodo(parsed.inicio),
            horarioOriginal: horStr,
          });
        });
      } else {
        // Sem horário → exposição contínua
        mapaLocais.get(localKey).push({
          titulo:          oficina.titulo,
          descricao:       oficina.descricao,
          categoria:       oficina.categoria,
          observacao:      oficina.observacao,
          local:           localKey,
          inicio:          6,
          duracao:         17,
          periodo:         'Exposição',
          horarioOriginal: null,
        });
      }
    });

    return Array.from(mapaLocais.entries()).map(([local, oficinas], idx) => ({
      id:       `area-${idx}`,
      nome:     local,
      sala:     local,
      corClass: PALETA_CORES[idx % PALETA_CORES.length].corClass,
      textClass:PALETA_CORES[idx % PALETA_CORES.length].textClass,
      oficinas,
    }));
  }, [oficinasData]);

  const formataHora = (horaDecimal) => {
    const horas   = Math.floor(horaDecimal);
    const minutos = Math.round((horaDecimal - horas) * 60);
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  };

  const calculaEstiloCard = (inicio, duracao) => {
    const totalHoras = configAtual.fim - configAtual.inicio;
    let leftPercent  = ((inicio - configAtual.inicio) / totalHoras) * 100;
    let widthPercent = (duracao / totalHoras) * 100;

    if (leftPercent < 0) {
      widthPercent += leftPercent;
      leftPercent = 0;
    }
    if (leftPercent + widthPercent > 100) {
      widthPercent = 100 - leftPercent;
    }
    if (widthPercent <= 0) return null;

    return { left: `${leftPercent}%`, width: `${widthPercent}%`, zIndex: 5 };
  };

  if (isLoading) {
    return (
      <div className="tabela-wrapper" style={{ padding: '32px', textAlign: 'center', color: '#666' }}>
        Carregando programação...
      </div>
    );
  }

  // ── Renderização da aba Exposição ──────────────────────────────────────
  if (periodoAtivo === 'Exposição') {
    const exposicoes = [];
    areasDinamicas.forEach((area) => {
      area.oficinas.forEach((oficina) => {
        if (oficina.periodo === 'Exposição') {
          exposicoes.push({ ...oficina, areaId: area.id, areaNome: area.nome, sala: area.sala, corClass: area.corClass });
        }
      });
    });

    return (
      <div className="tabela-wrapper" style={{ overflowX: 'hidden' }}>
        {exposicoes.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '16px' }}>
            Nenhuma exposição cadastrada.
          </p>
        ) : (
          <div className="exposicao-grid">
            {exposicoes.map((oficina, idx) => {
              const isConcluida      = oficinasConcluidas.includes(oficina.titulo);
              const horarioFormatado = '06:00 – 23:00';
              return (
                <div
                  key={idx}
                  className={`exposicao-card-item ${isConcluida ? 'checkout-verde' : oficina.corClass}`}
                  onClick={() => handleAbrirModal(oficina, oficina.areaNome, oficina.sala, horarioFormatado)}
                >
                  <span className="exposicao-card-title">{oficina.titulo}</span>
                  <div className="exposicao-card-area">
                    <Clock size={14} /> {horarioFormatado} | <MapPin size={14} /> {oficina.sala}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <ModalOficina
          oficina={oficinaSelecionada}
          onClose={handleFecharModal}
          onCheckout={handleCheckout}
          isConcluida={oficinaSelecionada && oficinasConcluidas.includes(oficinaSelecionada.titulo)}
        />
      </div>
    );
  }

  // ── Renderização da Tabela (Manhã / Tarde / Noite) ─────────────────────
  const totalHoras    = configAtual.fim - configAtual.inicio;
  const larguraMinima = totalHoras * 120 + 100;

  const areasFiltradas = areasDinamicas.filter((area) =>
    area.oficinas.some((o) => o.periodo === periodoAtivo)
  );

  return (
    <div className="tabela-wrapper">
      <div className="tabela-horarios" style={{ minWidth: `${larguraMinima}px` }}>

        <div className="tabela-header-row" style={{ position: 'relative', height: '30px', marginLeft: '100px' }}>
          {configAtual.intervalos.map((hora) => {
            const leftPercent = ((hora - configAtual.inicio) / totalHoras) * 100;
            return (
              <div
                key={hora}
                className="tabela-header-cell"
                style={{ position: 'absolute', left: `${leftPercent}%`, transform: 'translateX(-50%)' }}
              >
                {hora}:00
              </div>
            );
          })}
        </div>

        {areasFiltradas.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '16px' }}>
            Nenhuma oficina neste período.
          </p>
        ) : (
          areasFiltradas.map((area) => {
            const oficinasPeriodo = area.oficinas.filter((o) => o.periodo === periodoAtivo);
            return (
              <div key={area.id} className="tabela-area-row">
                <div className="area-info-col">
                  <span className={`area-nome ${area.textClass}`}>{area.nome}</span>
                </div>

                <div className="area-oficinas-col">
                  {configAtual.intervalos.map((hora) => {
                    const leftPercent = ((hora - configAtual.inicio) / totalHoras) * 100;
                    return (
                      <div
                        key={`grid-${hora}`}
                        style={{
                          position: 'absolute',
                          left: `${leftPercent}%`,
                          width: '1px',
                          height: '100%',
                          backgroundColor: '#E0E0E0',
                          zIndex: 1,
                        }}
                      />
                    );
                  })}

                  {oficinasPeriodo.map((oficina, idx) => {
                    const horarioFormatado = `${formataHora(oficina.inicio)} – ${formataHora(oficina.inicio + oficina.duracao)}`;
                    const estilo           = calculaEstiloCard(oficina.inicio, oficina.duracao);
                    if (!estilo) return null;
                    const isConcluida = oficinasConcluidas.includes(oficina.titulo);

                    return (
                      <div
                        key={idx}
                        className={`oficina-card ${isConcluida ? 'checkout-verde' : area.corClass}`}
                        style={estilo}
                        title={`${oficina.titulo} (${horarioFormatado})`}
                        onClick={() => handleAbrirModal(oficina, area.nome, area.sala, horarioFormatado)}
                      >
                        <span className="oficina-titulo">{oficina.titulo}</span>
                        <span className="oficina-horario">{horarioFormatado}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
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
