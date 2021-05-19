import './Message.css';

export const Message = ({message}) => {

    return (
        <div className="messageContainer ">
            <p className="sentText pl-10 ">{message.name}:</p>
            <div className="messageBox">
                <p className="messageText colorWhite">{message.text}</p>
            </div>
        </div>
    )
}