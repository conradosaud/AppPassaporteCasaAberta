import React, { useState, useEffect } from 'react';
import { MapPin, Clock } from 'lucide-react';
import ModalOficina from './ModalOficina';
import './Cronograma.css';

export default function TabelaHorarios({ periodoAtivo }) {
  // Estado para armazenar IDs/Títulos de oficinas concluídas
  const [oficinasConcluidas, setOficinasConcluidas] = useState([]);
  
  // Estado do modal
  const [oficinaSelecionada, setOficinaSelecionada] = useState(null);

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

  const handleCheckout = (oficina) => {
    if (!oficinasConcluidas.includes(oficina.titulo)) {
      setOficinasConcluidas([...oficinasConcluidas, oficina.titulo]);
    }
  };

  const handleAbrirModal = (oficina, areaNome, sala, horarioFormatado) => {
    setOficinaSelecionada({
      ...oficina,
      areaNome,
      sala,
      horarioFormatado
    });
  };

  const handleFecharModal = () => {
    setOficinaSelecionada(null);
  };

  // Configuração de horários por período
  const configuracaoPeriodos = {
    'Manhã': { inicio: 8, fim: 12, intervalos: [8, 9, 10, 11, 12] },
    'Tarde': { inicio: 12, fim: 18, intervalos: [12, 13, 14, 15, 16, 17, 18] },
    'Noite': { inicio: 18, fim: 22, intervalos: [18, 19, 20, 21, 22] },
    'Exposição': { inicio: 6, fim: 23, intervalos: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] }
  };
  
  const configAtual = configuracaoPeriodos[periodoAtivo];

  // Mock de dados
  const areasMock = [
    {
      id: 'tecnologia',
      nome: 'Tecnologia',
      sala: 'Sala 1',
      corClass: 'bg-tecnologia',
      oficinas: [
        { titulo: 'Programação Web', inicio: 12, duracao: 1.5, periodo: 'Tarde' },
        { titulo: 'Inteligência Artificial', inicio: 13.5, duracao: 1.5, periodo: 'Tarde' },
        { titulo: 'Cibersegurança', inicio: 16, duracao: 1.5, periodo: 'Tarde' },
        { titulo: 'Internet sem Mistérios', inicio: 9, duracao: 2, periodo: 'Manhã' },
        { titulo: 'Lógica com Games', inicio: 19, duracao: 1.5, periodo: 'Noite' },
        { titulo: 'Exposição de Robótica', inicio: 6, duracao: 17, periodo: 'Exposição' }
      ]
    },
    {
      id: 'gestao',
      nome: 'Gestão',
      sala: 'Sala 2',
      corClass: 'bg-gestao',
      oficinas: [
        { titulo: 'Marketing Digital', inicio: 12, duracao: 1, periodo: 'Tarde' },
        { titulo: 'Empreendedorismo', inicio: 13, duracao: 1.5, periodo: 'Tarde' },
        { titulo: 'Finanças Pessoais', inicio: 15, duracao: 1.5, periodo: 'Tarde' },
        { titulo: 'Gestão de Projetos', inicio: 17, duracao: 1.5, periodo: 'Tarde' },
        { titulo: 'Operação Casa Sob Controle', inicio: 10, duracao: 2, periodo: 'Manhã' },
        { titulo: 'Feira de Empreendedorismo', inicio: 6, duracao: 17, periodo: 'Exposição' }
      ]
    },
    {
      id: 'saude',
      nome: 'Saúde',
      sala: 'Sala 3',
      corClass: 'bg-saude',
      oficinas: [
        { titulo: 'Enfermagem na Prática', inicio: 12.5, duracao: 1.5, periodo: 'Tarde' },
        { titulo: 'Nutrição e Saúde', inicio: 14.25, duracao: 1.5, periodo: 'Tarde' },
        { titulo: 'Primeiros Socorros', inicio: 16, duracao: 1.5, periodo: 'Tarde' },
        { titulo: 'Na Linha de Frente', inicio: 9, duracao: 1, periodo: 'Manhã' },
        { titulo: 'Técnicas de Massagem', inicio: 19.5, duracao: 1, periodo: 'Noite' },
        { titulo: 'Quanto custa sua vida?', inicio: 6, duracao: 17, periodo: 'Exposição' }
      ]
    },
    {
      id: 'criatividade',
      nome: 'Criatividade',
      sala: 'Sala 4',
      corClass: 'bg-criatividade',
      oficinas: [
        { titulo: 'Design Thinking', inicio: 13, duracao: 1, periodo: 'Tarde' },
        { titulo: 'Fotografia Criativa', inicio: 14.5, duracao: 1.5, periodo: 'Tarde' },
        { titulo: 'Produção de Conteúdo', inicio: 16.5, duracao: 1.5, periodo: 'Tarde' },
        { titulo: 'Memória Bordada', inicio: 10, duracao: 2, periodo: 'Manhã' },
        { titulo: 'Exposição "Os Bastidores da Transformação"', inicio: 6, duracao: 17, periodo: 'Exposição' }
      ]
    },
    {
      id: 'educacao',
      nome: 'Educação',
      sala: 'Sala 5',
      corClass: 'bg-educacao',
      oficinas: [
        { titulo: 'Metodologias Ativas', inicio: 12, duracao: 1.5, periodo: 'Tarde' },
        { titulo: 'Educação Inclusiva', inicio: 13.75, duracao: 1.5, periodo: 'Tarde' },
        { titulo: 'Tecnologias na Educação', inicio: 15.5, duracao: 1.5, periodo: 'Tarde' },
        { titulo: 'Gamificação', inicio: 17.25, duracao: 1.5, periodo: 'Tarde' },
        { titulo: 'Trajetórias de Transformação', inicio: 19, duracao: 2, periodo: 'Noite' },
        { titulo: 'Mostra de Projetos', inicio: 6, duracao: 17, periodo: 'Exposição' }
      ]
    }
  ];

  const formataHora = (horaDecimal) => {
    const horas = Math.floor(horaDecimal);
    const minutos = Math.round((horaDecimal - horas) * 60);
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  };

  const calculaEstiloCard = (inicio, duracao) => {
    const totalHoras = configAtual.fim - configAtual.inicio;
    let leftPercent = ((inicio - configAtual.inicio) / totalHoras) * 100;
    let widthPercent = (duracao / totalHoras) * 100;

    if (leftPercent < 0) {
      widthPercent += leftPercent;
      leftPercent = 0;
    }
    if (leftPercent + widthPercent > 100) {
      widthPercent = 100 - leftPercent;
    }

    return {
      left: `${leftPercent}%`,
      width: `${widthPercent}%`,
      zIndex: 5
    };
  };

  // Renderização específica para Exposição
  if (periodoAtivo === 'Exposição') {
    const exposicoes = [];
    areasMock.forEach(area => {
      area.oficinas.forEach(oficina => {
        if (oficina.periodo === 'Exposição') {
          exposicoes.push({ ...oficina, areaId: area.id, areaNome: area.nome, sala: area.sala, corClass: area.corClass });
        }
      });
    });

    return (
      <div className="tabela-wrapper" style={{ overflowX: 'hidden' }}>
        <div className="exposicao-grid">
          {exposicoes.map((oficina, idx) => {
             const isConcluida = oficinasConcluidas.includes(oficina.titulo);
             const horarioFormatado = `${formataHora(oficina.inicio)} – ${formataHora(oficina.inicio + oficina.duracao)}`;
             return (
                <div 
                  key={idx} 
                  className={`exposicao-card-item ${isConcluida ? 'checkout-verde' : oficina.corClass}`}
                  onClick={() => handleAbrirModal(oficina, oficina.areaNome, oficina.sala, horarioFormatado)}
                >
                  <span className="exposicao-card-title">{oficina.titulo}</span>
                  <div className="exposicao-card-area">
                     <Clock size={14} /> {horarioFormatado} | <MapPin size={14} /> {oficina.sala} ({oficina.areaNome})
                  </div>
                </div>
             )
          })}
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

  // Renderização padrão da Tabela
  const totalHoras = configAtual.fim - configAtual.inicio;
  const larguraMinima = totalHoras * 120 + 100; 

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

        {areasMock.map((area) => {
          const oficinasPeriodo = area.oficinas.filter(o => o.periodo === periodoAtivo);

          return (
            <div key={area.id} className="tabela-area-row">
              <div className="area-info-col">
                <span className={`area-nome text-${area.id}`}>{area.nome}</span>
                <span className="area-sala">{area.sala}</span>
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
                        zIndex: 1
                      }}
                    />
                  );
                })}

                {oficinasPeriodo.map((oficina, idx) => {
                  const horarioFormatado = `${formataHora(oficina.inicio)} – ${formataHora(oficina.inicio + oficina.duracao)}`;
                  const estilo = calculaEstiloCard(oficina.inicio, oficina.duracao);
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
        })}
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
