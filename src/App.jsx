import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { salvarUsuario } from './supabase.js';
import Cronograma from './components/Cronograma/Cronograma';
import Relatorios from './Relatorios';
import DetalhesOficina from './pages/DetalhesOficina';
import './App.css';

function Home() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(null);

  useEffect(() => {
    // Check if user is already registered
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  const getPeriod = () => {
    const hour = new Date().getHours();
    if (hour >= 8 && hour < 12) return 'Manhã';
    if (hour >= 12 && hour < 18) return 'Tarde';
    return 'Noite';
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || isFirstTime === null) return;

    const data = {
      fullName: fullName.trim(),
      isFirstTime: isFirstTime === 'yes',
      registeredAt: new Date().toISOString(),
      period: getPeriod()
    };

    localStorage.setItem('userData', JSON.stringify(data));
    setUserData(data);

    try {
      await salvarUsuario(data);
    } catch (err) {
      console.error('Erro ao salvar no Supabase:', err);
      alert('Erro ao salvar dados. Você está sendo redirecionado');
    } finally {
      navigate('/cronograma');
    }
  };

  const isFormValid = fullName.trim().length > 0 && isFirstTime !== null;

  return (
    <div className="app-container">

      {!userData ? (
        <div className="modal-overlay">
          <form className="glass-modal" onSubmit={handleRegister}>

            <div className="header">
              {/* <h1 className="title">CASA ABERTA SENAC</h1> */}
              <img className="title" src="casaabertasenac.png" alt="" />
              <p className="subtitle">Bem-vindo(a) ao passaporte virtual do evento!</p>
            </div>

            <div className="form-group">
              <label htmlFor="fullName">Nome Completo</label>
              <input
                type="text"
                id="fullName"
                className="input-text"
                placeholder="Digite seu nome..."
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>É sua primeira vez aqui?</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="firstTime"
                    value="yes"
                    checked={isFirstTime === 'yes'}
                    onChange={(e) => setIsFirstTime(e.target.value)}
                  />
                  Sim
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="firstTime"
                    value="no"
                    checked={isFirstTime === 'no'}
                    onChange={(e) => setIsFirstTime(e.target.value)}
                  />
                  Não
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={!isFormValid}
            >
              Começar
            </button>
            <img src="/Senac_logo.svg" className="senac-logo-bg" alt="Logo Senac" />
          </form>
        </div>
      ) : (
        <div className="welcome-user">
          <h2>Olá, {userData.fullName}!</h2>
          <p>Seu passaporte está pronto para ser usado.</p>
          <a href="/cronograma" className="submit-btn" >Ver Cronograma</a>
          {/* O usuário não pode fazer log-off. Futuramente haverá botão para o cronograma aqui */}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cronograma" element={<Cronograma />} />
      <Route path="/relatorios" element={<Relatorios />} />
      <Route path="/detalhes" element={<DetalhesOficina />} />
    </Routes>
  );
}

export default App;
