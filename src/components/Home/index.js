import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";

import Topbar from "../Topbar";
import ChatSection from "../ChatSection";

const Home = () => {
    const navigate = useNavigate();
    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Authentication check and data fetching
    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            const userDetails = JSON.parse(localStorage.getItem("userDetails"));
            const token = localStorage.getItem("token");
            // console.log(token);
            if (!userDetails || !token) {
                navigate("/login");
                return;
            }

            try {
                const API_URL =
                    process.env.REACT_APP_API_URL || "http://localhost:5000";
                const endpoint =
                    userDetails.role === "admin" ? "/api/admin" : "/api/chat";

                // console.log(`${API_URL}${endpoint}`);
                const { data } = await axios.get(`${API_URL}${endpoint}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                // console.log("Fetched chat history:", data.chatHistory);
                setChatList(data.chatHistory || []);
            } catch (err) {
                setError(
                    err.response?.data?.message || "Failed to fetch chats"
                );
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndFetchData();
    }, [navigate]);

    // Render loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Render error state
    // if (error) {
    //     return (
    //         <div className="flex justify-center items-center min-h-screen">
    //             <div className="text-red-500 text-lg">{error}</div>
    //         </div>
    //     );
    // }

    return (
        <div className="flex flex-col h-screen">
            <Topbar />
            <main className="flex-1 overflow-hidden p-4">
                <ChatSection prevChats={chatList} err={error} />
            </main>
        </div>
    );
};

Home.propTypes = {
    chatList: PropTypes.array,
};

export default Home;
