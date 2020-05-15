const users =[]
//remove add getuser getalluser
const addUser =({id,username,Room}) =>{
    //clean the data
    username = username.trim().toLowerCase()
    Room = Room.trim().toLowerCase()

    //validate data

    if(!username || !Room)
    {
        return{
            error : 'username and room required'
        }
    }
    //validate existing user
    const existingUser = users.find((user)=>
    {
        return user.Room === Room && user.username === username
    })
    //validate  username
    if(existingUser){
        return{
            error: 'user already exists in room'
        }
    }
    const user = {id,username,Room}
    users.push(user)
    return{
        user
    }
}
const removeUser = (id)=>{
 const index = users.findIndex((user)=>user.id=id)
 if(index!=-1)
 {
     return users.splice(index,1)[0]
 }
}
const getUser = (id)=>{
return users.find((user)=>user.id===id)
}
const getUserInRoom = (Room)=>{
    Room = Room.trim().toLowerCase()
    return users.filter((user)=>users.Room===Room)
}
module.exports={
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}