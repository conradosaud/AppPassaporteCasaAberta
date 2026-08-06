import React from 'react';
import { X, MapPin, Clock, CheckCircle } from 'lucide-react';
import './Cronograma.css';

export default function ModalOficina({ oficina, onClose, onCheckout, isConcluida }) {
  if (!oficina) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <h2 className="modal-title">{oficina.titulo}</h2>
        
        <div className="modal-info">
          <div className="info-item">
            <Clock size={18} color="#666" />
            <span>{oficina.horarioFormatado}</span>
          </div>
          <div className="info-item">
            <MapPin size={18} color="#666" />
            <span>{oficina.sala}</span>
          </div>
        </div>
        
        <p className="modal-description">
          Aproveite esta atividade focada no desenvolvimento prático. 
          Lembre-se de fazer o checkout para registrar sua participação e atualizar o seu progresso no Casa Aberta!
        </p>

        <button 
          className={`btn-checkout ${isConcluida ? 'btn-checkout-concluida' : ''}`}
          onClick={() => {
            onCheckout(oficina);
          }}
          disabled={isConcluida}
        >
          {isConcluida ? (
            <>
              <CheckCircle size={20} />
              Participação Confirmada
            </>
          ) : (
            'Fazer Checkout (Marcar Participação)'
          )}
        </button>
      </div>
    </div>
  );
}
