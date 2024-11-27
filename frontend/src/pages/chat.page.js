import React, { useState, useEffect } from "react";
import { Button, Input, Menu, Dropdown, Popconfirm, message } from "antd";
import { MenuOutlined, UserOutlined, DownOutlined, MinusCircleOutlined, EditOutlined, FormOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/authentication.context';
import UserAPI from "../API/user";
import ChatAPI from "../API/chat";
import SessionAPI from "../API/session";

import "../assets/css/ChatPage.css";

export default function ChatPage() {
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const [chatHistory, setChatHistory] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [currentChatIndex, setCurrentChatIndex] = useState(null);
    const [isFirstMessageSent, setIsFirstMessageSent] = useState(false);
    const [editingTitle, setEditingTitle] = useState(null);
    const [newTitle, setNewTitle] = useState("");
    const [model, setModel] = useState(null)
    const [prompt, setPrompt] = useState(null)
    const [message, setMessage] = useState(""); // State để lưu thông báo
    const [isSuccess, setIsSuccess] = useState(false); // State để xác định loại thông báo
    const { username, logout , userId } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        handleNewChat();
    }, []);

    const handleNewChat = () => {
        SessionAPI.createSession(userId) 
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const newChat = { title: `Trò chuyện ${chatHistory.length + 1}`, messages: [], sessionId: data.data.session_id };
                    setChatHistory([...chatHistory, newChat]);
                    setCurrentChatIndex(chatHistory.length);
                    setIsFirstMessageSent(false);
                } else {
                    message.error(data.message);
                }
            })
            .catch(error => {
                message.error("Lỗi khi tạo phiên: " + error.message);
            });
    };

    
    const deleteChat = (index) => {
        const currentChat = chatHistory[index];
    
        SessionAPI.deleteSession(currentChat.sessionId)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const updatedChatHistory = chatHistory.filter((_, i) => i !== index);
                    setChatHistory(updatedChatHistory);
                    if (updatedChatHistory.length > 0) {
                        setCurrentChatIndex(0);
                    } else {
                        setCurrentChatIndex(null);
                    }
                } else {
                    message.error(data.message); 
                }
            })
            .catch(error => {
                message.error("Lỗi khi xóa đoạn chat: " + error.message);
            });
    };


    const handleSendMessage = () => {
        if (currentMessage.trim()) {
            const currentChat = chatHistory[currentChatIndex];
            
            ChatAPI.createChat(currentChat.sessionId, currentMessage)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        currentChat.messages.push(currentMessage);
                        currentChat.messages.push(data.data.bot_answer);
                        setChatHistory([...chatHistory]);
                        setCurrentMessage("");
                        setIsFirstMessageSent(true);
                    } else {
                        message.error(data.message); 
                    }
                })
                .catch(error => {
                    message.error("Lỗi khi gửi tin nhắn: " + error.message);
                });
        }
    };
    

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    const selectChat = (index) => {
        setCurrentChatIndex(index);
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


    const handleLogout = () => {
        UserAPI.logout(userId) 
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setMessage(data.message); // Hiển thị thông báo thành công
                    setIsSuccess(true);
                    setTimeout(() => {
                        setMessage(data.message); 
                        logout() // ================
                        navigate("/login"); 
                    }, 1500);
                } else {
                    setMessage(data.message);
                    setIsSuccess(false);
                }
            })
            .catch((e) => {
                setMessage("Lỗi: " + e.message);
                setIsSuccess(false);
            });
    };
    const accountMenu = (
        <Menu>
            <Menu.Item key="1">
                Tài khoản: <strong>{username}</strong>
            </Menu.Item>
            <Menu.Item
                key="2"
                danger
                onClick={handleLogout} 
            >
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    const modelMenu = (
        <Menu>
            <Menu.Item key="1" primary onClick={() => setModel('Mô hình 1')}>
                Mô hình 1
            </Menu.Item>
            <Menu.Item key="2" primary onClick={() => setModel('Mô hình 2')}>
                Mô hình 2
            </Menu.Item>
            <Menu.Item key="3" primary onClick={() => setModel('Mô hình 3')}>
                Mô hình 3
            </Menu.Item>
        </Menu>
    );
    const promptingMenu = (
        <Menu>
            <Menu.Item key="1" primary onClick={() => setPrompt('Zero Shot')}>
                Zero Shot
            </Menu.Item>
            <Menu.Item key="2" primary onClick={() => setPrompt('One Shot')}>
                One Shot
            </Menu.Item>
            <Menu.Item key="3" primary onClick={() => setPrompt('Few Shot')}>
                Few Shot
            </Menu.Item>
            <Menu.Item key="3" primary onClick={() => setPrompt('Chain-of-thoughts')}>
                Chain-of-thoughts
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
                        <Dropdown 
                            overlay={modelMenu}
                        >
                            <Button className="select-model">
                                {model ? model : "Chọn mô hình"} <DownOutlined />
                            </Button>
                        </Dropdown>
                        <Dropdown overlay={promptingMenu}>
                            <Button className="select-prompting">
                                {prompt ? prompt : "Chọn cách prompting"} <DownOutlined />
                            </Button>
                        </Dropdown>
                    </div>

                        <Dropdown overlay={accountMenu}>
                            <Button className="account-info" icon={<UserOutlined />}>
                                {username} <DownOutlined />
                            </Button>
                        </Dropdown>
                    
                </div>

                {message && (
                    <div className={`message-box ${isSuccess ? "success" : "error"}`}>
                        {message}
                    </div>
                )}

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
