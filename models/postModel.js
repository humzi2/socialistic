const mongoose = require("mongoose").default

const postSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    profilePicture: { type: String, required: true },
    text: { type: String },
    likes: [],
    createdAt: {
      type: Date,
      default: new Date(),
    },
    images: [],
    videos: [],
    locations: [],
    comments: [],
    dates: []
  },
  {
    timestamps: true
  }
)

const PostModel = mongoose.model("Posts", postSchema);
module.exports = PostModel

