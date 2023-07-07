const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require("mongoose").default
const AuthRoute = require('./routes/AuthRoute.js')
const UserRoute = require('./routes/UserRoute.js')
const PostRoute = require('./routes/PostRoute.js')
const UploadRoute = require('./routes/UploadRoute.js')
const ChatRoute = require('./routes/ChatRoute.js')
const MessageRoute = require('./routes/MessageRoute.js')
const CommentRoute = require('./routes/CommentRoute.js')
const SchemeRoute = require('./routes/SchemeRoutes.js')
const NotificationRoute = require('./routes/NotificationRoute.js')

const { createServer } = require('http')
const { Server } = require('socket.io')
const { MongoClient } = require('mongodb')
const path = require('path')
const UserModel = require("./models/userModel.js")
require('dotenv').config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' }, connectTimeout: 60000, pingTimeout: 60000, upgradeTimeout: 60000, transports: ['websocket'] })

// app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static(__dirname + '/build'))

app.get("/", function (req, res) {
    return res.sendFile(path.join(__dirname, "build", "index.html"))
})

app.get("/profile/:id", function (req, res) {
    return res.sendFile(path.join(__dirname, "build", "index.html"))
})

app.get("/chat", function (req, res) {
    return res.sendFile(path.join(__dirname, "build", "index.html"))
})


app.get("/chat/:id", function (req, res) {
    return res.sendFile(path.join(__dirname, "build", "index.html"))
})

app.get("/live", function (req, res) {
    return res.sendFile(path.join(__dirname, "build", "index.html"))
})



app.use('/auth', AuthRoute)
app.use('/user', UserRoute)
app.use('/posts', PostRoute)
app.use('/upload', UploadRoute)
app.use('/chat', ChatRoute)
app.use('/message', MessageRoute)
app.use('/comments', CommentRoute)
app.use('/schemes', SchemeRoute)
app.use('/notify', NotificationRoute)



// online users api

var onlineUsers = []

app.get('/onlineUsers', (req, res) => {
    // onlineUsers = _.uniqBy(onlineUsers, 'userId')
    // console.log(`online users length : ${onlineUsers.length}`)
    return res.status(200).send(onlineUsers)
})


const PORT = process.env.PORT
const CONNECTION = process.env.MONGODB_CONNECTION

console.log(`port number :: ${PORT}`)
console.log(`Mongo Db connection string :: ${CONNECTION}`)

mongoose
    .connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        const port = process.env.PORT
        httpServer.listen(port || 5000)
        console.log(`Server running on port: ${port || 5000}`)
        console.log(`Server Listening @ Port ${PORT} | Mongoose is successfully connected`)
    })
    .catch((error) => console.log(`${error} Mongodb did not connect`));






// mongodb events 

async function closeChangeStream(timeInMs = 60000, changeStream) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Closing the change stream");
            changeStream.close();
            resolve();
        }, timeInMs)
    })
}

async function monitorListingsUsingEventEmitter(client, timeInMs = 60000, pipeline = []) {
    const collection = client.db("test").collection("messages");

    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#watch for the watch() docs
    const changeStream = collection.watch(pipeline);

    // ChangeStream inherits from the Node Built-in Class EventEmitter (https://nodejs.org/dist/latest-v12.x/docs/api/events.html#events_class_eventemitter).
    // We can use EventEmitter's on() to add a listener function that will be called whenever a change occurs in the change stream.
    // See https://nodejs.org/dist/latest-v12.x/docs/api/events.html#events_emitter_on_eventname_listener for the on() docs.
    changeStream.on('change', (data) => {
        console.log(`changes detected in mongodb: ${JSON.stringify(data)}`)
        io.emit('message', data)
    })

    console.log(`listings : waiting for changes in mongodb`);

    // Wait the given amount of time and then close the change stream
    await closeChangeStream(timeInMs, changeStream);


    // keep the process alive
    // await new Promise(() => { })

}


async function mongooseEvents() {

    let uri = process.env.MONGODB_CONNECTION
    let client = new MongoClient(uri);

    try {
        await client.connect();
        const pipeline = [
            {
                '$match': {
                    'operationType': 'insert'
                }
            }
        ]

        await monitorListingsUsingEventEmitter(client, 60000 * 30, pipeline)

    } finally {
        await client.close();
    }
}








async function monitorUsersOnline(client, timeInMs = 60000, pipeline = []) {
    const collection = client.db("test").collection("users")

    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#watch for the watch() docs
    const changeStream = collection.watch(pipeline);

    // ChangeStream inherits from the Node Built-in Class EventEmitter (https://nodejs.org/dist/latest-v12.x/docs/api/events.html#events_class_eventemitter).
    // We can use EventEmitter's on() to add a listener function that will be called whenever a change occurs in the change stream.
    // See https://nodejs.org/dist/latest-v12.x/docs/api/events.html#events_emitter_on_eventname_listener for the on() docs.
    changeStream.on('change', (data) => {
        console.log(`changes detected in mongodb : users : ${JSON.stringify(data)}`)
        // io.emit('onlineUsersMongoEvent', data)
    })

    console.log(`listings : waiting for changes in mongodb`);

    // Wait the given amount of time and then close the change stream
    await closeChangeStream(timeInMs, changeStream);

    // keep the process alive
    // await new Promise(() => { })

}



const userOnlineEvent = async () => {

    let uri = process.env.MONGODB_CONNECTION
    let client = new MongoClient(uri)

    try {
        await client.connect()
        const pipeline = [
            {
                '$match': {
                    'operationType': 'update'
                }
            }
        ]

        await monitorUsersOnline(client, 60000 * 30, pipeline)

    } finally {
        await client.close()
    }
}


const ev = async () => {
    await userOnlineEvent()
}
//ev()






// socket events

var listening = false

if (!listening) {
    listening = true

    io.on('connection', (socket) => {

        console.log(`on connection : server connected to soket.io : ${socket.id} `)

        console.log(`listening`)
        socket.on('listen', async (data) => {
            if (data && Object.keys(data).length) {
                console.log(`LISTEN_EVEN :: Activate a listener for : ${JSON.stringify(data)}`)
                await mongooseEvents()
            }
        })

        socket.on('joined', async ({ userId, userName, profilePicture }) => {
            // add to online users
            // save/send online users along socket.id
            console.log(`user : ${userId} has joined`)
            onlineUsers.push({ userId: userId, socketId: socket.id, userName: userName, profilePicture: profilePicture })
            console.log(`emit online users : ${onlineUsers}`)

            await UserModel.findOneAndUpdate({ id: userId }, { online: true })
            console.log(`updated user as online succesfully`)

        })


        socket.on("disconnect", async (data) => {

            console.log(`disconnect data : ${data}`)
            console.log(`socket : ${socket.id} is disconnected`)


            var userId = false
            onlineUsers.forEach((item) => {
                console.log(`si  (${item.socketId})  === s.i(${socket.id})  or in ${data} ???`)
                if (item.socketId === socket.id) {
                    console.log(`FOUND DISCONNECTED USER : Id : ${item.userId} `)
                    userId = item.userId
                }
                return item.socketId === socket.id
            })

            if (userId) {
                await UserModel.findOneAndUpdate({ id: userId }, { online: false })

                console.log(`updated user : ${userId} as offline succesfully`)

                onlineUsers = onlineUsers.filter((item) => { return item.socketId !== socket.id })
            }

        })

    })

}







