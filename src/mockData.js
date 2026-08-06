export const mockData = {
  kpis: {
    visitantesCadastradosHoje: 120,
    totalOficinas: 45,
    totalVisitas: 850,
    mediaOficinasConcluidas: 3.5,
    oficinaMaisVisitada: "Robótica Avançada",
    periodoMaiorMovimento: "Tarde",
    percentualPrimeiraViagem: "70%",
    percentualRecorrentes: "30%"
  },
  
  cadastroPorDia: {
    dias: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
    quantidade: [50, 80, 150, 120, 90]
  },

  filtroPorPeriodo: {
    periodos: ['Manhã', 'Tarde', 'Noite'],
    quantidade: [250, 400, 200]
  },

  visitasPorOficina: {
    oficinas: ['Robótica', 'Programação', 'Design', 'Eletrônica', 'Mecânica'],
    visitas: [200, 150, 180, 100, 120]
  },

  periodoMaisVisitasOficina: {
    oficinas: ['Robótica', 'Programação', 'Design', 'Eletrônica', 'Mecânica'],
    manha: [50, 30, 40, 20, 30],
    tarde: [100, 80, 100, 50, 60],
    noite: [50, 40, 40, 30, 30]
  },

  top10Oficinas: {
    oficinas: ['Robótica Avançada', 'Introdução a IA', 'Modelagem 3D', 'Web Design', 'Arduino Basics', 'Fotografia', 'Culinária Maker', 'Costura Criativa', 'Marcenaria', 'Marketing Digital'],
    visitas: [250, 230, 210, 190, 180, 160, 150, 140, 120, 100]
  },

  mediaOficinasConcluidasHistograma: {
    quantidadeConcluida: ['1', '2', '3', '4', '5', '6+'],
    quantidadeUsuarios: [50, 100, 150, 80, 40, 20]
  },

  usuariosPorPeriodoPizza: [
    { value: 250, name: 'Manhã' },
    { value: 400, name: 'Tarde' },
    { value: 200, name: 'Noite' }
  ],

  usuariosNovosVsRecorrentes: [
    { value: 700, name: 'Primeira visita' },
    { value: 300, name: 'Visitante recorrente' }
  ]
};
