import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">MayaVoice Translator</Link>
                <ul className="flex items-center space-x-4">
                    <li>
                        <Link to="/" className="hover:text-gray-300">Dashboard</Link>
                    </li>
                    {isAuthenticated && user?.roles.includes('admin') && (
                        <li>
                            <Link to="/admin" className="hover:text-gray-300">Admin</Link>
                        </li>
                    )}
                    {isAuthenticated ? (
                        <li>
                            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                                Logout
                            </button>
                        </li>
                    ) : (
                        <li>
                            <Link to="/login" className="hover:text-gray-300">Login</Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
