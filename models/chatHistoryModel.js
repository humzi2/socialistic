const mongoose = require("mongoose").default

const chatHistorySchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true
        },
        chatRoomKey: {
            type: String,
            required: true
        },
        partnerId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        photo: {
            type: String,
            default: 'https://th.bing.com/th/id/R.8ecd3de4a4b57de791895330cf820509?rik=apELQREbj%2fT0oQ&riu=http%3a%2f%2fabdelzaher.cs.illinois.edu%2fimages%2fhead.png&ehk=woU2D0JqIZ5lRV4gZ9UAc69lYaKjywGalBytFcZMmyA%3d&risl=&pid=ImgRaw&r=0',
        }
    },
    {
        timestamps: true,
    }
);

const ChatHistoryModel = mongoose.model("ChatHistory", chatHistorySchema)
module.exports = ChatHistoryModel

