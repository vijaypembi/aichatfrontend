import React, { useState } from "react";
import axios from "axios";
import "./index.css";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef } from "react";

// import { useNavigate } from "react-router-dom";

// "message": "success",
//     "chatHistory": [
//         {
//             "fileInfo": null,
//             "_id": "681bbce12a83378f3e5bf9e1",
//             "senderId": "ai-123",
//             "sender": "ai",
//             "text": "Here are some key points extracted from the \"examples.xlsx\" file data you provided:\n\n*   **File Type:** The file is a Microsoft Excel Open XML Spreadsheet (.xlsx).\n*   **Purpose of the Sheet** The sheet should not be used for uploading but rather to show the format for data upload\n*   **Data formats:** The file provides example formats for uploading data, including formats for \"One Product Multiple Designs\" and \"One Order Multiple Products\".\n*   **Fields:** The file contains columns (fields) such as:\n    *   Client\n    *   Order No.\n    *   Style\n    *   Design Name/Code/URL\n    *   Placement\n    *   Dimensions (Width & Height in inches)\n    *   Gender\n    *   Color\n    *   Size\n    *   Qty (Quantity)\n    *   Payment Mode\n    *   Invoice Value\n    *   Courier Type\n    *   Delivery Information (State, City, Pincode, Customer Name, Contact Number, Address, Landmark)\n    *   Comments\n    *   Second Design details\n*   **Example Data:** The file includes example data rows demonstrating how to fill in the fields for different scenarios.\n*   **Delivery Locations:** Includes an extensive list of delivery states, cities and pincodes.\n*   **Styles:** Includes different style types: Vneck Half Sleeve, Round Neck Half Sleeve, Raglan Full Sleeve, Round Neck Full Sleeve, Round Neck Sleeveless, Polo Half Sleeve, Tank Top, Hooded SweatShirt, Dri Fit T-Shirt and All Over Printed Round Neck Hs T SHirt",
//             "responseType": "text",
//             "extraData": null,
//             "extractedText": "",
//             "createdAt": "2025-05-07T20:04:49.875Z",
//             "__v": 0
//         },

const ChatSection = ({ prevChats, err }) => {
    // console.log("prevChats", prevChats);
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    // console.log(userDetails);
    const [userText, setUserText] = useState("");
    const [chatHistory, setChatHistory] = useState(prevChats || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(err);
    const [file, setFile] = useState(null);

    const chatContainerRef = useRef(null);

    useEffect(() => {
        const container = chatContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight; // scroll to bottom
        }
    }, [chatHistory]); // run this whenever messages change

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const onClickSend = async () => {
        if (!userText && !file) {
            return alert("Please enter a message or select a file to send.");
        }
        // console.log("userText", userText);
        // console.log("file", file);
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("text", userText);
            formData.append("senderId", userDetails.id);
            if (file) formData.append("userfile", file);
            // console.log(formData);
            const API_URL =
                process.env.REACT_APP_API_URL || "http://localhost:5000";
            const endpoint =
                userDetails.role === "admin" ? "/api/admin" : "/api/chat";

            const response = await axios.post(
                `${API_URL}${endpoint}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // console.log(response.data);
            setChatHistory(response.data.chatHistory);
            setUserText("");
            setFile(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send message");
        } finally {
            setLoading(false);
        }
    };
    const handleDownload = (fileInfo) => {
        if (!fileInfo || !fileInfo.data || !fileInfo.data.data) return;

        const byteArray = new Uint8Array(fileInfo.data.data);
        const blob = new Blob([byteArray], { type: fileInfo.mimetype });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileInfo.filename || "download";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <div ref={chatContainerRef} className="overflow-y-auto mb-40">
                <div className="m-2 p-4 space-y-4">
                    {chatHistory.length > 0 ? (
                        chatHistory.map((chat) => (
                            <div
                                key={chat._id}
                                className={`flex ${
                                    chat.sender === userDetails.role
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[70%] p-4 rounded-lg ${
                                        chat.sender === userDetails.role
                                            ? "bg-blue-500 text-white ml-4"
                                            : "bg-white text-gray-800 mr-4 shadow-md"
                                    }`}
                                >
                                    <div className="prose max-w-none">
                                        <ReactMarkdown>
                                            {chat.text}
                                        </ReactMarkdown>
                                    </div>

                                    {chat.fileInfo && (
                                        <button
                                            onClick={() =>
                                                handleDownload(chat.fileInfo)
                                            }
                                            className={`text-sm underline ${
                                                chat.sender === userDetails.role
                                                    ? "text-blue-200 hover:text-blue-100"
                                                    : "text-blue-600 hover:text-blue-800"
                                            }`}
                                        >
                                            {chat.fileInfo.filename}
                                        </button>
                                    )}

                                    <div
                                        className={`mt-2 text-xs ${
                                            chat.sender === userDetails.role
                                                ? "text-blue-200"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {new Date(
                                            chat.createdAt
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            Start a new conversation
                        </div>
                    )}
                </div>
            </div>

            <div className="border-t fixed bottom-0 w-full sm:pr-10 bg-white p-4 shrink-0">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="flex gap-1">
                    <label className="flex items-center sm:max-w-sm px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <span className="text-sm sm:px-1 sm:py-1 sm:text-base">
                            Attach
                        </span>
                    </label>

                    <input
                        type="text"
                        value={userText}
                        onChange={(e) => setUserText(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1  px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyDown={(e) => e.key === "Enter" && onClickSend()}
                    />

                    <button
                        onClick={onClickSend}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <span className="animate-spin mr-2">↻</span>
                                Sending...
                            </span>
                        ) : (
                            "Send"
                        )}
                    </button>
                </div>

                {file && (
                    <div className="mt-2 flex items-center justify-between bg-blue-50 p-2 rounded-lg">
                        <span className="text-sm text-blue-600 truncate">
                            {file.name}
                        </span>
                        <button
                            onClick={() => setFile(null)}
                            className="text-red-500 hover:text-red-700"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
    // console.log(chatHistory);
    // return (
    //     <div className="chat-container">
    //         <div className="chat-history">
    //             {chatHistory.length > 0 ? (
    //                 chatHistory.map((chat) => (
    //                     <div className="message-bubble">
    //                         <div
    //                             key={chat._id}
    //                             className={
    //                                 chat.sender === userDetails.role
    //                                     ? "user"
    //                                     : "ai"
    //                             }
    //                         >
    //                             <p className="message-text">{chat.text}</p>
    //                             {chat.fileInfo && (
    //                                 <button
    //                                     onClick={() =>
    //                                         handleDownload(chat.fileInfo)
    //                                     }
    //                                     className="text-blue-600 underline hover:text-blue-800"
    //                                 >
    //                                     {chat.fileInfo.filename}
    //                                 </button>
    //                             )}
    //                             <span className="message-time">
    //                                 {new Date(
    //                                     chat.createdAt
    //                                 ).toLocaleTimeString()}
    //                             </span>
    //                         </div>
    //                     </div>
    //                 ))
    //             ) : (
    //                 <div className="no-chats">Start a new conversation</div>
    //             )}
    //         </div>

    //         <div className="chat-input-container">
    //             {error && <div className="error-message">{error}</div>}

    //             <div className="input-group">
    //                 <label className="file-input-label">
    //                     Attach File
    //                     <input
    //                         type="file"
    //                         onChange={handleFileChange}
    //                         className="hidden-file-input"
    //                     />
    //                 </label>

    //                 <input
    //                     type="text"
    //                     value={userText}
    //                     onChange={(e) => setUserText(e.target.value)}
    //                     placeholder="Type your message..."
    //                     className="text-input"
    //                     onKeyDown={(e) => e.key === "Enter" && onClickSend()}
    //                 />

    //                 <button
    //                     onClick={onClickSend}
    //                     disabled={loading}
    //                     className="send-button"
    //                 >
    //                     {loading ? "Sending..." : "Send"}
    //                 </button>
    //             </div>

    //             {file && (
    //                 <div className="file-preview">
    //                     {file.name}
    //                     <button
    //                         onClick={() => setFile(null)}
    //                         className="remove-file"
    //                     >
    //                         x
    //                     </button>
    //                 </div>
    //             )}
    //         </div>
    //     </div>
    // );
};

export default ChatSection;
