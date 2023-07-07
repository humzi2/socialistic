const UserModel = require("../models/userModel.js")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

// Get a User
const getUser = async (req, res) => {

  const id = req.params.id;

  console.log(`user id : ${id}`);
  try {
    const cursor = await UserModel.find()
    const count = await UserModel.countDocuments()

    console.log(`count : ${count}, type:${typeof (count)}`)

    var list = []
    if (count >= 1) {
      cursor.forEach((item) => {
        if (item.id.toLowerCase().includes(id.toLowerCase())) list.push(item)
      })
    }

    return res.status(200).send({ user: list[0] })

  } catch (ex) {
    console.log(`get key : error : ${ex}`)
    return res.status(404).send({ error: `No users matching ${name} have been found` })
  }

}


const getUserByDocId = async (req, res) => {

  const id = req.query.id

  console.log(`userByDocId : id : ${id}`)

  try {
    const user = await UserModel.findById(id)

    console.log(`user : ${JSON.stringify(user)}`)

    return res.status(200).send(user)

  } catch (ex) {
    console.log(`get key : error : ${ex}`)
    return res.status(404).send({ error: `No users matching ${id} have been found` })
  }

}


const getAllUsers = async (req, res) => {

  try {
    let users = await UserModel.find();
    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc
      return otherDetails
    })
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

// udpate a user

const updateUser = async (req, res) => {
  const id = req.params.id;
  // console.log("Data Received", req.body)
  const { _id, currentUserAdmin, password } = req.body;

  if (id === _id) {
    try {
      // if we also have to update password then password will be bcrypted again
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      // have to change this
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWTKEY,
        { expiresIn: "1h" }
      );
      console.log({ user, token })
      res.status(200).json({ user, token });
    } catch (error) {
      console.log("Error agya hy")
      res.status(500).json(error);
    }
  } else {
    res
      .status(403)
      .json("Access Denied! You can update only your own Account.");
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const id = req.params.id;

  const { currentUserId, currentUserAdmin } = req.body;

  if (currentUserId == id || currentUserAdmin) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User Deleted Successfully!");
    } catch (error) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Access Denied!");
  }
};

// Follow a User
// changed
const followUser = async (req, res) => {

  const followId = req.body.follow
  const myId = req.body.myId

  try {
    const followUser = await UserModel.findOne({ id: followId })
    const me = await UserModel.findOne({ id: myId })

    console.log(`me : ${JSON.stringify(me)}`)
    console.log(`follow user : ${JSON.stringify(followUser)}`)

    if (!followUser.followers.includes(myId)) {
      await followUser.updateOne({ $push: { followers: myId } });
      await me.updateOne({ $push: { following: followId } });
      return res.status(200).send({ success: true, following: followUser })
    } else {
      return res.status(403).send("you are already following this id");
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
}

// Unfollow a User
// changed
const unfollowUser = async (req, res) => {

  const unfollowId = req.body.unfollow
  const myId = req.body.myId

  try {
    const unFollowUser = await UserModel.findOne({ id: unfollowId })
    const me = await UserModel.findOne({ id: myId })

    if (unFollowUser.followers.includes(myId)) {
      await unFollowUser.updateOne({ $pull: { followers: myId } })
      await me.updateOne({ $pull: { following: unfollowId } })
      return res.status(200).send({ success: true, message: "Unfollowed Successfully!" })
    }
    else {
      return res.status(403).send({ error: "You are not following this User" })
    }
  } catch (error) {
    console.log(`error : ${error}`);
    return res.status(500).send(error)
  }
}














const queryUser = async (req, res) => {

  console.log(`query user`)

  const name = req.params.name

  try {
    const cursor = await UserModel.find()
    const count = await UserModel.countDocuments()

    console.log(`count : ${count}, type:${typeof (count)}`)

    var list = []
    if (count >= 1) {
      cursor.forEach((item) => {
        if (item.username.toLowerCase().includes(name.toLowerCase())) list.push(item)
      })
    }

    return res.status(200).send({ users: list })

  } catch (ex) {
    console.log(`get key : error : ${ex}`)
    return res.status(404).send({ error: `No users matching ${name} have been found` })
  }

}


const update = async (req, res) => {

  const id = req.body.id

  console.log(`user update :  id : ${id} `)

  if (!id) return res.status(400).send({ error: "user id not supplied" })

  try {
    const updated = await UserModel.findOneAndUpdate({ id: id }, { ...req.body })

    console.log(`user : update : successfully updated : ${updated}`);

    return res.status(200).send({ success: true, ...updated })

  } catch (ex) {
    console.log(`error updating pic : ${ex.toString()}`)
    return res.status(400).send({ error: ex.toString() })
  }
}


const sendStreamingKey = async (req, res) => {
  const key = req.body.streamingKey
  if (!key) return res.status(400).send({ error: 'missing key' })
  if (!req.body.id) return res.status(400).send({ error: 'missing user id' })

  const updated = await UserModel.find({ id: req.body.id }).update({ streamingKey: key })
  return res.status(200).send({ success: true, streamingKey: req.body.streamingKey })

}



module.exports = {
  sendStreamingKey,
  update,
  queryUser,
  followUser,
  unfollowUser,
  getUser,
  getAllUsers,
  deleteUser,
  getUserByDocId
}