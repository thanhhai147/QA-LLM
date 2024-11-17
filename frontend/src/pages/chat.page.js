import React, { useState, useEffect } from "react";
import { Button, Input, Menu, Dropdown, Popconfirm } from "antd";
import { MenuOutlined, UserOutlined, DownOutlined, MinusCircleOutlined, EditOutlined, FormOutlined } from "@ant-design/icons";
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

    const [username] = useState("AnYeuAnh"); // Tên người dùng mẫu

    useEffect(() => {
        handleNewChat();
    }, []);

    const handleNewChat = () => {
        const newChat = { title: `Trò chuyện ${chatHistory.length + 1}`, messages: [] };
        setChatHistory([...chatHistory, newChat]);
        setCurrentChatIndex(chatHistory.length); // Chuyển sang cuộc trò chuyện mới
        setIsFirstMessageSent(false);
    };

    const handleSendMessage = () => {
        if (currentMessage.trim()) {
            if (chatHistory.length === 0) {
                handleNewChat();
            }

            if (currentChatIndex !== null && chatHistory[currentChatIndex]) {
                const updatedChatHistory = [...chatHistory];
                updatedChatHistory[currentChatIndex].messages.push(currentMessage);
                setChatHistory(updatedChatHistory);
                setCurrentMessage("");
                setIsFirstMessageSent(true);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && e.shiftKey) {
            setCurrentMessage(currentMessage + "\n");
        } else if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    const selectChat = (index) => {
        setCurrentChatIndex(index);
    };

    const deleteChat = (index) => {
        if (currentChatIndex === index) {
            handleNewChat();
        }

        const updatedChatHistory = chatHistory.filter((_, i) => i !== index);

        if (updatedChatHistory.length > 0) {
            setCurrentChatIndex(0);
        } else {
            setCurrentChatIndex(null);
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
                Tài khoản: <strong>{username}</strong>
            </Menu.Item>
            <Menu.Item
                key="2"
                danger
                onClick={() => {
                    navigate("/login");
                }}
            >
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    const modelMenu = (
        <Menu>
            <Menu.Item key="1" danger>
                Mô hình 1
            </Menu.Item>
            <Menu.Item key="2" danger>
                Mô hình 2
            </Menu.Item>
            <Menu.Item key="3" danger>
                Mô hình 3
            </Menu.Item>
        </Menu>
    );
    const promptingMenu = (
        <Menu>
            <Menu.Item key="1" danger>
                Cách 1
            </Menu.Item>
            <Menu.Item key="2" danger>
                Cách 2
            </Menu.Item>
            <Menu.Item key="3" danger>
                Cách 3
            </Menu.Item>
            <Menu.Item key="3" danger>
                Cách 4
            </Menu.Item>
        </Menu>
    );

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768 && isFirstMessageSent) {
                document.querySelector(".chat-area").classList.add("with-first-message");
            } else {
                document.querySelector(".chat-area").classList.remove("with-first-message");
            }
        };

        window.addEventListener("resize", handleResize);

        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, [isFirstMessageSent]);

    return (
        <div className="chat-page">
            {isSidebarVisible && (
                <div className="sidebar">
                    <div className="his-chat">Lịch sử trò chuyện</div>
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
                                    <span className="chat-title-text" onClick={() => selectChat(index)}>
                                        {chat.title}
                                    </span>
                                )}
                                <div className="chat-actions">
                                    <Popconfirm
                                        title="Bạn có chắc muốn xóa trò chuyện này?"
                                        onConfirm={() => deleteChat(index)}
                                        okText="Xóa"
                                        cancelText="Hủy"
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

                    <div className="header-center">
                        <Dropdown overlay={modelMenu}>
                            <Button className="select-model">
                                {"Chọn mô hình"} <DownOutlined />
                            </Button>
                        </Dropdown>
                        <Dropdown overlay={promptingMenu}>
                            <Button className="select-prompting">
                                {"Chọn đi nè"} <DownOutlined />
                            </Button>
                        </Dropdown>
                    </div>

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

                <div className="chat-input-area">
                    <Input
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập tin nhắn"
                        rows={1}
                    />
                    <Button type="primary" onClick={handleSendMessage}>
                        Gửi
                    </Button>
                </div>
            </div>
        </div>
    );
}
