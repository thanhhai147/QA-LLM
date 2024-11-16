import React, { useState, useEffect } from "react";
import { Button, Input, Menu, Dropdown, Popconfirm } from "antd";
import { MenuOutlined, UserOutlined, DownOutlined, MinusCircleOutlined, EditOutlined , FormOutlined} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import "../assets/css/ChatPage.css";

export default function ChatPage() {
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const [chatHistory, setChatHistory] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [currentChatIndex, setCurrentChatIndex] = useState(null);
    const [isFirstMessageSent, setIsFirstMessageSent] = useState(false);
    const [editingTitle, setEditingTitle] = useState(null);
    const [newTitle, setNewTitle] = useState("");

    const [username] = useState("AnYeuAnh"); // Sample username

    // Create a new chat when the component is mounted
    useEffect(() => {
        handleNewChat();
    }, []);

    const handleNewChat = () => {
        const newChat = { title: `Chat ${chatHistory.length + 1}`, messages: [] };
        setChatHistory([...chatHistory, newChat]);
        setCurrentChatIndex(chatHistory.length); // Switch to the new chat
        setIsFirstMessageSent(false);
    };

    const handleSendMessage = () => {
        if (currentMessage.trim()) {
            if (chatHistory.length === 0) {
                handleNewChat();
            }

            // Check if the currentChatIndex is valid before modifying messages
            if (currentChatIndex !== null && chatHistory[currentChatIndex]) {
                const updatedChatHistory = [...chatHistory];
                updatedChatHistory[currentChatIndex].messages.push(currentMessage);
                setChatHistory(updatedChatHistory);
                setCurrentMessage("");
                setIsFirstMessageSent(true); // Mark that the first message has been sent
            }
        }
    };

    const handleKeyDown = (e) => {
        // Allow line breaks with Shift + Enter
        if (e.key === "Enter" && e.shiftKey) {
            setCurrentMessage(currentMessage + "\n");
        } else if (e.key === "Enter") {
            // Send message on normal Enter key press
            handleSendMessage();
        }
    };

    const selectChat = (index) => {
        setCurrentChatIndex(index);
    };

    const deleteChat = (index) => {
        // If the current chat is being deleted, create a new chat
        if (currentChatIndex === index) {
            handleNewChat();
        }

        const updatedChatHistory = chatHistory.filter((_, i) => i !== index);

        // Update currentChatIndex after deletion
        if (updatedChatHistory.length > 0) {
            setCurrentChatIndex(0); // Select the first chat if any are left
        } else {
            setCurrentChatIndex(null); // Reset currentChatIndex if no chats are left
        }

        setChatHistory(updatedChatHistory);
    };

    const handleEditTitle = (index) => {
        setEditingTitle(index);
        setNewTitle(chatHistory[index].title);
    };

    const handleSaveTitle = (index) => {
        const updatedChatHistory = [...chatHistory];
        updatedChatHistory[index].title = newTitle;
        setChatHistory(updatedChatHistory);
        setEditingTitle(null);
        setNewTitle("");
    };

    const navigate = useNavigate();

    const accountMenu = (
        <Menu>
            <Menu.Item key="1">
                Account: <strong>{username}</strong>
            </Menu.Item>
            <Menu.Item
                key="2"
                danger
                onClick={() => {
                    navigate("/login");
                }}
            >
                Log Out
            </Menu.Item>
        </Menu>
    );

    const modelMenu = (
        <Menu>
            <Menu.Item
                key="1"
                danger
                onClick={() => {
                    navigate("##");
                }}
            >
                Model 1
            </Menu.Item><Menu.Item
                key="2"
                danger
                onClick={() => {
                    navigate("####");
                }}
            >
                Model 2
            </Menu.Item>
            <Menu.Item
                key="3"
                danger
                onClick={() => {
                    navigate("######");
                }}
            >
                Model 3
            </Menu.Item>
        </Menu>
    );

    useEffect(() => {
        const handleResize = () => {
            // Adjust chat input position on small screens if a message has been sent
            if (window.innerWidth < 768 && isFirstMessageSent) {
                document.querySelector(".chat-area").classList.add("with-first-message");
            } else {
                document.querySelector(".chat-area").classList.remove("with-first-message");
            }
        };

        // Listen for window resize events
        window.addEventListener("resize", handleResize);

        // Ensure correct state on first load
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, [isFirstMessageSent]);

    return (
        <div className="chat-page">
            {/* Sidebar */}
            {isSidebarVisible && (
                <div className="sidebar">
                    <h3>Chat History</h3>
                    <div className="chat-history">
                        {chatHistory.map((chat, index) => (
                            <div key={index} className={`chat-title ${currentChatIndex === index ? "selected" : ""}`}>
                                {editingTitle === index ? (
                                    <Input
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        onBlur={() => handleSaveTitle(index)}
                                        autoFocus
                                    />
                                ) : (
                                    <span
                                        className="chat-title-text"
                                        onClick={() => selectChat(index)}
                                    >
                                        {chat.title}
                                    </span>
                                )}
                                <div className="chat-actions">
                                    <Popconfirm
                                        title="Are you sure you want to delete this chat?"
                                        onConfirm={() => deleteChat(index)}
                                        okText="Delete"
                                        cancelText="Cancel"
                                    >
                                        <Button type="link" danger><MinusCircleOutlined /></Button>
                                    </Popconfirm>
                                    <Button type="link" onClick={() => handleEditTitle(index)}><EditOutlined /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className={`main-content ${isSidebarVisible ? "" : "no-sidebar"}`}>
                <div className="header">
                    <div className="header-buttons">
                        <Button
                            className="toggle-sidebar"
                            icon={<MenuOutlined />}
                            onClick={() => setSidebarVisible(!isSidebarVisible)}
                        />
                        <Button
                            className="new-chat"
                            icon={<FormOutlined />}
                            onClick={handleNewChat}
                        >
                        </Button>
                    </div>
                    
                    <Dropdown overlay={modelMenu}>
                        <Button className="select-model">
                            {"Model"} <DownOutlined />
                        </Button>
                    </Dropdown>
                    <Dropdown overlay={accountMenu}>
                        <Button className="account-info" icon={<UserOutlined />}>
                            {username} <DownOutlined />
                        </Button>
                    </Dropdown>
                </div>

                <div className="chat-area">
                    {currentChatIndex !== null &&
                        chatHistory[currentChatIndex] &&
                        chatHistory[currentChatIndex].messages.map((message, index) => (
                            <div className="chat-message" key={index}>
                                {message}
                            </div>
                        ))}
                </div>

                {/* Chat input area */}
                <div className="chat-input-area">
                    <Input
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message"
                        rows={1}
                    />
                    <Button type="primary" onClick={handleSendMessage}>
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
}
