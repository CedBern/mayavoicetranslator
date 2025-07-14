import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Configuration, TasksApi } from '../api';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import TranscriptValidator from '../components/tasks/TranscriptValidator';
import { AuthContext } from '../contexts/AuthContext';

const TaskDetailPage = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchTask = async () => {
            if (!token) {
                setError('Authentication required.');
                setLoading(false);
                return;
            }
            try {
                const config = new Configuration({ accessToken: token });
                const tasksApi = new TasksApi(config);
                const response = await tasksApi.getTaskById({ taskId });
                setTask(response);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch task details.');
                console.error(err);
                setLoading(false);
            }
        };

        if (taskId) {
            fetchTask();
        }
    }, [taskId, token]);

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!task) return <p>Task not found.</p>;

    const renderTaskComponent = () => {
        switch (task.type) {
            case 'transcription':
                return <TranscriptValidator task={task} />;
            // case 'translation':
            //     return <TranslationTool task={task} />;
            // case 'dictionary':
            //     return <DictionaryTool task={task} />;
            default:
                return <p>Unknown task type.</p>;
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Task Details</h1>
            {renderTaskComponent()}
        </div>
    );
};

export default TaskDetailPage;
