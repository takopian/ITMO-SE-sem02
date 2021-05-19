import React, {useCallback, useState} from "react";
import ScrollToBottom from 'react-scroll-to-bottom';
import {Message} from "./Message/Message";
import {ChatForm} from './Form/Form'
import './Chat.css'


export const Chat = ({ chatHistory, sendMessage }) => {
    // принимаю сюда класснейм
    const [messageText, setMessageText] = useState('');

    const send = useCallback((event) => {
        event.preventDefault();
        if (messageText.length > 0) {
            sendMessage(messageText);
            setMessageText('');
        }
    }, [messageText])

    return (
        <div  className="chatContainer">
            <div className="messages">
            <ScrollToBottom>
                {chatHistory.map((message, i) => {
                    return (
                        <div className="message" key={i}>
                            <div>
                                <Message message={message}/>
                            </div>
                        </div>)
                }
                )}
            </ScrollToBottom>
            </div>
            <div className="sendForm">
                <ChatForm
                    send={send}
                    messageText={messageText}
                    setMessageText={setMessageText}
                />
            </div>

        </div>
   )
}