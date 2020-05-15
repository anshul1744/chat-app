const express = require('express')
const path = require('path')
const http = require('http')
const Filter = require('bad-words')
const socketio = require('socket.io')
const {generateMessage,generateLocationMessage}=require('./Utils/messages')
const {addUser,removeUser,getUser,getUserInRoom}= require('./Utils/users')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port =process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))
let count =0 
io.on('connection',(socket)=>{
    socket.on('join',(options,callback)=>{
         const {error,user}=addUser({
             id:socket.id,
             ...options
          })
          if(error){
             return callback(error)
          }
         socket.join(user.Room)
         socket.emit('message',generateMessage('Admin','welcome'))
         socket.broadcast.to(user.Room).emit('message',generateMessage('Admin',user.username+' has joined'))
         io.to(user.Room).emit('roomData',{
             Room:user.Room,
             users:getUserInRoom(user.Room)
         })
         callback()
    })
    socket.on('sendMessage',(message,callback)=>{
        const user = getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('profanity is not allowed')
        }
        io.to(user.Room).emit('message',generateMessage(user.username,message))
        callback('delivered')
    })
    // socket.on('increment',()=>{
    //     count++;
    //     //socket.emit('countupdated',count)
    //     io.emit('countupdated',count)
    // })
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user){
        io.emit('message',generateMessage('Admin', user.username+ ' has left'))
        io.to(user.Room).emit('roomData',{
            Room:user.Room,
            users:getUserInRoom(user.Room)
        })
        }
    })
    socket.on('sendLocation',(coords,callback)=>{
        const user = getUser(socket.id)
        io.to(user.Room).emit('locationMessage',generateLocationMessage(user.username,'https://www.google.com/maps?q='+coords.latitude+','+coords.longitude))
        callback()
    })
})
server.listen(port,()=>
{
    console.log('port started')
})