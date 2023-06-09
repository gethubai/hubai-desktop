import React, { useState } from 'react';
import molecule from 'mo';
const ChatUI = () => {
    const [messages, setMessages] = useState([
        { text: "Hello, how can I assist you today?", sender: "bot" }
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleNewMessageChange = (event) => {
        setNewMessage(event.target.value);
    };

    const handleSendMessage = () => {
        setMessages([...messages, { text: newMessage, sender: "user" }, { text: "I'm sorry, I'm too dumb to answer that.", sender: "bot" }]);
        // Send newMessage to your chatbot's API here, and update 'messages' with the response
        setNewMessage('');
    };

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            paddingTop: '0px',
            borderRadius: '10px',
            color: '#FFFFFF',
        },
        messagesContainer: {
            flex: '1 1 auto',
            overflowY: 'auto',
            marginBottom: '20px',
        },
        newMessageContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: '50px'
        },
        input: {
            flex: '1 1 auto',
            padding: '20px',
            marginRight: '20px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: '#404040',
            color: '#FFFFFF',
        },
        button: {
            padding: '20px 20px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: '#808080',
            color: '#FFFFFF',
            cursor: 'pointer',
        },
        botMessage: {
            backgroundColor: '#404040',
            borderRadius: '10px',
            padding: '10px',
            marginBottom: '10px',
            alignSelf: 'flex-start',
        },
        userMessage: {
            backgroundColor: '#808080',
            borderRadius: '10px',
            padding: '10px',
            marginBottom: '10px',
            alignSelf: 'flex-end',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.messagesContainer}>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        style={message.sender === 'bot' ? styles.botMessage : styles.userMessage}
                    >
                        {message.text}
                    </div>
                ))}
            </div>
            <div style={styles.newMessageContainer}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={handleNewMessageChange}
                    placeholder="Write your message here..."
                    style={styles.input}
                />
                <button onClick={handleSendMessage} style={styles.button}>Send</button>
            </div>
        </div>
    );
};

export default ChatUI;