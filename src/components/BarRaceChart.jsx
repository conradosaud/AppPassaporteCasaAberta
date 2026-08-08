import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

/**
 * BarRaceChart
 *
 * Props:
 *  - oficinas: string[]   – lista com todos os títulos de oficina (na ordem final desejada)
 *  - visitas: number[]    – contagem final de avaliações de cada oficina (mesma ordem)
 *  - duration: number     – duração total da animação em ms (padrão 6000)
 *  - steps: number        – quantidade de frames (padrão 60)
 */
const BarRaceChart = ({ oficinas = [], visitas = [], duration = 6000, steps = 60 }) => {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || oficinas.length === 0) return;

    // Inicializa a instância do ECharts
    const chart = echarts.init(chartRef.current, null, { renderer: 'canvas' });
    instanceRef.current = chart;

    // Paleta de cores (rotaciona por índice original)
    const palette = [
      '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981',
      '#ef4444', '#f97316', '#06b6d4', '#ec4899',
      '#84cc16', '#a855f7', '#14b8a6', '#fb923c'
    ];

    // Ordem original das oficinas (para fixar a cor)
    const colorMap = {};
    oficinas.forEach((nome, i) => {
      colorMap[nome] = palette[i % palette.length];
    });

    // Configuração base
    const baseOption = {
      backgroundColor: 'transparent',
      grid: { top: 10, bottom: 30, left: 10, right: 90, containLabel: true },
      xAxis: {
        type: 'value',
        max: 'dataMax',
        axisLabel: { color: '#64748b', fontSize: 11 },
        splitLine: { lineStyle: { color: '#e2e8f0' } }
      },
      yAxis: {
        type: 'category',
        data: [],
        inverse: false,
        animationDuration: 300,
        animationDurationUpdate: 800,
        axisLabel: {
          color: '#334155',
          fontSize: 11,
          overflow: 'truncate',
          width: 180
        },
        inverse: true
      },
      series: [{
        realtimeSort: true,
        type: 'bar',
        data: [],
        label: {
          show: true,
          position: 'right',
          color: '#334155',
          fontSize: 11,
          formatter: val => val.value > 0 ? val.value : ''
        },
        itemStyle: {
          color: params => colorMap[params.name] || '#3b82f6',
          borderRadius: [0, 4, 4, 0]
        }
      }],
      animationDuration: 0,
      animationDurationUpdate: Math.floor(duration / steps),
      animationEasing: 'linear',
      animationEasingUpdate: 'linear'
    };

    chart.setOption(baseOption);

    // Gera frames: interpola de 0 até os valores finais
    const frameValues = Array.from({ length: steps + 1 }, (_, step) => {
      const pct = step / steps;
      return oficinas.map((_, i) => Math.round(visitas[i] * pct));
    });

    let currentStep = 0;

    const tick = () => {
      if (!instanceRef.current) return;

      const vals = frameValues[currentStep];

      // Cria array de { name, value } e ordena crescentemente (ECharts inverte para exibir maior no topo)
      const items = oficinas.map((nome, i) => ({ name: nome, value: vals[i] }));
      items.sort((a, b) => a.value - b.value);

      chart.setOption({
        yAxis: { data: items.map(d => d.name) },
        series: [{ data: items.map(d => ({ value: d.value, name: d.name })) }]
      });

      currentStep++;
      if (currentStep <= steps) {
        timerRef.current = setTimeout(tick, Math.floor(duration / steps));
      }
    };

    tick();

    // Responsividade
    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener('resize', handleResize);
      chart.dispose();
      instanceRef.current = null;
    };
  }, [oficinas, visitas, duration, steps]);

  return <div ref={chartRef} style={{ width: '100%', height: '900px' }} />;
};

export default BarRaceChart;
