import React from 'react';
import { Sun, Sunset, Moon } from 'lucide-react';
import './Cronograma.css';

export default function RodapePeriodos() {
  const periodos = [
    {
      nome: 'MANHÃ',
      horas: '6h às 13h',
      icone: <Sun size={24} />,
      cor: '#FFC107'
    },
    {
      nome: 'TARDE',
      horas: '13h às 19h',
      icone: <Sunset size={24} />,
      cor: '#FF8C00'
    },
    {
      nome: 'NOITE',
      horas: '19h às 23h',
      icone: <Moon size={24} />,
      cor: '#003366'
    }
  ];

  return (
    <div>
      <div className="rodape-divisor" />
      <div className="rodape-periodos">
        {periodos.map(per => (
          <div key={per.nome} className="rodape-bloco">
            <div className="rodape-icone" style={{ backgroundColor: per.cor }}>
              {per.icone}
            </div>
            <div className="rodape-info">
              <span className="rodape-nome">{per.nome}</span>
              <span className="rodape-horas">{per.horas}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
