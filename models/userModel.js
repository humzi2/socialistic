const mongoose = require("mongoose").default

const UserSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: 'https://th.bing.com/th/id/R.8ecd3de4a4b57de791895330cf820509?rik=apELQREbj%2fT0oQ&riu=http%3a%2f%2fabdelzaher.cs.illinois.edu%2fimages%2fhead.png&ehk=woU2D0JqIZ5lRV4gZ9UAc69lYaKjywGalBytFcZMmyA%3d&risl=&pid=ImgRaw&r=0'
    },
    coverPicture: {
      type: String,
      default: 'https://wallpaperaccess.com/full/246820.jpg'
    },
    about: String,
    livesIn: String,
    worksAt: String,
    relationship: String,
    country: String,
    followers: [],
    following: [],
    streamingKey: String
  },
  { timestamps: true }
)

const UserModel = mongoose.model("Users", UserSchema)
module.exports = UserModel;
