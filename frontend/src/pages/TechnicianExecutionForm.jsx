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
    <div>
      <h2>Registrar ejecución</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Orden ID
          <input value={orderId} onChange={(e) => setOrderId(e.target.value)} required />
        </label>
        <label>
          Notas
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} required />
        </label>
        <label>
          Fotos de evidencia (≥1)
          <input
            type="file"
            accept="image/jpeg,image/png,image/heic"
            multiple
            onChange={(e) => setPhotos(Array.from(e.target.files))}
            required
          />
        </label>
        <button type="submit" disabled={status === 'submitting'}>
          Enviar ejecución
        </button>
      </form>
      {message && <p role="status">{message}</p>}
    </div>
  );
}
