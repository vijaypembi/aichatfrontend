import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        email: false,
        password: false,
    });
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: false,
            }));
        }
        setApiError("");
    };

    const validateForm = () => {
        let isValid = true;

        if (formData.email.trim() === "") {
            setErrors((prev) => ({ ...prev, email: true }));
            isValid = false;
        } else {
            setErrors((prev) => ({ ...prev, email: false }));
        }
        if (formData.password.trim() === "") {
            setErrors((prev) => ({ ...prev, password: true }));
            isValid = false;
        } else {
            setErrors((prev) => ({ ...prev, password: false }));
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setApiError("");

        try {
            const API_URL =
                process.env.REACT_APP_API_URL || "http://localhost:5000";

            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Handle successful login (store token, redirect, etc.)
            // console.log("Login successful:", data);
            // console.log(data);

            localStorage.setItem("token", data.token);
            localStorage.setItem("userDetails", JSON.stringify(data.user));

            navigate("/"); // Redirect to dashboard
        } catch (error) {
            setApiError(error.message || "An error occurred during login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen min-w-screen bg-[#4361ee] flex justify-center items-center p-0 m-0">
            <div className="max-w-sm w-full mx-4 py-4">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-lg p-6 shadow-lg"
                >
                    <h1 className="text-[#4361ee] text-4xl text-center mb-6 font-sans">
                        Login
                    </h1>

                    {apiError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {apiError}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <input
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.email
                                        ? "border-red-500 focus:ring-red-200"
                                        : "border-gray-300 focus:ring-blue-200"
                                }`}
                                type="email"
                                placeholder="Email"
                                name="email"
                                autoComplete="name"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1 ml-2">
                                    Email is required
                                </p>
                            )}
                        </div>

                        <div>
                            <input
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.password
                                        ? "border-red-500 focus:ring-red-200"
                                        : "border-gray-300 focus:ring-blue-200"
                                }`}
                                type="password"
                                placeholder="Password"
                                name="password"
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1 ml-2">
                                    Password is required
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#4361ee] hover:bg-[#3a56d4] text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex justify-center items-center h-12 gap-2"
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                        role="status"
                                    >
                                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                            Loading...
                                        </span>
                                    </span>
                                    Processing...
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>

                        <p className="text-gray-600 text-center">
                            Create a new account{" "}
                            <Link
                                to="/register"
                                className="text-[#4361ee] hover:text-[#3a56d4] font-medium"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
