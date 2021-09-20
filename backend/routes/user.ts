import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';
import normalizeUrl from 'normalize-url';
import nodemailer from 'nodemailer';

import auth from '../middlewares/auth';
import User from '../db/models/User';
import Profile from '../db/models/Profile'
import Article from '../db/models/Article';
import { DecodedData, RequestExt, UserData } from 'backend/interfaces';

const router = Router();

// @route    GET api/user
// @desc     Get user data by ID
// @access   Private
router.get('/', auth, async (req: RequestExt, res) => {
  try {
    const user = await User.findById(req.user?.userID).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/user/:token
// @desc     Activate the account
// @access   Public
router.get('/:token', (req, res) => {
  const { token } = req.params;
  const secret = process.env.SECRET_ACTIVATE!;

  jwt.verify(token, secret, async (err, decoded) => {
    try {
      if (err) {
        return res.status(400).json({
          msg: 'Activation link has expired'
        });
      }

      const { email, password, nick, avatar } = decoded as UserData

      let user: UserData | null = await User.findOne({ $or: [{ email }, { nick }] });

      if (user) {
        return res.status(422).json(({
          msg: 'User already exist'
        }));
      }

      user = new User({
        email,
        nick,
        password,
        avatar
      });

      await user.save();

      const appURL = process.env.APP_URL;

      return res.redirect(`${appURL}/accountMessage`);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
  });
});

// @route    GET api/user/reset/:token
// @desc     Redirect and pass token to reset password
// @access   Public
router.get('/reset/:token', (req, res) => {
  const { token } = req.params;
  const appURL = process.env.APP_URL;
  res.redirect(`${appURL}/reset/${token}`);
});

// @route    POST api/user/register
// @desc     Register user
// @access   Public
router.post('/register',
  [
    body('email', 'Include valid email').isEmail(),
    body('nick', 'Nickname length should contain between 4 and 15 characters and has to be lowercase')
      .isLowercase().trim().isLength({ min: 4, max: 15 }),
    body("password", "Password has to include at least 8 characters, one lowercase character, one uppercase character, one digit and one special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
    body('repassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Input the same password twice');
      }
      return true;
    })
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, nick, password } = req.body;

    try {
      const user: UserData | null = await User.findOne({ $or: [{ email }, { nick }] });

      if (user && user.email === email) {
        return res.status(422).json(({
          errors:
            [{ param: 'email', msg: 'Email already exist' }]
        }));
      }

      if (user && user.nick === nick) {
        return res.status(422).json(({
          errors:
            [{ param: 'nick', msg: 'Nickname already exist' }]
        }));
      }

      const avatar = normalizeUrl(gravatar.url(email, { protocol: 'https' }), { forceHttps: true });

      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(password, saltRounds);

      const payload = {
        email,
        password: hashPassword,
        nick,
        avatar
      }

      const secret = process.env.SECRET_ACTIVATE!;

      const token = jwt.sign(payload, secret, { expiresIn: 600 });

      const appURL = process.env.APP_URL;
      const userEmail = process.env.EMAIL;
      const pass = process.env.PASSWORD;


      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: userEmail,
          pass
        }
      });

      await transporter.sendMail({
        from: '"Read&Write👻" <foo@example.com>', // sender address
        to: `${email}`, // receiver
        subject: "Active your account", // Subject line
        html: `
          <b>
            Link to activate the account: 
          </b>
          <a href="${appURL}/api/user/${token}">
            ${appURL}/accountMessage
          </a>
          `, // html body
      });

      res.json({ msg: 'User registered' });

    } catch (error) {
      console.error(error.message);
      res.status(500).send(error);
    }
    return;
  });

// @route    POST api/user/login
// @desc     Login user
// @access   Public
router.post('/login',
  [
    body('email', 'Include valid email').isEmail(),
    body("password", "Password has to include at least 8 characters, one lowercase character, one uppercase character, one digit and one special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user: UserData | null = await User.findOne({ email });

      if (!user) {
        return res.status(401).json(({
          errors:
            [{ param: 'invalid', msg: 'Invalid credentials' }]
        }));
      }

      const isValidPassword = await bcrypt.compare(password, user.password!);

      if (!isValidPassword) {
        return res.status(401).json(({
          errors:
            [{ param: 'invalid', msg: 'Invalid credentials' }]
        }));
      }

      const userID = user.id;

      const payload = { userID };
      const secret = process.env.SECRET_LOGIN!;

      const token = jwt.sign(payload, secret, { expiresIn: "15h" });

      res.json({ token, userID });

    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
    return;
  });

// @route    POST api/user/send
// @desc     Send email
// @access   Public
router.post('/send', body('email', 'Include valid email').isEmail(),
  async (req, res) => {
    const { email } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(422).json(({
          errors:
            [{ param: 'email', msg: 'There is no such user' }]
        }));
      }

      const payload = {
        userID: user.id
      }
      const secret = process.env.SECRET_RESET!;

      const token = jwt.sign(payload, secret, { expiresIn: 600 });

      const appURL = process.env.APP_URL;
      const userEmail = process.env.EMAIL;
      const pass = process.env.PASSWORD;

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: userEmail,
          pass
        }
      });

      await transporter.sendMail({
        from: '"Read&Write👻" <foo@example.com>', // sender address
        to: `${email}`, // receiver
        subject: "Reset your password", // Subject line
        html: `
        <b>
          Link to reset the password: 
        </b>
        <a href="${appURL}/api/user/reset/${token}">
          ${appURL}/reset/${token}
        </a>
        `, // html body
      });

      res.json({ msg: 'Email has been sent' });

    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
    return;
  });

// @route    PATCH api/user/reset/:token
// @desc     Reset password
// @access   Public
router.patch('/reset/:token',
  [
    body("password", "Password has to include at least 8 characters, one lowercase character, one uppercase character, one digit and one special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
    body('repassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Input the same password twice');
      }
      return true;
    })
  ], async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { password } = req.body;
    const { token } = req.params;
    const secret = process.env.SECRET_RESET!;

    jwt.verify(token, secret, async (err, decoded: DecodedData | undefined) => {
      if (err) {
        return res.status(422).json(({
          errors:
            [{
              param: 'repassword',
              msg: 'Password change link has expired'
            }]
        }));
      }

      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(password, saltRounds);

      const { userID }: DecodedData = decoded!;

      try {
        await User.findByIdAndUpdate(userID, { password: hashPassword }, {
          useFindAndModify: false
        });

        res.json({ msg: 'Password has been changed' });

      } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
      }
      return;
    });
    return;
  });

// @route    PATCH api/user/reset
// @desc     Change password
// @access   Private
router.patch('/change',
  [
    auth,
    [
      body("password", "Password has to include at least 8 characters, one lowercase character, one uppercase character, one digit and one special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
      body("newPassword", "Password has to include at least 8 characters, one lowercase character, one uppercase character, one digit and one special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
      body('newRepassword').custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Input the same password twice');
        }
        return true;
      })
    ] as any
  ], async (req: RequestExt, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { userID } = req.user!;
    const { password } = req.body;
    const { newPassword } = req.body;

    try {
      const user: UserData | null = await User.findById(userID);

      const isValidPassword = await bcrypt.compare(password, user!.password!);

      if (!isValidPassword) {
        return res.status(422).json(({
          errors:
            [{ param: 'password', msg: `To set a new password, first you have to enter your current one` }]
        }));
      }

      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(newPassword, saltRounds);

      user!.password = hashPassword;
      await user!.save();

      res.json({ msg: 'Password has been changed' });

    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
    return;
  });

// @route    DELETE api/user
// @desc     Delete user account
// @access   Private
router.delete('/', auth, async (req: RequestExt, res) => {
  const { userID } = req.user!;
  try {
    await Profile.findOneAndDelete({ userID });
    await Article.deleteMany({ userID });
    await User.findOneAndDelete({ _id: userID });
    res.json({ msg: 'User account has been deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
  }
});

export default router;