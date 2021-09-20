import Conversation from "../db/models/Conversation";
import auth from "../middlewares/auth";
import { Router, Response } from "express";
import { RequestExt } from "backend/interfaces";
import Message from "../db/models/Message";
import checkObjectID from "../middlewares/checkObjectID";
import { body, validationResult } from "express-validator";

const router = Router();

// @route    GET api/messenger/:id
// @desc     Get all messages
// @access   Private
router.get('/:id',
  [
    checkObjectID('id'),
    auth,
  ], async (req: RequestExt, res: Response) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.id
      }).populate('userID', ['nick', 'avatar']);

      return res.json(messages);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
    return;
  });


// @route    GET api/messenger
// @desc     Get all user conversations
// @access   Private
router.get('/', auth, async (req: RequestExt, res: Response) => {
  const { userID } = req.user!;
  try {
    const conversations = await Conversation.find({
      userID
    }).populate('memberId', ['nick', 'avatar']);

    return res.json(conversations);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
  }
  return;
});


// @route    POST api/messenger/:id
// @desc     Add message
// @access   Private
router.post('/:id',
  [
    checkObjectID('id'),
    auth,
    body('text', 'Text is required').trim().notEmpty(),
  ], async (req: RequestExt, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { userID } = req.user!;

    try {
      let conversation = await Conversation.findOne({
        userID,
        memberId: req.params.id
      });

      if (!conversation) {
        conversation = await new Conversation({
          userID,
          memberId: req.params.id
        }).save()
      }

      const message = await new Message({
        userID,
        conversationId: conversation.id,
        text: req.body.text
      }).save();

      const newMessage = await Message.findById(message.id)
        .populate('userID', ['nick', 'avatar']);

      return res.json(newMessage);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
    return;
  });


// @route    DELETE api/messenger/:id
// @desc     Delete message
// @access   Private
router.delete('/:id',
  [
    checkObjectID('id'),
    auth
  ], async (req: RequestExt, res: Response) => {
    try {
      const message = await Message.findByIdAndDelete(req.params.id, {
        useFindAndModify: false
      });

      return res.json(message);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
    return;
  });


// @route    PUT api/messenger/:id
// @desc     Update message
// @access   Private
router.put('/:id',
  [
    checkObjectID('id'),
    auth,
    body('text', 'Text is required').trim().notEmpty()
  ], async (req: RequestExt, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const message = await Message.findByIdAndUpdate(req.params.id, {
        text: req.body.text
      }, { new: true, useFindAndModify: false })
        .populate('userID', ['nick', 'avatar']);

      return res.json(message);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
    return;
  });


export default router;