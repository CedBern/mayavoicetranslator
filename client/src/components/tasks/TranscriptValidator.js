import { useContext, useState } from 'react';
import { Configuration, CorrectionsApi } from '../../api';
import { AuthContext } from '../../contexts/AuthContext';

const TranscriptValidator = ({ task }) => {
  const [transcript, setTranscript] = useState(task.data.existingTranscript || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Vous devez être connecté pour soumettre une correction.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const config = new Configuration({ accessToken: token });
      const correctionsApi = new CorrectionsApi(config);
      
      await correctionsApi.createCorrection({ 
        createCorrectionRequest: {
          taskId: task._id,
          correctedData: {
            transcript: transcript
          }
        }
      });

      setSuccess(true);
    } catch (err) {
      setError('Échec de la soumission de la correction. Veuillez réessayer.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Valider la transcription</h2>
      
      <div className="mb-6">
        <h3 className="font-semibold">Audio</h3>
        <audio src={task.data.audioUrl} controls className="w-full mt-2" />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="transcript" className="block text-sm font-medium text-gray-700 mb-2">Transcription</label>
          <textarea
            id="transcript"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            rows={10}
            disabled={isSubmitting}
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">Correction soumise avec succès !</p>}

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Soumission...' : 'Soumettre la correction'}
        </button>
      </form>
    </div>
  );
};

export default TranscriptValidator;
