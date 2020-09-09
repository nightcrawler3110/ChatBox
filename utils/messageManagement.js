var fs = require('fs');
const { timeStamp } = require('console');
var mongoClient=require("mongodb").MongoClient;
var messagesArr=[];
function postMessage(obj)
 {
    mongoClient.connect("mongodb://localhost:27017/", (err, dbHost)=>{

        if(err)
        {
            console.log("Error connecting to the server");
        }
        else
        {
            var db = dbHost.db("slDb");
            db.collection("messages", (err, coll)=>{
                if(err)
                {
                    console.log("Error connecting to the collection");
                }
                else
                {
                   
                    
                //     if(obj.roomName=="angular")
                //     {
                //     fs.appendFile('./public/angular.txt',`${obj.username}: ${obj.message} \n `,(err)=>{
                //         if(err)
                //         console.log(err);
                //     })
                //    } 
                //    if(obj.roomName=="vue")
                //     {
                //     fs.appendFile('./public/vue.txt',`${obj.username}: ${obj.message} \n `,(err)=>{
                //         if(err)
                //         console.log(err);
                //     })
                //    } 
                //    if(obj.roomName=="react")
                //     {
                //     fs.appendFile('./public/react.txt',`${obj.username}: ${obj.message} \n `,(err)=>{
                //         if(err)
                //         console.log(err);
                //     })
                //    } 
                //    if(obj.roomName=="nodejs")
                //     {
                //     fs.appendFile('./public/nodejs.txt',`${obj.username}: ${obj.message} \n `,(err)=>{
                //         if(err)
                //         console.log(err);
                //     })
                //    } 

                fs.appendFile('./public/chatStore.txt',`${obj.username}: ${obj.message} \n `,(err)=>{
                            if(err)
                         console.log(err);
                })






                    coll.insertOne(obj);
                    
                }
            })
        }
    
    });


 }
 function getAllMessages(roomName,returnResult)
 {
    mongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, (err, dbHost) => { 

        if (err) {
            console.log("error connecting to server")

        }
        else {
            var db = dbHost.db("slDb")
            db.collection("messages", (err, coll) => {
                if (err) {
                    console.log("error in collection")
                returnResult([]);
                }
                else {
                    coll.find({roomName:roomName}).toArray((err,dataArr)=>
                    {
                        if(err)
                        {
                            console.log("error in finding users");
                            returnResult([]);
                        }
                        else
                        {
                           return returnResult(dataArr)
                        }
                    })
                        
                }
            })
        }
    })
    
 }
 module.exports={postMessage,getAllMessages}