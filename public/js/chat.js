const socket =io()
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $messages = document.querySelector('#messages')
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationmessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
//templates
const {username, Room }=Qs.parse(location.search,{ignoreQueryPrefix:true})
const autoscroll =()=>{
 //New Message
 const $newMessage = $messages.lastElementChild
 //height of last message
 const newMessageStyles = getComputedStyle($newMessage)
 const newMessageMargin = parseInt(newMessageStyles.marginBottom)
 const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
 //visible height
 const visibleHeight = $messages.offsetHeight
 //height of container
 const containerHeight = $messages.scrollHeight
 //how far i have scrolled
 const scrollOffset = $messages.scrollTop +visibleHeight
 if(containerHeight - newMessageHeight <= scrollOffset){
     $messages.scrollTop = $messages.scrollHeight
 }
}
socket.on('message',(msg)=>{
    console.log(msg)
    const html = Mustache.render(messageTemplate,{
        username:msg.username,
        msg:msg.text,
    createdAt:moment(msg.createdAt).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})
// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('clicke')
//     socket.emit('increment')
// })
socket.on('locationMessage',(message)=>{
 const html = Mustache.render(locationmessageTemplate,{
     username:message.username,
     url:message.url,
    createdAt:moment(message.createdAt).format('hh:mm a')
})
 $messages.insertAdjacentHTML('beforeend',html)
 autoscroll()
})
socket.on('roomData',({Room,users})=>{
    const html = Mustache.render(sidebarTemplate,{
        Room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
})
$messageForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    //disable form
    $messageFormButton.setAttribute('disabled','disabled')
    const message = e.target.elements.message.value
    socket.emit('sendMessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error){
          return  console.log(error)
        }
        console.log('message send',message)
    })
})
document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by browser')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
       socket.emit('sendLocation',{
           latitude:position.coords.latitude,
           longitude:position.coords.longitude
       }),()=>{
           console.log('location shared')
       }
    })
})
socket.emit('join',{username,Room},(error)=>{
    if(error){
        alert(error)
        location.href="/"
    }
})