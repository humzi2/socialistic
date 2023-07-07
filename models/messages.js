const mongoose = require("mongoose").default

const MessagesModel = new mongoose.Schema(
    {
        userId: {
            type: String,
        },
        name: {
            type: String
        },
        photo: {
            type: String,
            default: 'https://th.bing.com/th/id/R.8ecd3de4a4b57de791895330cf820509?rik=apELQREbj%2fT0oQ&riu=http%3a%2f%2fabdelzaher.cs.illinois.edu%2fimages%2fhead.png&ehk=woU2D0JqIZ5lRV4gZ9UAc69lYaKjywGalBytFcZMmyA%3d&risl=&pid=ImgRaw&r=0'
        },
        liveStreamingKey: String,
    },
    {
        timestamps: true,
    }
);

const Messages = mongoose.model("Messages", MessagesModel)
module.exports = Messages
