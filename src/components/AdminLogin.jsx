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

    // El usuario es 'admin', y validamos contra Sheets para ver si la contraseña es correcta
    if (username.toLowerCase().trim() !== 'admin') {
      setError('Usuario o contraseña incorrectos.');
      return;
    }

    setLoading(true);
    try {
      
      // Intentamos consultar los registros usando la contraseña
      // Si la contraseña es inválida, esta llamada lanzará un error que capturamos en el catch
      await getRequestsFromSheets(password);
      
      // Si pasa la consulta con éxito, la contraseña es correcta!
      onLoginSuccess(password);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Contraseña incorrecta o error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 animate-fade-in">
      <div className="glass-panel p-8 shadow-2xl relative overflow-hidden" style={{ background: 'rgba(13, 21, 39, 0.75)' }}>
        {/* Adorno decorativo de luz de fondo */}
        <div 
          className="absolute -top-24 -left-24 w-48 h-48 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0, 242, 254, 0.15) 0%, transparent 70%)', filter: 'blur(20px)' }}
        />

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex p-3 bg-teal-accent/10 rounded-full border border-teal-accent/20 text-teal-accent mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-wider mb-2">
            Acceso Administrativo
          </h2>
          <p className="text-xs text-gray-400">
            Ingresa tu usuario y contraseña para ver las solicitudes.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger flex items-center gap-2 text-xs py-2.5 px-3 mb-5" style={{ margin: '0 0 1.25rem 0' }}>
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          {/* Usuario */}
          <div className="form-group text-left">
            <label className="form-label text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">
              Usuario
            </label>
            <div className="flex items-center gap-2 bg-black/20 rounded-lg px-3 py-2 border border-white/5 focus-within:border-teal-accent transition-colors">
              <User size={16} className="text-gray-500" />
              <input 
                type="text" 
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full text-sm text-gray-200"
                style={{ border: 'none', background: 'transparent', padding: '0.15rem 0', outline: 'none' }}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="form-group text-left">
            <label className="form-label text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">
              Contraseña
            </label>
            <div className="flex items-center gap-2 bg-black/20 rounded-lg px-3 py-2 border border-white/5 focus-within:border-teal-accent transition-colors">
              <Lock size={16} className="text-gray-500" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full text-sm text-gray-200"
                style={{ border: 'none', background: 'transparent', padding: '0.15rem 0', outline: 'none' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-gray-300"
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="btn btn-secondary w-1/2 py-2.5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-1/2 py-2.5 flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Validando...</span>
                </>
              ) : (
                <span>Ingresar</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
