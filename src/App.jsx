import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Relatorios from './Relatorios'
import DetalhesOficina from './pages/DetalhesOficina'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '20px' }}>
      <h2>Tela Inicial</h2>
      <p><a href="/relatorios">Ir para Relatórios</a></p>
      <p><a href="/detalhes">Ir para Detalhes da Oficina</a></p>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/relatorios" element={<Relatorios />} />
      <Route path="/detalhes" element={<DetalhesOficina />} />
    </Routes>
  )
}

export default App
