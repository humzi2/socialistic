const mongoose = require("mongoose").default

const commentSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    postId: { type: String, required: true },
    desc: { type: String, required: true },
    likes: { type: [String], default: [] },
    //comments: { type: [mongoose.Types.ObjectId], ref: 'Comment', default: [] }
  },
  //{ collection: "comments" }, // Nom de la collection dans MongoDB 
  {
    timestamps: true
  }
);

const commentModel = mongoose.model("Comment", commentSchema);
module.exports = commentModel;
