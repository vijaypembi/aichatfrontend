import { useState } from "react";
import { useNavigate , NavLink } from "react-router-dom";
import { FiBell } from "react-icons/fi"; // Feather Bell icon

const Topbar = () => {
    const navigate = useNavigate();
    let userDetails = {};
    try {
        userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
    } catch (error) {
        console.error("Invalid JSON in localStorage for 'userDetails'", error);
        userDetails = {};
    }
    const userShortName = userDetails.name?.slice(0, 2).toUpperCase() || "A";
    const [isActiveNotification, setIsActiveNotification] = useState(false);
    const [notificationCount] = useState(3);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const onLogOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userDetails");
        navigate("/");  
    };
    return (
        <div className="bg-white shadow-md w-full flex items-center justify-between px-4 md:px-6 py-3">
            <NavLink
                to="/"
                className="text-[#4361ee] font-bold text-xl md:text-2xl hover:text-[#3a56d4] transition-colors"
            >
                AI Chat Support
            </NavLink>

            <div className="flex items-center gap-4 md:gap-6 relative">
                <button
                    className="relative p-2 text-gray-600 hover:text-[#4361ee] transition-colors"
                    onClick={() =>
                        setIsActiveNotification(!isActiveNotification)
                    }
                >
                    <FiBell className="w-6 h-6" />
                    {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {notificationCount}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="w-10 h-10 rounded-full bg-[#4361ee] hover:bg-[#3a56d4] text-white flex items-center justify-center font-medium transition-colors relative"
                >
                    {userShortName}

                    {isMenuOpen && (
                        <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg w-48 overflow-hidden z-50">
                            <div className="py-1">
                                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                                    Profile
                                </button>
                                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                                    Settings
                                </button>
                                <button onClick={() => onLogOut()}  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Topbar;
