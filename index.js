var express = require("express")
var fs = require("fs");
var app = express();
var bodyParser = require("body-parser")
var http = require("http");
var scoketio = require("socket.io")
var path = require("path");
var querystring = require("querystring");
var userObj = require("./utils/usersInfo");
var messageObj = require("./utils/messageManagement");
const messageManagement = require("./utils/messageManagement");
const PORT = 3000;
const server = http.createServer(app);
var io = scoketio(server);


app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.get("/", (request, response) => {
    var fileUrl = path.join(__dirname, "public", "index.html");
    response.sendFile(fileUrl);
})
app.get("/chat", (request, response) => {
    var fileUrl = path.join(__dirname, "public", "chat.html");
    response.sendFile(fileUrl);
})
app.post("/home", (request, response) => {

    var username = request.body.username;
    var roomName = request.body.roomName;



    var temp = querystring.stringify({ username: username, roomName: roomName })
    response.redirect("/chat?" + temp)
})
//when new user joins

io.on("connection", (socket) => {

    socket.on("joinRoom", (data) => {
        
        socket.join(data.roomName);
        console.log(data);
        userObj.newUserJoin(socket.id, data.username, data.roomName)


        messageObj.getAllMessages(data.roomName, (messagesArr) => {

              socket.emit("previousMessagesShow",messagesArr)
        })
         

        socket.emit("welcomeUser", data)
        var obj = { username: data.username, message: " has joined", roomName: data.roomName }
        messageObj.postMessage(obj);
        socket.to(data.roomName).broadcast.emit("modifyUserJoinnMsg", obj);
        userObj.getAllUsers(data.roomName, (usersArr) => {
            io.to(data.roomName).emit("modifyUsersList", usersArr);
        })
            


    })
        socket.on("disconnect", () => {
            console.log("User has left")
            userObj.getUser(socket.id, (temp) => {
                if (temp) {

                    userObj.removeUser(socket.id, (result) => {
                        if (result) {

                            var obj = { username: temp.username, message: "has left the room", roomName: temp.roomName };
                            messageObj.postMessage(obj);
                            socket.to(temp.roomName).broadcast.emit("modifyUserJoinnMsg", obj);

                            userObj.getAllUsers(temp.roomName, (usersArr) => {
                                io.to(temp.roomName).emit("modifyUsersList", usersArr);
                            })


                        }

                    });



                }

            });

        })
        socket.on("message", (obj) => {

            console.log("message rcd", obj)
            messageObj.postMessage(obj);
            io.to(obj.roomName).emit("chatMessage", obj)

            
            messageObj.getAllMessages(obj.roomName, (usersArr) => {
                  console.log("huuuuuuu",usersArr)
            })

        })
    })



    server.listen(PORT, (err) => {
        if (!err) {
            console.log("server", PORT);
        }
    })