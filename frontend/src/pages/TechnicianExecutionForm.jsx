import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { submitExecution, ApiError } from '../services/api.js';

const ERROR_MESSAGES = {
  400: 'Faltan fotos o las notas están vacías.',
  403: 'Esta orden no está asignada a tu usuario.',
  409: 'La orden ya no admite un nuevo envío de ejecución.',
  415: 'Alguno de los archivos no es una imagen válida (jpg/png/heic).',
  502: 'El almacenamiento de fotos no está disponible. Intenta de nuevo.',
  503: 'Servicio no disponible. Intenta de nuevo en unos minutos.',
  504: 'La subida de fotos tardó demasiado. Intenta de nuevo.',
};

export default function TechnicianExecutionForm() {
  const { orderId: orderIdParam } = useParams();
  const [orderId, setOrderId] = useState(orderIdParam || '');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState([]);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setMessage(null);
    try {
      const result = await submitExecution(orderId, { notes, photos });
      setStatus('done');
      setMessage(`Ejecución registrada (id: ${result.id}).`);
    } catch (err) {
      setStatus('error');
      if (err instanceof ApiError) {
        setMessage(ERROR_MESSAGES[err.status] || err.message);
      } else {
        setMessage('Error inesperado.');
      }
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 p-6">
      <h2 className="text-2xl font-semibold text-slate-800">Registrar ejecución</h2>
      <form onSubmit={handleSubmit} className="space-y-3 rounded-lg bg-white p-4 shadow-sm">
        <label className="block text-sm text-slate-600">
          Orden ID
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm text-slate-600">
          Notas
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm text-slate-600">
          Fotos de evidencia (≥1)
          <input
            type="file"
            accept="image/jpeg,image/png,image/heic"
            multiple
            onChange={(e) => setPhotos(Array.from(e.target.files))}
            required
            className="mt-1 w-full text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Enviar ejecución
        </button>
      </form>
      {message && (
        <p role="status" className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">
          {message}
        </p>
      )}
    </div>
  );
}
