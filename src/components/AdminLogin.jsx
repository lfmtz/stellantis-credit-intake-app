import React, { useState } from 'react';
import { Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { getRequestsFromSheets } from '../services/api/sheetsApi';

export default function AdminLogin({ onLoginSuccess, onCancel }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (username.toLowerCase().trim() !== 'admin') {
      setError('Usuario o contraseña incorrectos.');
      return;
    }

    setLoading(true);
    try {
      await getRequestsFromSheets(password);
      onLoginSuccess(password);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Contraseña incorrecta o error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-4 flex flex-col justify-center items-center animate-fade-in" style={{ minHeight: '50vh' }}>
      <div className="glass-panel p-8 shadow-2xl relative overflow-hidden" style={{ width: '100%', maxWidth: '420px', background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        
        {/* Adorno decorativo de luz de fondo */}
        <div 
          style={{ 
            position: 'absolute',
            top: '-50px',
            left: '-50px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 242, 254, 0.1) 0%, transparent 70%)', 
            filter: 'blur(20px)',
            pointerEvents: 'none'
          }}
        />

        <div className="text-center mb-6 relative z-10">
          <div className="inline-flex p-3 bg-black/30 rounded-full border border-white/10 text-teal-accent mb-3">
            <Lock size={28} className="text-teal-accent" />
          </div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-1" style={{ fontSize: '1.2rem', color: '#ffffff' }}>
            Acceso Administrativo
          </h2>
          <p className="text-xs text-gray-400" style={{ color: 'var(--text-secondary)' }}>
            Ingresa tu usuario y contraseña para ver las solicitudes.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger flex items-center gap-2 text-xs py-2 px-3 mb-4" style={{ margin: '0 0 1rem 0' }}>
            <AlertCircle size={14} className="flex-shrink-0" />
            <span style={{ textAlign: 'left' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          {/* Usuario */}
          <div className="form-group text-left flex flex-col gap-1">
            <label className="form-label text-xs uppercase tracking-wider text-gray-400 font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
              Usuario
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type="text" 
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="form-control"
                style={{ width: '100%', color: '#ffffff', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.75rem 1rem' }}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="form-group text-left flex flex-col gap-1">
            <label className="form-label text-xs uppercase tracking-wider text-gray-400 font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
              Contraseña
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="form-control"
                style={{ width: '100%', paddingRight: '2.75rem', color: '#ffffff', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.75rem 1rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-200"
                style={{ 
                  position: 'absolute', 
                  right: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 mt-4" style={{ width: '100%' }}>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="btn btn-secondary"
              style={{ width: '50%', padding: '0.625rem 1.25rem' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '50%', padding: '0.625rem 1.25rem', color: '#000000' }}
            >
              {loading ? 'Validando...' : 'Ingresar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
