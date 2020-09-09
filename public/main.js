var chatForm=document.getElementById("chatForm")
var chatMessage=document.getElementById("txtChatMessage");
var userObj=Qs.parse(location.search,{ignoreQueryPrefix:true});;
 var participantsList =document.getElementById("participantsList")
 const messageContainer=document.querySelector('.msgBox')




 var audio = new Audio('sound2.mp3');
var frontUserName = document.getElementById("username");
var frontRoomName = document.getElementById("roomName");
const append=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    
     audio.play();
    
    }



var username=userObj.username;
var roomName=userObj.roomName
  const socket=io();
 socket.emit("joinRoom",{username:username,roomName:roomName});



 //try

socket.on("previousMessagesShow",(messagesArr)=>{



    for(i=0; i<messagesArr.length;i++)
    {
      if(messagesArr[i].username==username)  
    append(`${messagesArr[i].username}: ${messagesArr[i].message}`,'right');
    else
    append(`${messagesArr[i].username}: ${messagesArr[i].message}`,'left');

    messageContainer.scrollTo(0,messageContainer.scrollHeight)

    }
     

})


 //tryend
  
socket.on("welcomeUser",(data)=>{
    frontUserName.innerHTML += data.username;
    frontRoomName.innerHTML += data.roomName;
})
function chatMessageEventHandler()
{      
    console.log(chatMessage.value)
     socket.emit("message",{message:chatMessage.value,username:username,roomName:roomName})
     chatMessage.value="";
} 

socket.on("chatMessage",(obj)=>
{
    if(obj.username==username)
    append(`${obj.username}:  ${obj.message}`,'right');

    else
    append(`${obj.username}:  ${obj.message}`, 'left');
  messageContainer.scrollTo(0,messageContainer.scrollHeight)
    
})

socket.on("modifyUserJoinnMsg",(obj)=>{
    append(`${obj.username}  ${obj.message}`,'left');
})
 
socket.on("modifyUsersList", (usersArr)=>{
    participantsList.innerHTML="";
    console.log(usersArr)
    for(var i=0; i<usersArr.length; i++)
    {
        
        var liElement = document.createElement("li");
        var user = usersArr[i].username;
        var liTextNode = document.createTextNode(user);
        liElement.appendChild(liTextNode);
        participantsList.appendChild(liElement);
    }
})
    
 
