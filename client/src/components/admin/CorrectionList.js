import { useContext, useEffect, useState } from 'react';
import { AdminApi, Configuration } from '../../api';
import { AuthContext } from '../../contexts/AuthContext';
import LoadingSpinner from '../shared/LoadingSpinner';

const CorrectionList = () => {
    const [corrections, setCorrections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(AuthContext);

    const fetchCorrections = async () => {
        try {
            const config = new Configuration({ accessToken: token });
            const adminApi = new AdminApi(config);
            const response = await adminApi.getAllCorrections();
            setCorrections(response.data);
        } catch (err) {
            setError('Failed to fetch corrections.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCorrections();
        }
    }, [token]);

    const handleApprove = async (correctionId) => {
        try {
            const config = new Configuration({ accessToken: token });
            const adminApi = new AdminApi(config);
            await adminApi.approveCorrection({ id: correctionId });
            // Refresh the list after approval
            fetchCorrections();
        } catch (err) {
            console.error('Failed to approve correction:', err);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="bg-white shadow rounded-lg p-4 mt-4">
            <h3 className="text-lg font-semibold mb-2">All Corrections</h3>
            <ul className="divide-y divide-gray-200">
                {corrections.map(correction => (
                    <li key={correction._id} className="py-2">
                        <p><strong>ID:</strong> {correction._id}</p>
                        <p><strong>Task ID:</strong> {correction.task?._id}</p>
                        <p><strong>User ID:</strong> {correction.user?._id}</p>
                        <p><strong>Status:</strong> {correction.status}</p>
                        <p><strong>Corrected Transcript:</strong> {correction.correctedData.transcript}</p>
                        {correction.status === 'pending' && (
                            <button 
                                onClick={() => handleApprove(correction._id)}
                                className="mt-2 bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
                            >
                                Approve
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CorrectionList;
