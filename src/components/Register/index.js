import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
    });

    const [errors, setErrors] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
        role: false,
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

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: false }));
        }
        setApiError("");
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            name: false,
            email: false,
            password: false,
            confirmPassword: false,
            role: false,
        };

        if (!formData.name.trim()) {
            newErrors.name = true;
            isValid = false;
        }
        if (
            !formData.email.match(
                /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
            )
        ) {
            newErrors.email = true;
            isValid = false;
        }
        if (formData.password.length < 6) {
            newErrors.password = true;
            isValid = false;
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = true;
            isValid = false;
        }
        if (!["user", "admin"].includes(formData.role)) {
            newErrors.role = true;
            isValid = false;
        }

        setErrors(newErrors);
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
            // console.log(API_URL);
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                }),
            });

            const data = await response.json();
            if (!response.ok)
                throw new Error(data.message || "Registration failed");

            console.log(data);
            localStorage.setItem("token", data.token);
            localStorage.setItem("userDetails", JSON.stringify(data.user));
            navigate("/");
        } catch (error) {
            setApiError(
                error.message || "An error occurred during registration"
            );
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
                        Register
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
                                    errors.name
                                        ? "border-red-500 focus:ring-red-200"
                                        : "border-gray-300 focus:ring-blue-200"
                                }`}
                                type="text"
                                placeholder="Full Name"
                                name="name"
                                autoComplete="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1 ml-2">
                                    Name is required
                                </p>
                            )}
                        </div>

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
                                value={formData.email}
                                autoComplete="email"
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1 ml-2">
                                    Valid email is required
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
                                    Password must be at least 6 characters
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <input
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.confirmPassword
                                        ? "border-red-500 focus:ring-red-200"
                                        : "border-gray-300 focus:ring-blue-200"
                                }`}
                                type="password"
                                autoComplete="new-password"
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1 ml-2">
                                    Passwords do not match
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Select Role
                            </label>
                            <div className="flex gap-4">
                                {["user", "admin"].map((role) => (
                                    <label
                                        key={role}
                                        className="flex items-center space-x-2"
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={role}
                                            checked={formData.role === role}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-[#4361ee] focus:ring-[#4361ee] border-gray-300"
                                        />
                                        <span className="text-sm text-gray-700 capitalize">
                                            {role}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            {errors.role && (
                                <p className="text-red-500 text-sm mt-1 ml-2">
                                    Please select a valid role
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
                                "Register"
                            )}
                        </button>

                        <p className="text-gray-600 text-center">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-[#4361ee] hover:text-[#3a56d4] font-medium"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
