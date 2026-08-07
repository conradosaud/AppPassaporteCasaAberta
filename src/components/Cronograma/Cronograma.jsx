import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import SeletorPeriodo from './SeletorPeriodo';
import TabelaHorarios from './TabelaHorarios';
import LinhaTempoVertical from './LinhaTempoVertical';
import './Cronograma.css';

export default function Cronograma() {
  const [periodoAtivo, setPeriodoAtivo] = useState('Tarde');
  const [modoVisualizacao, setModoVisualizacao] = useState('grade');

  return (
    <div className="cronograma-container">
      <header className="cronograma-header">
        <div className="header-top">
          {/* Mock logo, se o SVG do senac existir colocar aqui */}
          <div style={{ backgroundColor: 'white', padding: '4px', borderRadius: '4px' }}>
             <span style={{color: '#003366', fontWeight: 'bold', fontSize: '14px'}}>Senac</span>
          </div>
          <h1 className="header-title">
            <span className="header-title-casa">Casa </span>
            <span className="header-title-aberta">Aberta</span>
          </h1>
        </div>
        <p className="header-subtitle">Um dia inteiro de aprendizado prático</p>
      </header>

      <main className="cronograma-body">
        <div className="section-title-container">
          <Calendar size={24} color="#003366" />
          <h2 className="section-title">Programação</h2>
        </div>
        <p className="section-subtitle">Veja os horários das oficinas</p>

        <SeletorPeriodo 
          periodoAtivo={periodoAtivo} 
          setPeriodoAtivo={setPeriodoAtivo}
          modoVisualizacao={modoVisualizacao}
          setModoVisualizacao={setModoVisualizacao}
        />
        
        {modoVisualizacao === 'grade' ? (
          <TabelaHorarios periodoAtivo={periodoAtivo} />
        ) : (
          <LinhaTempoVertical periodoAtivo={periodoAtivo} />
        )}
      </main>
    </div>
  );
}

