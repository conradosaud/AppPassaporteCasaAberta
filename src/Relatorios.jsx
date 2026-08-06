import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import './Relatorios.css';
import { mockData } from './mockData';

const Relatorios = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulando uma requisição de API com atraso
    setTimeout(() => {
      setData(mockData);
    }, 500);
  }, []);

  if (!data) {
    return <div className="loading">Carregando relatórios...</div>;
  }



  const getVisitasPorOficinaOption = () => ({
    title: { text: 'Visitas por oficina' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: data.visitasPorOficina.oficinas },
    series: [{ data: data.visitasPorOficina.visitas, type: 'bar', itemStyle: { color: '#f59e0b' } }]
  });

  const getPeriodoMaisVisitasOption = () => ({
    title: { text: 'Período de maior visita por oficina' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['Manhã', 'Tarde', 'Noite'], top: '30px' },
    xAxis: { type: 'category', data: data.periodoMaisVisitasOficina.oficinas },
    yAxis: { type: 'value' },
    series: [
      { name: 'Manhã', type: 'bar', data: data.periodoMaisVisitasOficina.manha },
      { name: 'Tarde', type: 'bar', data: data.periodoMaisVisitasOficina.tarde },
      { name: 'Noite', type: 'bar', data: data.periodoMaisVisitasOficina.noite }
    ]
  });

  const getTop10Option = () => ({
    title: { text: 'Top 10 Oficinas com mais visitas' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: data.top10Oficinas.oficinas.slice().reverse() },
    series: [{ data: data.top10Oficinas.visitas.slice().reverse(), type: 'bar', itemStyle: { color: '#8b5cf6' } }]
  });



  const getMediaConcluidasOption = () => ({
    title: { text: 'Média de oficinas concluídas por usuário' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: data.mediaOficinasConcluidasHistograma.quantidadeConcluida },
    yAxis: { type: 'value' },
    series: [{ data: data.mediaOficinasConcluidasHistograma.quantidadeUsuarios, type: 'bar', itemStyle: { color: '#ec4899' } }]
  });

  const getUsuariosPorPeriodoOption = () => ({
    title: { text: 'Usuários por período', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{ type: 'pie', data: data.usuariosPorPeriodoPizza }]
  });

  const getNovosVsRecorrentesOption = () => ({
    title: { text: 'Novos visitantes vs Recorrentes', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{ type: 'pie', data: data.usuariosNovosVsRecorrentes }]
  });

  return (
    <div className="relatorios-container">
      <header className="relatorios-header">
        <h1>Dashboard Administrativo</h1>
      </header>

      <div className="kpis-grid">
        <div className="kpi-card">
          <h3>Cadastrados Hoje</h3>
          <p>{data.kpis.visitantesCadastradosHoje}</p>
        </div>
        <div className="kpi-card">
          <h3>Total de Oficinas</h3>
          <p>{data.kpis.totalOficinas}</p>
        </div>
        <div className="kpi-card">
          <h3>Total de Visitas</h3>
          <p>{data.kpis.totalVisitas}</p>
        </div>
        <div className="kpi-card">
          <h3>Oficinas/Usuário</h3>
          <p>{data.kpis.mediaOficinasConcluidas}</p>
        </div>
        <div className="kpi-card">
          <h3>Oficina + Visitada</h3>
          <p>{data.kpis.oficinaMaisVisitada}</p>
        </div>
        <div className="kpi-card">
          <h3>Período de Pico</h3>
          <p>{data.kpis.periodoMaiorMovimento}</p>
        </div>
        <div className="kpi-card">
          <h3>1ª Viagem</h3>
          <p>{data.kpis.percentualPrimeiraViagem}</p>
        </div>
        <div className="kpi-card">
          <h3>Recorrentes</h3>
          <p>{data.kpis.percentualRecorrentes}</p>
        </div>
      </div>

      <div className="charts-grid desktop-grid">
        <div className="chart-card"><ReactECharts option={getVisitasPorOficinaOption()} notMerge={true} style={{height: '350px'}} /></div>
        <div className="chart-card"><ReactECharts option={getPeriodoMaisVisitasOption()} notMerge={true} style={{height: '350px'}} /></div>
        <div className="chart-card"><ReactECharts option={getTop10Option()} notMerge={true} style={{height: '350px'}} /></div>
        <div className="chart-card"><ReactECharts option={getMediaConcluidasOption()} notMerge={true} style={{height: '350px'}} /></div>
        <div className="chart-card"><ReactECharts option={getUsuariosPorPeriodoOption()} notMerge={true} style={{height: '350px'}} /></div>
        <div className="chart-card"><ReactECharts option={getNovosVsRecorrentesOption()} notMerge={true} style={{height: '350px'}} /></div>
      </div>
    </div>
  );
};

export default Relatorios;
