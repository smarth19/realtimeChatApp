import React from 'react'
import send from '../img/direct.png'

// Extracting all the props from the props object
const Chat = ({ userName, setReplyMsg, replyMsg, sendMsg, messages, leave }) => {
    return (
        <div className='joinedChat'>
            <h2 className="userName">{userName} <span onClick={leave}>Leave</span> </h2>
            <div className="chatArea">
                {messages.map((msg, i) => <Msg key={i} type={msg.type} position={msg.position} userName={msg.userName} msg={msg.msg} />)}
            </div>
            <form className="sendMsg">
                <input type="text" value={replyMsg} placeholder='Type Here' onChange={e => setReplyMsg(e.target.value)}/>
                <button onClick={sendMsg}><img src={send} alt="send Msg"/></button>
            </form>
        </div>
    )
}
const Msg = ({type, position, userName, msg}) => {
    if(type === 'newUser'){
        return (
            <div className="chatAlert"><strong>{userName}</strong> Joined the chat</div>
        )
    }
    if(type === 'userLeft'){
        return (
            <div className="chatAlert userLeftAlert"><strong>{userName}</strong> left the chat</div>
        )
    }
    return (
        <div className={`msg ${position}`}>
            <div>
                <h4>{userName}:</h4>
                <h2>{msg}</h2>
            </div>
        </div>
    )
}
export default Chat