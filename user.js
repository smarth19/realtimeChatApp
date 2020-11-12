let user = []

const addUser = userObj => {
    let existing = user.find(user => user.userName === userObj.userName && user.room === userObj.room)
    if(existing){
        return {error: 'username already exists'}
    }
    user.push(userObj)
    return {user: userObj}
}
const removeUser = userId => {
    let index = user.findIndex(user => user.id == userId)
    if(index !== -1) return user.splice(index, 1)
}
const getUser = id => user.find(user => user.id == id)
const getUsersInRoom = room => user.filter(users => users.room === room)

module.exports = {addUser, removeUser, getUsersInRoom, getUser}