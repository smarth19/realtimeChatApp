const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)
const cors = require('cors')
// importing helper functions for handeling socket.io events for the user
const {addUser, removeUser, getUsersInRoom, getUser} = require('./user')

// setting up index route just to test the server
app.get('/', (req, res) => {
    res.send('<h1><i>Server is up and running</i></h1>')
})
app.use(cors)
// socket io receiving connecting just as the client is connected with the io on client-side
io.on('connection', socket => {
    // event when a new user joins
    socket.on('newUser', (userObj, callback) => {
        if(!userObj.userName.trim() || !userObj.room){
            return callback(`Please Fill Username And Room You Want To Join`)
        }
        let newUser = {
            id: socket.id,
            userName: userObj.userName,
            room: userObj.room
        }
        let {error, user} = addUser(newUser)
        if(error){
            return callback('Username Already Exists, Please Choose A Different Username')
        }
        // join the user in the provided room, socket.join() takes the room name as parameter
        socket.join(user.room)
        // broadcast rest of the users about joining of the new user
        socket.broadcast.to(user.room).emit('newUserJoined', user.userName)
        // send list of all currently joined users in the room to the newly joined user
        socket.emit('getAllUsers', getUsersInRoom(newUser.room))
        callback()
    })
    // what should happen when this user sends a message
    socket.on('newMsg', msg => {
        let user = getUser(socket.id)
        let userDataToSend = {msg, userName: user.userName}
        // Broadcast it to all other users
        socket.broadcast.to(user.room).emit('msgReceived', userDataToSend)
    })

    // removing/disconnecting user and broadcasting rest of the users that this user has left the room
    socket.on('disconnect', reason => {
        let user = getUser(socket.id)
        if(user){
            socket.broadcast.to(user.room).emit('userLeft', user.userName)
        }
        removeUser(socket.id)
    })
})

// Making the server listen on given port number
server.listen(process.env.PORT || 5000, ()=>{
    console.log(`Server has started`);
})