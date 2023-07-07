const PostModel = require ("../models/postModel.js")
const UserModel = require ("../models/userModel.js")
const mongoose = require ("mongoose")

// creating a post

 const createPost = async (req, res) => {
  try {
    console.log(`body : ${JSON.stringify(req.body)}`)
    const newPost = new PostModel(req.body)
    await newPost.save()
    return res.status(200).json(newPost)
  } catch (error) {
    console.log(`create post error:: ${error}`)
    return res.status(500).json(error)
  }
}

// get a post

 const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await PostModel.findOne({ id: id });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
}


// update post
 const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated!");
    } else {
      res.status(403).json("Authentication failed");
    }
  } catch (error) { }
};

// delete a post
 const deletePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("Post deleted.");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// like/dislike a post
 const likePost = async (req, res) => {

  const userId = req.body.userId;
  const postId = req.body.postId

  try {
    const post = await PostModel.findById(postId);
    if (post.likes.includes(userId)) {
      await post.updateOne({ $pull: { likes: userId } });
      return res.status(200).send({ success: true, message: "Post disliked" })
    } else {
      await post.updateOne({ $push: { likes: userId } });
      return res.status(200).send({ success: true, message: "Post liked" })
    }
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};


// const includesId = (commentsList) => {
//   let found = true
//   commentsList.forEach((item) => {
//     if (item.userId === id) found = true
//   })
// }

 const comment = async (req, res) => {

  const userId = req.body.userId
  const postId = req.body.postId
  const username = req.body.username
  const profilePicture = req.body.profilePicture
  const comment = req.body.comment


  try {
    const post = await PostModel.findById(postId);
    await post.updateOne({ $push: { comments: req.body } });
    return res.status(200).send({ success: true, message: "commented" })
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};





// Get timeline posts
 const getTimelinePosts = async (req, res) => {
  const userId = req.params.id
  try {
    const currentUserPosts = await PostModel.find({ userId: userId });

    const followingPosts = await UserModel.aggregate([
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
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json(
      currentUserPosts
        .concat(...followingPosts[0].followingPosts)
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
    );
  } catch (error) {
    res.status(500).json(error);
  }
}




 const timeline = async (req, res) => {


  const id = req.query.id

  console.log(`timeline of :: ${id}`)

  try {
    // get people am following 
    const me = await UserModel.findOne({ id: id })
    console.log(`me :: ${JSON.stringify(me)}`)
    const followed = me.following

    console.log(`get posts of :: ${followed}`)

    // get their posts

    const promises = followed.map(async (followedId) => {
      console.log(`ge32t posts of :: ${followedId}`)
      const posts = await PostModel.find({ userId: followedId })
      console.log(`posts of : ${followedId} :: ${posts}`)
      return posts
    })

    const p = await Promise.all(promises)
    return res.status(200).send({ success: true, posts: p.length ? p[0] : [] })

  } catch (ex) {
    return res.status(400).send({ error: ex.toString() })
  }

}


 const getMyPosts = async (req, res) => {

  const id = req.query.id

  console.log(`timeline of :: ${id}`)

  try {
    console.log(`get posts of :: ${id}`)
    const posts = await PostModel.find({ userId: id })
    console.log(`posts of : ${id} :: ${posts}`)
    return res.status(200).send({ success: true, posts: posts.length ? posts : [] })
  } catch (ex) {
    return res.status(400).send({ error: ex.toString() })
  }

}

 const test = async (req, res) => {
  return res.send({ tes: 'success' })
}

module.exports = {
  test,
  timeline,
  getMyPosts,
  getTimelinePosts,
  comment,
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost
}



