import React, { useState, useEffect } from "react";
import ScrollToBottom from 'react-scroll-to-bottom';
import {Message} from "./Message";

export const Chat = ({ chatHistory, sendMessage }) => {

    const [messageText, setMessageText] = useState('');

    const send = () => {
        if (messageText.length > 0) {
            sendMessage(messageText);
            setMessageText('');
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: 'green',
            height: '500px',
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'green',
                borderRadius: '10px',
                height: '60%',
                overflowY: 'scroll',
                width: '100%'
            }}>
            <ScrollToBottom>
                {chatHistory.map((message, i) => {
                    return (
                        <div key={i}>
                            <div style={{
                                backgroundColor: 'blue',
                                background: '#F3F3F3',
                                borderRadius: '20px',
                                padding: '5px 20px',
                                color: 'white',
                                display: 'inline-block',
                                maxWidth: '80%'
                            }}>
                                <Message message={message}/>
                            </div>
                        </div>)
                }
                )}
            </ScrollToBottom>
            </div>
            <div style={{marginTop: 15}}>
                <form className="form">
                    <input
                        className="input"
                        type="text"
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={({ target: { value } }) => setMessageText(value)}
                        onKeyPress={event => event.key === 'Enter' ? send() : null}
                    />
                    <button className="sendButton" onClick={send}>Send</button>
                </form>
            </div>

        </div>
   )
}