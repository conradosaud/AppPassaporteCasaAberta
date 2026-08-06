import { Routes, Route, Link } from 'react-router-dom'
import Cronograma from './components/Cronograma/Cronograma'
import Relatorios from './Relatorios'
import DetalhesOficina from './pages/DetalhesOficina'
import './App.css'

function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Casa Aberta - Senac</h1>
      <p>Bem-vindo ao app Passaporte Casa Aberta!</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <Link to="/cronograma">
          <button style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#FF8C00', color: 'white', border: 'none', borderRadius: '8px', width: '220px' }}>
            📅 Ver Programação
          </button>
        </Link>
        <Link to="/relatorios">
          <button style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '8px', width: '220px' }}>
            📊 Relatórios
          </button>
        </Link>
        <Link to="/detalhes">
          <button style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#009C5B', color: 'white', border: 'none', borderRadius: '8px', width: '220px' }}>
            🔍 Detalhes da Oficina
          </button>
        </Link>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cronograma" element={<Cronograma />} />
      <Route path="/relatorios" element={<Relatorios />} />
      <Route path="/detalhes" element={<DetalhesOficina />} />
    </Routes>
  )
}

export default App
