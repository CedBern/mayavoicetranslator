import { useContext, useEffect, useState } from 'react';
import { AdminApi, Configuration } from '../../api';
import { AuthContext } from '../../contexts/AuthContext';
import LoadingSpinner from '../shared/LoadingSpinner';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const config = new Configuration({ accessToken: token });
                const adminApi = new AdminApi(config);
                const response = await adminApi.getAllTasks();
                setTasks(response.data);
            } catch (err) {
                setError('Failed to fetch tasks.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchTasks();
        }
    }, [token]);

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">All Tasks</h3>
            <ul className="divide-y divide-gray-200">
                {tasks.map(task => (
                    <li key={task._id} className="py-2">
                        <p><strong>ID:</strong> {task._id}</p>
                        <p><strong>Type:</strong> {task.type}</p>
                        <p><strong>Status:</strong> {task.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
