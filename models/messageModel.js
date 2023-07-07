const mongoose = require("mongoose").default

const MessageSchema = new mongoose.Schema(
  {
    chatRoomKey: {
      type: String,
      required: true
    },
    messageId: {
      type: String,
      required: true
    },
    myId: {
      type: String,
      required: true
    },
    partnerId: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    userPic: {
      type: String,
      default: 'https://th.bing.com/th/id/R.8ecd3de4a4b57de791895330cf820509?rik=apELQREbj%2fT0oQ&riu=http%3a%2f%2fabdelzaher.cs.illinois.edu%2fimages%2fhead.png&ehk=woU2D0JqIZ5lRV4gZ9UAc69lYaKjywGalBytFcZMmyA%3d&risl=&pid=ImgRaw&r=0'
    },

    liveStreamingKey:String
    
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model("Message", MessageSchema);
module.exports =  MessageModel
