import React, { useState, useEffect } from 'react';
import { getRequestsFromSheets } from '../services/api/sheetsApi';
import { formPayloadInverseAdapter } from '../services/adapters/formPayloadInverseAdapter';
import { Search, Edit2, Plus, RefreshCw, AlertCircle, FileText, Calendar, User } from 'lucide-react';

export default function RequestsListPage({ onEditRequest, onCreateNew }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRequests = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    setError(null);
    try {
      const data = await getRequestsFromSheets();
      if (Array.isArray(data)) {
        setRequests(data);
      } else {
        throw new Error("El formato de respuesta de solicitudes es inválido");
      }
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las solicitudes. Verifica tu conexión o el URL del Google Sheets API.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleEdit = (record) => {
    // Adaptar los cabeceros en español de la hoja a las keys camelCase del frontend
    const adaptedData = formPayloadInverseAdapter(record);
    // Propagar al componente padre
    onEditRequest(record.rowId, adaptedData);
  };

  // Invertir lista para mostrar las más recientes primero
  const reversedRequests = [...requests].reverse();

  // Filtrar solicitudes por Nombre o RFC
  const filtered = reversedRequests.filter((req) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const nombre = `${req["Nombre(s) acreditado"] || ''} ${req["Apellido Paterno acreditado"] || ''} ${req["Apellido Materno acreditado"] || ''}`.toLowerCase();
    const rfc = (req["RFC"] || '').toLowerCase();
    
    return nombre.includes(term) || rfc.includes(term);
  });

  // Mostrar solo las últimas 5 por defecto si no hay término de búsqueda
  const displayedRequests = searchTerm ? filtered : filtered.slice(0, 5);

  return (
    <div className="requests-list-container animate-fade-in py-4">
      {/* Header de la vista */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="step-title flex items-center gap-2">
            <FileText className="text-teal-accent" />
            Solicitudes Capturadas
          </h2>
          <p className="step-description">
            Consulta, busca y edita solicitudes registradas en Google Sheets.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            type="button" 
            onClick={() => fetchRequests(true)} 
            disabled={loading || isRefreshing}
            className="btn btn-secondary flex items-center gap-1.5 px-3 py-2"
            title="Refrescar lista"
            style={{ height: '42px' }}
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin text-teal-accent" : ""} />
            <span style={{ fontSize: '0.85rem' }}>Actualizar</span>
          </button>
          <button 
            type="button" 
            onClick={onCreateNew} 
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={18} /> Nueva Solicitud
          </button>
        </div>
      </div>

      {/* Barra de Búsqueda */}
      <div className="glass-panel p-4 mb-6 flex items-center gap-3">
        <Search className="text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por nombre, RFC, CURP o correo..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
          style={{ flexGrow: 1, border: 'none', background: 'transparent', padding: '0.25rem 0' }}
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')} 
            className="text-xs text-gray-400 hover:text-white"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Manejo de errores */}
      {error && (
        <div className="alert alert-danger flex items-center gap-3">
          <AlertCircle size={24} />
          <div>{error}</div>
        </div>
      )}

      {/* Contenido / Listado */}
      {loading ? (
        <div className="glass-panel p-12 text-center">
          <RefreshCw className="animate-spin text-teal-accent mx-auto mb-4" size={32} />
          <p className="text-gray-400">Consultando registros en Google Sheets...</p>
        </div>
      ) : displayedRequests.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <FileText className="text-gray-500 mx-auto mb-4" size={48} />
          <h3 className="text-lg font-semibold mb-2">No se encontraron solicitudes</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm ? "Ningún registro coincide con el término de búsqueda." : "Aún no hay solicitudes registradas en la hoja de cálculo."}
          </p>
          {!searchTerm && (
            <button onClick={onCreateNew} className="btn btn-primary">
              Capturar Primera Solicitud
            </button>
          )}
        </div>
      ) : (
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" style={{ width: '100%' }}>
              <thead>
                <tr className="border-b" style={{ background: 'rgba(0, 0, 0, 0.25)' }}>
                  <th className="p-4 text-xs font-bold text-teal-accent uppercase tracking-wider">Fecha / Folio</th>
                  <th className="p-4 text-xs font-bold text-teal-accent uppercase tracking-wider">Acreditado</th>
                  <th className="p-4 text-xs font-bold text-teal-accent uppercase tracking-wider">Identificadores</th>
                  <th className="p-4 text-xs font-bold text-teal-accent uppercase tracking-wider">Contacto</th>
                  <th className="p-4 text-xs font-bold text-teal-accent uppercase tracking-wider text-center" style={{ width: '100px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {displayedRequests.map((req, idx) => {
                  const nombreCompleto = `${req["Nombre(s) acreditado"] || ''} ${req["Apellido Paterno acreditado"] || ''} ${req["Apellido Materno acreditado"] || ''}`;
                  const rfc = req["RFC"] || 'N/A';
                  const curp = req["CURP"] || 'N/A';
                  const email = req["Correo Electrónico"] || 'N/A';
                  const tel = req["Número Celular"] || 'N/A';
                  const rawTimestamp = req["Timestamp"] || req["Marca temporal"] || req["Marca Temporal"];
                  let timestamp = 'Sin fecha';
                  if (rawTimestamp) {
                    const str = String(rawTimestamp).trim();
                    if (str.includes('T')) {
                      timestamp = str.split('T')[0];
                    } else if (str.includes(' ')) {
                      timestamp = str.split(' ')[0];
                    } else {
                      timestamp = str;
                    }
                  }
                  
                  return (
                    <tr 
                      key={req.rowId || idx} 
                      className="border-b hover:bg-white/[0.02] transition-colors"
                      style={{ borderBottom: '1px solid var(--border-color)' }}
                    >
                      <td className="p-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="font-semibold text-gray-200">{timestamp}</span>
                        </div>
                        <span className="text-xs text-gray-500 block mt-1">Fila #{req.rowId}</span>
                      </td>
                      <td className="p-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-gray-400" />
                          <span className="font-semibold text-white">{nombreCompleto}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        <div>
                          <span className="text-xs text-gray-400 font-semibold block">RFC: <span className="font-mono text-gray-300">{rfc}</span></span>
                          <span className="text-xs text-gray-400 font-semibold block">CURP: <span className="font-mono text-gray-300">{curp}</span></span>
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        <div className="text-xs">
                          <span className="text-gray-300 block">{email}</span>
                          <span className="text-gray-400 block mt-1">{tel}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleEdit(req)}
                          className="btn btn-secondary flex items-center gap-1 py-1.5 px-3 mx-auto"
                          style={{ fontSize: '0.8rem' }}
                        >
                          <Edit2 size={12} className="text-teal-accent" />
                          Editar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t text-xs text-gray-500 text-right">
            {searchTerm ? (
              `Mostrando ${displayedRequests.length} resultados encontrados`
            ) : (
              `Mostrando las últimas 5 solicitudes de un total de ${requests.length} registros`
            )}
          </div>
        </div>
      )}
    </div>
  );
}
