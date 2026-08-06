import React from 'react';
import { Info } from 'lucide-react';
import './Cronograma.css';

export default function SeletorPeriodo({ periodoAtivo, setPeriodoAtivo }) {
  const tabs = ['Manhã', 'Tarde', 'Noite', 'Exposição'];

  return (
    <div className="seletor-container">
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
      <div className="aviso-destaque">
        <Info size={20} color="#0073B7" style={{ minWidth: 20 }} />
        <span>Escolha uma oficina no horário desejado e participe!</span>
      </div>
    </div>
  );
}
