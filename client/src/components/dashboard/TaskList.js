import { Link } from 'react-router-dom';

const TaskItem = ({ task }) => {
    return (
        <div className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold">{task.type}</h3>
            <p>Status: {task.status}</p>
            <Link to={`/task/${task.id}`} className="text-blue-500 hover:underline">
                View Details
            </Link>
        </div>
    );
};

const TaskList = ({ tasks }) => {
    if (tasks.length === 0) {
        return <p>No tasks available.</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map(task => (
                <TaskItem key={task.id} task={task} />
            ))}
        </div>
    );
};

export default TaskList;
