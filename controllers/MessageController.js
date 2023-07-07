const MessageModel = require("../models/messageModel.js")

const addMessage = async (req, res) => {
  const { chatRoomKey, myId, partnerId, messageId, text, userPic, liveStreamingKey } = req.body

  const message = new MessageModel({
    chatRoomKey,
    messageId,
    myId,
    partnerId,
    text,
    userPic,
    liveStreamingKey
  })

  try {
    const result = await message.save()
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json(error)
  }
}




const getMessages = async (req, res) => {
  const { chatRoomKey } = req.params;
  console.log(`key : ${chatRoomKey}`)

  if (!chatRoomKey) return res.status(400).send({ error: 'chatRoomKey is missing' })

  try {
    const result = await MessageModel.find({ chatRoomKey });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
}



module.exports = {
  getMessages,
  addMessage
}
