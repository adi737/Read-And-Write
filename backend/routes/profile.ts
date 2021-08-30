import { ProfileData, RequestExt } from 'backend/interfaces';
import { Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import normalizeUrl from 'normalize-url';

import Profile from '../db/models/Profile';
import auth from '../middlewares/auth';
import checkObjectID from '../middlewares/checkObjectID';

const router = Router();


// @route    GET api/profile/profiles
// @desc     Get all profiles
// @access   Public
router.get('/profiles', async (_, res) => {
  try {
    const profiles = await Profile.find()
      .populate('userID', ['nick', 'avatar']).sort({ date: -1 });

    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
  }
});


// @route    GET api/profile/:id
// @desc     Get user profile by ID
// @access   Public
router.get('/:id', checkObjectID('id'), async (req, res) => {
  const { id } = req.params;
  try {
    const profile = await Profile.findById(id)
      .populate('userID', ['nick', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: `Profile not found` });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
  }
  return;
});


// @route    GET api/profile
// @desc     Get your profile
// @access   Private
router.get('/', auth, async (req: RequestExt, res) => {
  try {
    const { userID } = req.user!;
    const profile = await Profile.findOne({ userID })
      .populate('userID', ['nick', 'avatar']);

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
  }
  return;
});


// @route    POST api/profile
// @desc     Create user profile
// @access   Private
router.post('/',
  [
    auth,
    [
      body('status', `Field "status" can't be empty`)
        .trim().notEmpty(),
      body('skills', `Field "skills" can't be empty, and can contain up to 8 skills`)
        .trim().notEmpty()
        .custom((value) =>
          value.split(',').map((skill: string) => skill.trim()).length > 8 ? false : true
        )
    ] as any
  ], async (req: RequestExt, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const {
      name,
      company,
      location,
      status,
      skills,
      bio,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram
    } = req.body;

    const social: any = {
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram
    }

    for (const website in social) {
      social[website] && social[website].trim() !== '' ?
        social[website] = normalizeUrl(social[website],
          { forceHttps: true })
        :
        social[website] = undefined;
    }

    const { userID } = req.user!;

    const dataFields = {
      userID,
      name,
      company,
      location,
      status,
      skills: Array.isArray(skills) ?
        skills
        :
        skills.split(',').map((skill: string) => skill.trim()),
      bio,
      youtube: social.youtube,
      twitter: social.twitter,
      facebook: social.facebook,
      linkedin: social.linkedin,
      instagram: social.instagram
    }

    try {
      let profile = await Profile.findOne({ userID });

      if (profile) {
        return res.status(400).json({ msg: 'Profile already exist' });
      }

      profile = new Profile(dataFields);
      await profile.save();
      profile = await Profile.findOne({ userID }).populate('userID', ['nick', 'avatar']);

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
    return;
  });


// @route    PATCH api/profile
// @desc     Update user profile
// @access   Private
router.patch('/', auth, async (req: RequestExt, res) => {
  const { userID } = req.user!;

  try {
    let profile = await Profile.findOne({ userID });

    if (!profile) {
      return res.status(400).json({ msg: `Profile does not exist` });
    }

    if (req.body.hasOwnProperty('status') && req.body.status.trim() === '') {
      return res.status(422).json(({
        errors: [{
          param: 'status',
          msg: `Field "status" can't be empty`
        }]
      }));
    }

    if (req.body.hasOwnProperty('skills') && req.body.skills.trim() === '') {
      return res.status(422).json(({
        errors: [{
          param: 'skills',
          msg: `Field "skills" can't be empty`
        }]
      }));
    }

    if (req.body.hasOwnProperty('skills')) {
      req.body.skills = req.body.skills.split(',')
      req.body.skills = req.body.skills.map((skill: string) => skill.trim());

      if (req.body.skills.length > 8) {
        return res.status(422).json(({
          errors: [{
            param: 'skills',
            msg: `You can add up to maximum 8 skills`
          }]
        }));
      }
    }

    const {
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram
    } = req.body;

    req.body.hasOwnProperty('youtube') && youtube && youtube?.trim() !== '' ?
      req.body.youtube = normalizeUrl(youtube, { forceHttps: true }) :
      req.body.youtube = undefined;

    req.body.hasOwnProperty('twitter') && twitter && twitter?.trim() !== '' ?
      req.body.twitter = normalizeUrl(twitter, { forceHttps: true }) :
      req.body.twitter = undefined;

    req.body.hasOwnProperty('facebook') && facebook && facebook?.trim() !== '' ?
      req.body.facebook = normalizeUrl(facebook, { forceHttps: true }) :
      req.body.facebook = undefined;

    req.body.hasOwnProperty('linkedin') && linkedin && linkedin?.trim() !== '' ?
      req.body.linkedin = normalizeUrl(linkedin, { forceHttps: true }) :
      req.body.linkedin = undefined;

    req.body.hasOwnProperty('instagram') && instagram && instagram?.trim() !== '' ?
      req.body.instagram = normalizeUrl(instagram, { forceHttps: true }) :
      req.body.instagram = undefined;

    profile = await Profile.findOneAndUpdate({ userID }, req.body, {
      new: true,
      useFindAndModify: false
    })
      .populate('userID', ['nick', 'avatar']);

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
  }
  return;
});


// @route    POST api/profile/education
// @desc     Add education to user profile
// @access   Private
router.post('/education',
  [
    auth,
    [
      body('school', `Field "school" is required`).trim().notEmpty(),
      body('from', `Field "from" can't be empty and has to be from the past`)
        .trim().notEmpty()
        .custom(value =>
          Number(new Date(value)) < Number(new Date()) ?
            true : false),
      body('to', `Field "to" has to be from the past and has to have later date than "from"`)
        .custom((value, { req }) =>
          req.body.to ? value > req.body.from &&
            Number(new Date(value)) < Number(new Date()) : true)
    ] as any
  ], async (req: RequestExt, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;


    const education: {
      id?: string
      school: string,
      degree: string,
      fieldofstudy: string,
      from: string,
      to: string,
      current: boolean,
      description: string
    } = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    }


    try {
      const { userID } = req.user!;
      const profile: ProfileData | null = await Profile.findOne({ userID })
        .populate('userID', ['nick', 'avatar']);

      if (!profile) {
        return res.status(400).json({ msg: 'Profile does not exist' });
      }

      !education.to ?
        education.current = true
        :
        education.current = false

      profile.education!.unshift(education);
      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.send('server error');
    }
    return;
  });


// @route    DELETE api/profile/education/:id
// @desc     Delete education from user profile
// @access   Private
router.delete('/education/:id',
  [
    checkObjectID('id'),
    auth
  ], async (req: RequestExt, res: Response) => {
    const { userID } = req.user!;
    try {
      const profile: ProfileData | null = await Profile.findOne({ userID })
        .populate('userID', ['nick', 'avatar']);

      if (!profile) {
        return res.status(400).json({ msg: 'Profile does not exist' });
      }

      profile.education = profile.education!.filter(edu =>
        edu.id !== req.params.id
      );

      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
    return;
  });


// @route    POST api/profile/experience
// @desc     Add experience to user profile
// @access   Private
router.post('/experience',
  [
    auth,
    [
      body('position', `Field "position" can't be empty`).trim().notEmpty(),
      body('company', `Field "company" can't be empty`).trim().notEmpty(),
      body('location', `Field "location" can't be empty`).trim().notEmpty(),
      body('from', `Field "from" can't be empty and has to be from the past`)
        .trim().notEmpty()
        .custom(value =>
          Number(new Date(value)) < Number(new Date()) ?
            true : false),
      body('to', `Field "to" has to be from the past and has to have later date than "from"`)
        .custom((value, { req }) =>
          req.body.to ? value > req.body.from &&
            Number(new Date(value)) < Number(new Date()) : true)
    ] as any
  ], async (req: RequestExt, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const {
      position,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;


    const experience = {
      position,
      company,
      location,
      from,
      to,
      current,
      description
    }


    try {
      const { userID } = req.user!;
      const profile: ProfileData | null = await Profile.findOne({ userID })
        .populate('userID', ['nick', 'avatar']);

      if (!profile) {
        return res.status(400).json({ msg: 'Profile does not exist' });
      }

      !experience.to ?
        experience.current = true
        :
        experience.current = false

      profile.experience!.unshift(experience);

      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.send('server error');
    }
    return;
  });


// @route    DELETE api/profile/experience/:id
// @desc     Delete experience from user profile
// @access   Private
router.delete('/experience/:id',
  [
    checkObjectID('id'),
    auth
  ], async (req: RequestExt, res: Response) => {
    const { userID } = req.user!;
    try {
      const profile: ProfileData | null = await Profile.findOne({ userID })
        .populate('userID', ['nick', 'avatar']);

      if (!profile) {
        return res.status(400).json({ msg: 'Profile does not exist' });
      }

      profile.experience = profile.experience!.filter(exp =>
        exp.id !== req.params.id
      );

      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
    return;
  });


// @route    DELETE api/profile
// @desc     Delete user profile
// @access   Private
router.delete('/', auth, async (req: RequestExt, res) => {
  const { userID } = req.user!;
  try {
    const deletedProfile = await Profile.findOneAndDelete({ userID });
    res.json(deletedProfile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
  }
});


export default router;