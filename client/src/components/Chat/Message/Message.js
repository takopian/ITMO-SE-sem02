import './Message.css';

export const Message = ({message}) => {

    return (
        <div className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
                <p className="messageText colorDark">{message.text}</p>
            </div>
            <p className="sentText pl-10 ">{message.name}</p>
        </div>
    )
}