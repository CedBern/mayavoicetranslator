import { useEffect, useState } from 'react';
import TaskList from '../components/dashboard/TaskList';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { tasksApi } from '../services/api';

const DashboardPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await tasksApi.getTasks();
                setTasks(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch tasks.');
                setLoading(false);
            }
        };

        if (user) {
            fetchTasks();
        }

    }, [user]);

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Validation Tasks</h1>
            <TaskList tasks={tasks} />
        </div>
    );
};

export default DashboardPage;
