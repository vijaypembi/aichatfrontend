import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="text-center space-y-4">
                <h1 className="text-9xl font-bold text-gray-800">404</h1>
                <p className="text-2xl text-gray-600">Page Not Found</p>
                <p className="text-gray-500">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default NotFound;
