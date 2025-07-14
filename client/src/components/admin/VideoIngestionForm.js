import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';

const VideoIngestionForm = () => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { token } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        if (!url) {
            setError('Please enter a YouTube URL.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.post('/ingestion/youtube', { url }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(response.data.message || 'Video processing initiated successfully. A new task will be created shortly.');
            setUrl('');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred during video ingestion.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Ingest YouTube Video</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700">
                        YouTube Video URL
                    </label>
                    <input
                        type="url"
                        id="youtube-url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="https://www.youtube.com/watch?v=..."
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isLoading ? <LoadingSpinner /> : 'Submit for Processing'}
                    </button>
                </div>
            </form>
            {message && <p className="mt-4 text-green-600">{message}</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
    );
};

export default VideoIngestionForm;
