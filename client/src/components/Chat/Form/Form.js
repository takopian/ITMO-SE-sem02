import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form"
import React from "react";

export const ChatForm = ({send, messageText, setMessageText}) => {
    return (
        <Form
            className="form"
            onSubmit={send}
        >
            <input
                className="input"
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={({ target: { value } }) => setMessageText(value)}
                onKeyPress={event => event.key === 'Enter' ? send(event) : null}
            />
            <Button className="sendButton" onClick={send}>
                Отправить
            </Button>
        </Form>
    )
}