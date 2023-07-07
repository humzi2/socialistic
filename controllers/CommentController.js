const CommentModel = require("../models/commentModel.js")
const UserModel = require("../models/userModel.js")
const mongoose = require("mongoose")

// creating a comment

/*export const createComment = async (req, res) => {
  const newComment = new CommentModel(req.body);

  try {
    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    res.status(500).json(error);
  }
};*/


const createComment = async (req, res) => {
  const newComment = new CommentModel(req.body);

  try {
    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    res.status(500).json(error);
  }
};


const getComment = async (req, res) => {
  const id = req.params.id;

  try {
    const comment = await CommentModel.findById(id);
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json(error);
  }
};

// update post
const updateComment = async (req, res) => {
  const commentId = req.params.id;
  const { userId } = req.body;

  try {
    const comment = await CommentModel.findById(commentId);
    if (comment.userId === userId) {
      await comment.updateOne({ $set: req.body });
      res.status(200).json("Comment updated!");
    } else {
      res.status(403).json("Authentication failed");
    }
  } catch (error) { }
};

// delete a post
const deleteComment = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const comment = await CommentModel.findById(id);
    if (comment.userId === userId) {
      await comment.deleteOne();
      res.status(200).json("Comment deleted.");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get comments for a specific post
const getPostComments = async (req, res) => {
  const postId = req.params.postId;

  try {
    const comments = await CommentModel.find({ postId: postId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json(error);
  }
};


// like/dislike a post
const likeComment = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const comment = await CommentModel.findById(id);
    if (comment.likes.includes(userId)) {
      await comment.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Comment disliked");
    } else {
      await comment.updateOne({ $push: { likes: userId } });
      res.status(200).json("Comment liked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get timeline posts
const getTimelineComments = async (req, res) => {

  const userId = req.params.id

  try {
    const currentUserComments = await CommentModel.find({ userId: userId });

    const followingComments = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingComments",
        },
      },
      {
        $project: {
          followingComments: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json(
      currentUserComments
        .concat(...followingComments[0].followingComments)
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
    );
  } catch (error) {
    res.status(500).json(error);
  }
};



module.exports = {
  getTimelineComments,
  likeComment,
  getPostComments,
  createComment,
  getComment,
  updateComment,
  deleteComment
}