import React, { useState, useEffect } from 'react';
import { MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Cronograma.css';

export default function TabelaHorarios({ periodoAtivo }) {
  const navigate = useNavigate();

  // Estado para armazenar IDs/Títulos de oficinas concluídas
  const [oficinasConcluidas, setOficinasConcluidas] = useState([]);

  // Carregar do localStorage ao montar
  useEffect(() => {
    const salvas = localStorage.getItem('oficinasConcluidas');
    if (salvas) {
      setOficinasConcluidas(JSON.parse(salvas));
    }
  }, []);

  // Navegar para a página de detalhes passando os dados da oficina
  const handleAbrirDetalhes = (oficina, areaNome, sala, horarioFormatado) => {
    navigate('/detalhes', {
      state: {
        oficina: {
          ...oficina,
          areaNome,
          sala,
          horarioFormatado
        }
      }
    });
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
        { titulo: 'Programação Web', inicio: 12, duracao: 1.5, periodo: 'Tarde', categoria: 'Tecnologia da Informação', descricao: 'Aprenda os fundamentos do desenvolvimento web moderno, criando páginas responsivas com HTML, CSS e JavaScript.' },
        { titulo: 'Inteligência Artificial', inicio: 13.5, duracao: 1.5, periodo: 'Tarde', categoria: 'Tecnologia da Informação', descricao: 'Explore os conceitos de IA e machine learning com exemplos práticos e demonstrações ao vivo.' },
        { titulo: 'Cibersegurança', inicio: 16, duracao: 1.5, periodo: 'Tarde', categoria: 'Tecnologia da Informação', descricao: 'Entenda as principais ameaças digitais e aprenda técnicas de proteção e boas práticas de segurança.' },
        { titulo: 'Internet sem Mistérios', inicio: 9, duracao: 2, periodo: 'Manhã', categoria: 'Tecnologia da Informação', descricao: 'Uma introdução descomplicada à internet, redes e como funciona a comunicação digital.' },
        { titulo: 'Lógica com Games', inicio: 19, duracao: 1.5, periodo: 'Noite', categoria: 'Tecnologia da Informação', descricao: 'Desenvolva o raciocínio lógico através de jogos digitais e desafios de programação.' },
        { titulo: 'Exposição de Robótica', inicio: 6, duracao: 17, periodo: 'Exposição', categoria: 'Tecnologia da Informação', descricao: 'Exposição de projetos de robótica desenvolvidos pelos alunos do Senac ao longo do ano.' }
      ]
    },
    {
      id: 'gestao',
      nome: 'Gestão',
      sala: 'Sala 2',
      corClass: 'bg-gestao',
      oficinas: [
        { titulo: 'Marketing Digital', inicio: 12, duracao: 1, periodo: 'Tarde', categoria: 'Comunicação e Marketing', descricao: 'Descubra as estratégias de marketing digital e como usar as redes sociais para alavancar negócios.' },
        { titulo: 'Empreendedorismo', inicio: 13, duracao: 1.5, periodo: 'Tarde', categoria: 'Gestão e Negócios', descricao: 'Da ideia ao negócio: aprenda as etapas essenciais para transformar sua ideia em uma empresa real.' },
        { titulo: 'Finanças Pessoais', inicio: 15, duracao: 1.5, periodo: 'Tarde', categoria: 'Gestão e Negócios', descricao: 'Organize sua vida financeira com técnicas de planejamento, controle de gastos e investimentos.' },
        { titulo: 'Gestão de Projetos', inicio: 17, duracao: 1.5, periodo: 'Tarde', categoria: 'Gestão e Negócios', descricao: 'Aprenda metodologias ágeis e técnicas de gestão para entregar projetos com qualidade e no prazo.' },
        { titulo: 'Operação Casa Sob Controle', inicio: 10, duracao: 2, periodo: 'Manhã', categoria: 'Gestão e Negócios', descricao: 'Simule a gestão de uma empresa doméstica aplicando conceitos reais de administração.' },
        { titulo: 'Feira de Empreendedorismo', inicio: 6, duracao: 17, periodo: 'Exposição', categoria: 'Gestão e Negócios', descricao: 'Exposição de negócios criados por alunos empreendedores do Senac.' }
      ]
    },
    {
      id: 'saude',
      nome: 'Saúde',
      sala: 'Sala 3',
      corClass: 'bg-saude',
      oficinas: [
        { titulo: 'Enfermagem na Prática', inicio: 12.5, duracao: 1.5, periodo: 'Tarde', categoria: 'Saúde', descricao: 'Vivência prática em procedimentos básicos de enfermagem com simulação clínica e equipamentos reais.' },
        { titulo: 'Nutrição e Saúde', inicio: 14.25, duracao: 1.5, periodo: 'Tarde', categoria: 'Saúde', descricao: 'Entenda a importância da alimentação equilibrada e aprenda a montar um cardápio saudável.' },
        { titulo: 'Primeiros Socorros', inicio: 16, duracao: 1.5, periodo: 'Tarde', categoria: 'Segurança e Saúde no Trabalho', descricao: 'Treinamento prático em primeiros socorros, incluindo RCP e atendimento a emergências.' },
        { titulo: 'Na Linha de Frente', inicio: 9, duracao: 1, periodo: 'Manhã', categoria: 'Saúde', descricao: 'Relatos e práticas de profissionais de saúde sobre o cotidiano no atendimento ao paciente.' },
        { titulo: 'Técnicas de Massagem', inicio: 19.5, duracao: 1, periodo: 'Noite', categoria: 'Bem-estar', descricao: 'Aprenda técnicas básicas de massagem relaxante e terapêutica para o bem-estar.' },
        { titulo: 'Quanto custa sua vida?', inicio: 6, duracao: 17, periodo: 'Exposição', categoria: 'Saúde', descricao: 'Exposição interativa sobre hábitos saudáveis e o impacto no custo de vida.' }
      ]
    },
    {
      id: 'criatividade',
      nome: 'Criatividade',
      sala: 'Sala 4',
      corClass: 'bg-criatividade',
      oficinas: [
        { titulo: 'Design Thinking', inicio: 13, duracao: 1, periodo: 'Tarde', categoria: 'Design, Artes e Arquitetura', descricao: 'Metodologia criativa para solucionar problemas centrada no usuário, com prática em desafios reais.' },
        { titulo: 'Fotografia Criativa', inicio: 14.5, duracao: 1.5, periodo: 'Tarde', categoria: 'Design, Artes e Arquitetura', descricao: 'Explore composição, luz e criatividade fotográfica usando apenas o celular.' },
        { titulo: 'Produção de Conteúdo', inicio: 16.5, duracao: 1.5, periodo: 'Tarde', categoria: 'Comunicação e Marketing', descricao: 'Aprenda a criar conteúdo relevante e atraente para redes sociais e outras plataformas digitais.' },
        { titulo: 'Memória Bordada', inicio: 10, duracao: 2, periodo: 'Manhã', categoria: 'Design, Artes e Arquitetura', descricao: 'Oficina de bordado artístico como prática de memória afetiva e expressão criativa.' },
        { titulo: 'Exposição "Os Bastidores da Transformação"', inicio: 6, duracao: 17, periodo: 'Exposição', categoria: 'Design, Artes e Arquitetura', descricao: 'Mostra dos bastidores criativos de projetos artísticos e de design desenvolvidos pelos alunos.' }
      ]
    },
    {
      id: 'educacao',
      nome: 'Educação',
      sala: 'Sala 5',
      corClass: 'bg-educacao',
      oficinas: [
        { titulo: 'Metodologias Ativas', inicio: 12, duracao: 1.5, periodo: 'Tarde', categoria: 'Educação', descricao: 'Conheça e experimente metodologias como sala de aula invertida, PBL e aprendizagem baseada em projetos.' },
        { titulo: 'Educação Inclusiva', inicio: 13.75, duracao: 1.5, periodo: 'Tarde', categoria: 'Educação', descricao: 'Práticas e estratégias para criar ambientes de aprendizado acessíveis e inclusivos para todos.' },
        { titulo: 'Tecnologias na Educação', inicio: 15.5, duracao: 1.5, periodo: 'Tarde', categoria: 'Educação', descricao: 'Como integrar tecnologias digitais na sala de aula para potencializar o aprendizado.' },
        { titulo: 'Gamificação', inicio: 17.25, duracao: 1.5, periodo: 'Tarde', categoria: 'Educação', descricao: 'Use elementos de jogos para engajar alunos e tornar o aprendizado mais divertido e eficaz.' },
        { titulo: 'Trajetórias de Transformação', inicio: 19, duracao: 2, periodo: 'Noite', categoria: 'Educação', descricao: 'Histórias inspiradoras de pessoas que transformaram suas vidas através da educação.' },
        { titulo: 'Mostra de Projetos', inicio: 6, duracao: 17, periodo: 'Exposição', categoria: 'Educação', descricao: 'Exposição dos projetos pedagógicos e educacionais desenvolvidos pelos alunos do Senac.' }
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
                  onClick={() => handleAbrirDetalhes(oficina, oficina.areaNome, oficina.sala, horarioFormatado)}
                >
                  <span className="exposicao-card-title">{oficina.titulo}</span>
                  <div className="exposicao-card-area">
                     <Clock size={14} /> {horarioFormatado} | <MapPin size={14} /> {oficina.sala} ({oficina.areaNome})
                  </div>
                </div>
             )
          })}
        </div>
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
                      onClick={() => handleAbrirDetalhes(oficina, area.nome, area.sala, horarioFormatado)}
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
    </div>
  );
}
