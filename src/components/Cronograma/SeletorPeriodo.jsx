import React from 'react';
import { Info, LayoutGrid, List } from 'lucide-react';
import './Cronograma.css';

export default function SeletorPeriodo({ 
  periodoAtivo, 
  setPeriodoAtivo,
  modoVisualizacao = 'grade',
  setModoVisualizacao
}) {
  const tabs = ['Manhã', 'Tarde', 'Noite', 'Exposição'];

  return (
    <div className="seletor-container">
      <div className="seletor-top-row">
        <div className="seletor-tabs">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`seletor-tab ${periodoAtivo === tab ? 'active' : ''}`}
              onClick={() => setPeriodoAtivo(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {setModoVisualizacao && (
          <div className="modo-toggle-container">
            <button
              className={`modo-toggle-btn ${modoVisualizacao === 'grade' ? 'active' : ''}`}
              onClick={() => setModoVisualizacao('grade')}
              title="Visualização em Grade (Horizontal)"
            >
              <LayoutGrid size={18} />
              <span className="modo-toggle-label">Grade</span>
            </button>
            <button
              className={`modo-toggle-btn ${modoVisualizacao === 'timeline' ? 'active' : ''}`}
              onClick={() => setModoVisualizacao('timeline')}
              title="Visualização em Linha do Tempo (Vertical)"
            >
              <List size={18} />
              <span className="modo-toggle-label">Linha do Tempo</span>
            </button>
          </div>
        )}
      </div>

      <div className="aviso-destaque">
        <Info size={20} color="#0073B7" style={{ minWidth: 20 }} />
        <span>Escolha uma oficina no horário desejado e participe!</span>
      </div>
    </div>
  );
}

