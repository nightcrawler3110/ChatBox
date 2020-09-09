
var mongoClient = require("mongodb").MongoClient




const users = [];
function newUserJoin(id, username, roomName) 
{
     var user = { id, username, roomName };
    // users.push(user);
    mongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, (err, dbHost) => {
        if (err) {
            console.log("error connecting to server")

        }
        else {
            var db = dbHost.db("slDb")
            db.collection("users", (err, coll) => {
                if (err) {
                    console.log("error in collectn")
                }
                else {
                    coll.insertOne(user)
                }
            })
        }
    })
}


function getAllUsers(roomName,returnResult) {

    mongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, (err, dbHost) => { 

        if (err) {
            console.log("error connecting to server")

        }
        else {
            var db = dbHost.db("slDb")
            db.collection("users", (err, coll) => {
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
function getUser(id,callback) {
    console.log("get user function running")
    mongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, (err, dbHost) => { 

        if (err) {
            console.log("error connecting to server")

        }
        else {
            var db = dbHost.db("slDb")
            db.collection("users", (err, coll) => {
                if (err) {
                    console.log("error in collectn")
                }
                else {
                    coll.findOne({ id: id }, (err, result) => {
                        if (err) {
                            console.log("error in finding");
                        }
                        else {
                            
                             return callback(result);
                        }
                    })
                }
            })
        }
    })
 





    // var pos = users.findIndex(item=>item.id==id)
    // if(pos>=0)
    // {
    //     return users[pos];
    // }
    // else
    // {
    //     return null;
    // }



}
function removeUser(id,callback) {
    // var pos = users.findIndex(item=>item.id==id)
    // if(pos>=0)
    // {
    //             users.splice(pos,1);
    // }



    mongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, (err, dbHost) => {
        if (err) {
            console.log("error connecting to server")

        }
        else {
            var db = dbHost.db("slDb")
            db.collection("users", (err, coll) => {
                if (err) {
                    console.log("error in collectn")
                }
                else {
                    coll.deleteOne({ id: id }, (err, result) => {
                        console.log("deleted", result)
                        if (err) {
                            console.log("error in deleting")
                        }
                        else {
                            if (result.deletedCount == 1) {
                                return callback(true);
                            }
                            else {
                                return callback(false);
                            }
                        }
                    })
                }
            })
        }
    })
}
module.exports = { newUserJoin, getAllUsers, getUser, removeUser }