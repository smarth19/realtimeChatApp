import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import Chat from './Chat';
import cancel from '../img/cancel.png'

let socket;

const HomePage = () => {
    const [userName, setUserName] = useState('')
    const [room, setRoom] = useState('')
    const [showAlert, setShowAlert] = useState(false)
    const [replyMsg, setReplyMsg] = useState('')
    const [joined, setJoined] = useState(false)
    const [messages, setMessages] = useState([])
    const [allUsers, setAllUsers] = useState([])

    useEffect(()=>{
        // making connection with the socket.io on the server
        socket = io(process.env.REACT_APP_SOCKET)
        // getting all the users joined in the room
        socket.on('getAllUsers', data => {
            let users = []
            data.forEach(user => {
                users.push(user.userName)
            });
            setAllUsers(users)
        })
    },[])

    useEffect(()=>{
        // what to do once a message is received
        socket.on('msgReceived', data => {
            let message = {
                type: 'msg',
                userName: data.userName,
                msg: data.msg,
                position: 'left'
            }
            setMessages(messages => [...messages, message])
        })
        // what to do when a new user joins
        socket.on('newUserJoined', data => {
            let newUserAlert = {
                type: 'newUser',
                userName: data
            }
            setMessages(messages => [...messages, newUserAlert])
            setAllUsers(allUsers => [...allUsers, data])
        })
        // what to do if any user leave the room
        socket.on('userLeft', data => {
            let newLeftAlert = {
                type: 'userLeft',
                userName: data
            }
            setMessages(messages => [...messages, newLeftAlert])
            setAllUsers(allUsers => {
                let usersJoined = [...allUsers]
                let afterUserLeft = usersJoined.filter(user => user != data)
                return afterUserLeft
            })
        })
    }, [])

    // joining a room
    const joinRoom = e => {
        e.preventDefault();
        socket.emit('newUser', {userName, room}, error => {
            if(error){
                setShowAlert(error)
                setJoined(false)
            } else {
                setJoined(true)
            }
        })
        setAllUsers(users => [...users, userName])
    }

    // sending a message/reply into the room/chat
    const sendMsg = e => {
        e.preventDefault()
        socket.emit('newMsg', replyMsg)
        let message = {
            type: 'msg',
            userName: 'You',
            msg: replyMsg,
            position: 'right'
        }
        let allMsg = [...messages]
        allMsg.push(message)
        setMessages(allMsg)
        setReplyMsg('')
    }

    // when leave button is clicked
    const leave = () => {
        window.location.reload()
    }
    // when close icon is clicked on the alert
    const cancelAlert = () => {
        setShowAlert(false)
    }
    return (
        <div className="homePage">
            <div className={`alert ${showAlert && `showAlert`}`}>{showAlert} <img onClick={cancelAlert} src={cancel} alt="cancel"/></div>
            <h1>HEY USER, WELCOME TO REALTIME CHAT APPLICATION</h1>
            <div className="main">
                <div className="box sideText left">
                    <h1>1. Enter the username with which you to join the room and enter the room you want to join.</h1>
                    <h1>2. Either you'll be creating a new room or joining a existing one</h1>
                    <h1>3. You can invite your friends to join the chat room</h1>
                </div>
                <div className="box center">
                    {joined ? <Chat replyMsg={replyMsg} leave={leave} messages={messages} userName={userName} setReplyMsg={setReplyMsg} sendMsg={sendMsg} /> : <form onSubmit={joinRoom}>
                        <h3>Join</h3>
                        <input type="text" onChange={(e) => setUserName(e.target.value)} placeholder='Username' />
                        <input type="text" onChange={(e) => setRoom(e.target.value)} placeholder='Room' />
                        <button type="submit">Join</button>
                    </form> }                    
                </div>
                <div className="box sideText">
                    {joined ? <JoinedUsers room={room} allUsers={allUsers} /> : <h1>Please Join a chat room to start chatting</h1>}
                </div>
            </div>
        </div>
    )
}
const JoinedUsers = ({room, allUsers}) =>{
    return(
        <>
            <h1>Room: <em>{room}</em></h1>
            {allUsers.map((user, i) => <UserOnline key={i} id={i} user={user} />)}
        </>
    )
}
const UserOnline = ({user, id}) => {
    return (
        <h3>{id+1}. {user}</h3>
    )
}

export default HomePage