import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { supabase } from './supabase';
import BarRaceChart from './components/BarRaceChart';
import {
  Users,
  UserPlus,
  GraduationCap,
  BookOpen,
  Footprints,
  TrendingUp,
  Award,
  Clock3,
  Navigation,
  Repeat,
  LayoutDashboard,
  MoreHorizontal,
  BarChart3,
  PieChart,
  ChartColumnIncreasing,
  Trophy,
  RefreshCw
} from 'lucide-react';
import './Relatorios.css';
const Relatorios = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [avalResponse, usrResponse, ofResponse] = await Promise.all([
          supabase.from('avaliacao').select('*'),
          supabase.from('usuarios').select('*'),
          fetch('/oficinas.json')
        ]);

        if (avalResponse.error || usrResponse.error) {
          console.error('Error fetching data:', avalResponse.error || usrResponse.error);
        }

        const validAvaliacoes = avalResponse.data || [];
        const validUsuarios = usrResponse.data || [];
        const oficinasArray = await ofResponse.json();

        // Processing Avaliações (Oficinas)
        const totalVisitas = validAvaliacoes.length;
        const oficinasSet = new Set();
        const visitasPorOficinaMap = {};
        oficinasArray.forEach(oficina => {
          visitasPorOficinaMap[oficina.titulo] = 0;
        });
        const periodoMaisVisitasOficinaMap = {}; // { oficina: { manha, tarde, noite } }
        const periodosAvaliacao = { manha: 0, tarde: 0, noite: 0 };

        validAvaliacoes.forEach(av => {
          if (av.oficina_nome) {
            oficinasSet.add(av.oficina_nome);
            visitasPorOficinaMap[av.oficina_nome] = (visitasPorOficinaMap[av.oficina_nome] || 0) + 1;

            if (!periodoMaisVisitasOficinaMap[av.oficina_nome]) {
              periodoMaisVisitasOficinaMap[av.oficina_nome] = { manha: 0, tarde: 0, noite: 0 };
            }
          }

          if (av.created_at) {
            const date = new Date(av.created_at);
            const hour = date.getHours();
            let periodoStr = 'noite';
            if (hour >= 6 && hour < 12) periodoStr = 'manha';
            else if (hour >= 12 && hour < 18) periodoStr = 'tarde';

            periodosAvaliacao[periodoStr]++;
            if (av.oficina_nome) {
              periodoMaisVisitasOficinaMap[av.oficina_nome][periodoStr]++;
            }
          }
        });

        const totalOficinas = oficinasArray.length || 0;

        let oficinaMaisVisitada = "-";
        let maxVisitas = 0;
        for (const [oficina, count] of Object.entries(visitasPorOficinaMap)) {
          if (count > maxVisitas) {
            maxVisitas = count;
            oficinaMaisVisitada = `${oficina} (${maxVisitas})`;
          }
        }

        let periodoMaiorMovimento = "Tarde";
        let maxPeriodo = 0;
        if (periodosAvaliacao.manha > maxPeriodo) { maxPeriodo = periodosAvaliacao.manha; periodoMaiorMovimento = "Manhã"; }
        if (periodosAvaliacao.tarde > maxPeriodo) { maxPeriodo = periodosAvaliacao.tarde; periodoMaiorMovimento = "Tarde"; }
        if (periodosAvaliacao.noite > maxPeriodo) { maxPeriodo = periodosAvaliacao.noite; periodoMaiorMovimento = "Noite"; }

        // Processing Usuários (Visitantes)
        const totalUsers = validUsuarios.length;
        let usersPrimeiraViagem = 0;
        let usersRecorrentes = 0;
        const periodosUsuarios = { Manhã: 0, Tarde: 0, Noite: 0 };

        validUsuarios.forEach(usr => {
          // Novos vs Recorrentes
          if (usr.primeiraVez === true) {
            usersPrimeiraViagem++;
          } else {
            usersRecorrentes++;
          }

          // Período do Usuário
          if (usr.periodo && periodosUsuarios[usr.periodo] !== undefined) {
            periodosUsuarios[usr.periodo]++;
          }
        });

        const mediaOficinasConcluidas = totalUsers > 0 ? (totalVisitas / totalUsers).toFixed(1) : 0;
        const pctPrimeira = totalUsers > 0 ? Math.round((usersPrimeiraViagem / totalUsers) * 100) + '%' : '0%';
        const pctRecorrente = totalUsers > 0 ? Math.round((usersRecorrentes / totalUsers) * 100) + '%' : '0%';

        // Histograma provisório: como não cruzamos exatamente usuario <-> avaliacao (pois nome_user na avaliacao pode ser igual),
        // Vamos manter o mapa de avaliacoes por nome_user apenas para o histograma de oficinas concluídas.
        const userVisitasMap = {};
        validAvaliacoes.forEach(av => {
          if (av.nome_user) {
            userVisitasMap[av.nome_user] = (userVisitasMap[av.nome_user] || 0) + 1;
          }
        });
        const histMap = {}; // { '1': count, '2': count, ..., '6+': count }
        for (const count of Object.values(userVisitasMap)) {
          const key = count >= 6 ? '6+' : String(count);
          histMap[key] = (histMap[key] || 0) + 1;
        }

        // Chart Data prep
        const sortedVisitasEntries = Object.entries(visitasPorOficinaMap).sort((a, b) => b[1] - a[1]);
        const oficinasList = sortedVisitasEntries.map(e => e[0]);
        const visitasList = sortedVisitasEntries.map(e => e[1]);

        const top10 = oficinasList.slice(0, 10);

        const histKeys = ['1', '2', '3', '4', '5', '6+'];
        const histValues = histKeys.map(k => histMap[k] || 0);

        const newChartData = {
          kpis: {
            visitantesCadastradosHoje: totalUsers,
            totalOficinas: totalOficinas,
            totalVisitas: totalVisitas,
            mediaOficinasConcluidas: mediaOficinasConcluidas,
            oficinaMaisVisitada: oficinaMaisVisitada,
            periodoMaiorMovimento: periodoMaiorMovimento,
            percentualPrimeiraViagem: pctPrimeira,
            percentualRecorrentes: pctRecorrente
          },
          visitasPorOficina: {
            oficinas: oficinasList,
            visitas: visitasList
          },
          periodoMaisVisitasOficina: {
            oficinas: oficinasList,
            manha: oficinasList.map(o => periodoMaisVisitasOficinaMap[o] ? periodoMaisVisitasOficinaMap[o].manha : 0),
            tarde: oficinasList.map(o => periodoMaisVisitasOficinaMap[o] ? periodoMaisVisitasOficinaMap[o].tarde : 0),
            noite: oficinasList.map(o => periodoMaisVisitasOficinaMap[o] ? periodoMaisVisitasOficinaMap[o].noite : 0)
          },
          top10Oficinas: {
            oficinas: top10,
            visitas: top10.map(o => visitasPorOficinaMap[o])
          },
          mediaOficinasConcluidasHistograma: {
            quantidadeConcluida: histKeys,
            quantidadeUsuarios: histValues
          },
          usuariosPorPeriodoPizza: [
            { value: periodosUsuarios['Manhã'] || 0, name: 'Manhã' },
            { value: periodosUsuarios['Tarde'] || 0, name: 'Tarde' },
            { value: periodosUsuarios['Noite'] || 0, name: 'Noite' }
          ],
          usuariosNovosVsRecorrentes: [
            { value: usersPrimeiraViagem, name: 'Primeira visita' },
            { value: usersRecorrentes, name: 'Visitante recorrente' }
          ]
        };

        setData(newChartData);

      } catch (e) {
        console.error("Exception fetching data", e);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div className="loading">Carregando relatórios...</div>;
  }

  const getVisitasPorOficinaOption = () => ({
    title: { show: false },
    maintainAspectRatio: false,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: data.visitasPorOficina.oficinas, axisLabel: { width: 100, overflow: 'truncate' } },
    series: [{ data: data.visitasPorOficina.visitas, type: 'bar', itemStyle: { color: '#f59e0b' } }]
  });

  const getPeriodoMaisVisitasOption = () => ({
    title: { show: false },
    maintainAspectRatio: false,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['Manhã', 'Tarde', 'Noite'], top: '30px' },
    xAxis: { type: 'category', data: data.periodoMaisVisitasOficina.oficinas, axisLabel: { width: 80, overflow: 'truncate' }, max: 50 },
    yAxis: { type: 'value' },
    series: [
      { name: 'Manhã', type: 'bar', data: data.periodoMaisVisitasOficina.manha },
      { name: 'Tarde', type: 'bar', data: data.periodoMaisVisitasOficina.tarde },
      { name: 'Noite', type: 'bar', data: data.periodoMaisVisitasOficina.noite }
    ]
  });

  const getTop10Option = () => ({
    title: { show: false },
    maintainAspectRatio: false,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: data.top10Oficinas.oficinas.slice().reverse(), axisLabel: { width: 100, overflow: 'truncate' } },
    series: [{ data: data.top10Oficinas.visitas.slice().reverse(), type: 'bar', itemStyle: { color: '#8b5cf6' } }]
  });

  const getMediaConcluidasOption = () => ({
    title: { show: false },
    maintainAspectRatio: false,
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: data.mediaOficinasConcluidasHistograma.quantidadeConcluida },
    yAxis: { type: 'value' },
    series: [{ data: data.mediaOficinasConcluidasHistograma.quantidadeUsuarios, type: 'bar', itemStyle: { color: '#ec4899' } }]
  });

  const getUsuariosPorPeriodoOption = () => ({
    title: { show: false },
    maintainAspectRatio: false,
    tooltip: { trigger: 'item' },
    series: [{ type: 'pie', data: data.usuariosPorPeriodoPizza }]
  });

  const getNovosVsRecorrentesOption = () => ({
    title: { show: false },
    maintainAspectRatio: false,
    tooltip: { trigger: 'item' },
    series: [{ type: 'pie', data: data.usuariosNovosVsRecorrentes }]
  });

  return (
    <div className="relatorios-container">
      <header className="relatorios-header">
        <LayoutDashboard className="header-icon" size={32} />
        <h1>Dashboard Administrativo</h1>
      </header>

      <div className="kpis-grid">
        <div className="kpi-card">
          <div className="card-header">
            <div className="kpi-icon-bg users"><UserPlus className="kpi-icon" size={28} /></div>
            <h3>Cadastrados</h3>
            <MoreHorizontal className="card-menu" size={20} />
          </div>
          <p>{data.kpis.visitantesCadastradosHoje}</p>
        </div>
        <div className="kpi-card">
          <div className="card-header">
            <div className="kpi-icon-bg offices"><GraduationCap className="kpi-icon" size={28} /></div>
            <h3>Total de Oficinas</h3>
            <MoreHorizontal className="card-menu" size={20} />
          </div>
          <p>{data.kpis.totalOficinas}</p>
        </div>
        <div className="kpi-card">
          <div className="card-header">
            <div className="kpi-icon-bg visits"><Footprints className="kpi-icon" size={28} /></div>
            <h3>Total de Avaliações</h3>
            <MoreHorizontal className="card-menu" size={20} />
          </div>
          <p>{data.kpis.totalVisitas}</p>
        </div>
        <div className="kpi-card">
          <div className="card-header">
            <div className="kpi-icon-bg highlight"><Award className="kpi-icon" size={28} /></div>
            <h3>Oficina Mais Visitada</h3>
            <MoreHorizontal className="card-menu" size={20} />
          </div>
          <p>{data.kpis.oficinaMaisVisitada}</p>
        </div>
        <div className="kpi-card">
          <div className="card-header">
            <div className="kpi-icon-bg metrics"><Clock3 className="kpi-icon" size={28} /></div>
            <h3>Período de Pico</h3>
            <MoreHorizontal className="card-menu" size={20} />
          </div>
          <p>{data.kpis.periodoMaiorMovimento}</p>
        </div>
      </div>

      <div className="charts-grid desktop-grid">
        <div className="chart-card">
          <div className="chart-header">
            <BarChart3 className="chart-icon" size={20} />
            <span className="chart-title">Top 10 oficinas</span>
            <MoreHorizontal className="chart-menu" size={20} />
          </div>
          <ReactECharts option={getTop10Option()} notMerge={true} style={{ height: '350px' }} />
        </div>
        <div className="chart-card">
          <div className="chart-header">
            <ChartColumnIncreasing className="chart-icon" size={20} />
            <span className="chart-title">Usuários por período</span>
            <MoreHorizontal className="chart-menu" size={20} />
          </div>
          <ReactECharts option={getUsuariosPorPeriodoOption()} notMerge={true} style={{ height: '350px' }} />
        </div>
        <div className="chart-card">
          <div className="chart-header">
            <PieChart className="chart-icon" size={20} />
            <span className="chart-title">Novos vs Recorrentes</span>
            <MoreHorizontal className="chart-menu" size={20} />
          </div>
          <ReactECharts option={getNovosVsRecorrentesOption()} notMerge={true} style={{ height: '350px' }} />
        </div>
        <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
          <div className="chart-header">
            <BarChart3 className="chart-icon" size={20} />
            <span className="chart-title">Visitas por oficina</span>
            <MoreHorizontal className="chart-menu" size={20} />
          </div>
          <BarRaceChart
            oficinas={data.visitasPorOficina.oficinas.slice().reverse()}
            visitas={data.visitasPorOficina.visitas.slice().reverse()}
            duration={1000}
            steps={20}
          />
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
