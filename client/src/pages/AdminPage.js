import CorrectionList from '../components/admin/CorrectionList';
import TaskList from '../components/admin/TaskList';
import VideoIngestionForm from '../components/admin/VideoIngestionForm';

const AdminPage = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div className="mb-8">
                <VideoIngestionForm />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TaskList />
                <CorrectionList />
            </div>
        </div>
    );
};

export default AdminPage;
