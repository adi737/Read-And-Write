import { ArticleData, RequestExt } from 'backend/interfaces';
import { Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

import Article from '../db/models/Article';
import auth from '../middlewares/auth';
import checkObjectID from '../middlewares/checkObjectID';

const router = Router();

// @route    GET api/article/articles
// @desc     Get all articles
// @access   Public
router.get('/articles', async (_, res) => {
  try {
    const articles = await Article.find()
      .populate('userID', ['nick', 'avatar']).sort({ date: -1 });

    res.json(articles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
  }
});


// @route    GET api/article/:id
// @desc     Get article by ID
// @access   Public
router.get('/:id', checkObjectID('id'), async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('comments.userID', ['nick', 'avatar']).sort({ date: -1 });

    if (!article) {
      return res.status(404).json({ msg: 'Article not found' })
    }

    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server Error');
  }
  return;
});


// @route    GET api/article
// @desc     Get your articles
// @access   Private
router.get('/', auth, async (req: RequestExt, res) => {
  const { userID } = req.user!;
  try {
    const articles = await Article.find({ userID }).sort({ date: -1 });

    res.json(articles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
  }

});


// @route    POST api/article
// @desc     Create article
// @access   Private
router.post('/',
  [
    auth,
    [
      body('topic', 'Topic is required').trim().notEmpty(),
      body('intro', 'Intro is required').trim().notEmpty(),
      body('description', 'Description is required').trim().notEmpty()
    ] as any
  ], async (req: RequestExt, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const {
      topic,
      intro,
      description
    } = req.body;

    const { userID } = req.user!;

    try {
      let article = new Article({
        userID,
        topic,
        intro,
        description,
      });

      article = await article.save();

      res.json(article);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
    return;
  });


// @route    PUT api/article/:id
// @desc     Update article
// @access   Private
router.put('/:id',
  [
    checkObjectID('id'),
    auth,
    [
      body('topic', 'Topic is required').trim().notEmpty(),
      body('intro', 'Intro is required').trim().notEmpty(),
      body('description', 'Description is required').trim().notEmpty()
    ] as any
  ], async (req: RequestExt, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const {
      topic,
      intro,
      description
    } = req.body;

    const { userID } = req.user!;
    const { id } = req.params;

    try {
      let article: ArticleData | null = await Article.findById(id);

      if (String(article!.userID) !== userID) {
        return res.status(401).json(({
          errors:
            [{ param: "article", msg: "you can't edit an article you haven't written" }]
        }));
      }

      article = await Article.findByIdAndUpdate(id, {
        userID,
        topic,
        intro,
        description,
      }, {
        new: true,
        useFindAndModify: false
      });

      if (!article) {
        return res.status(400).json({ msg: 'Article does not exist' });
      }

      res.json(article);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
    return;
  });


// @route    POST api/article/like/:id
// @desc     Like article
// @access   Private
router.post('/like/:id',
  [
    checkObjectID('id'),
    auth
  ], async (req: RequestExt, res: Response) => {
    const { userID } = req.user!;
    const { id } = req.params;
    try {
      const article: ArticleData | null = await Article.findById(id)
        .populate('comments.userID', ['nick', 'avatar']);


      if (!article) {
        return res.status(400).json({ msg: 'Article not found' });
      }

      // Check if the article has already been disliked
      const isDisliked = article.dislikes!.some(dislike =>
        String(dislike.userID) === userID
      );

      if (isDisliked) {
        article.dislikes = article.dislikes!.filter(dislike =>
          String(dislike.userID) !== userID
        );
      }
      //

      // Check if the article has already been liked
      const isLiked = article.likes!.some(like =>
        String(like.userID) === userID
      );

      if (isLiked) {
        article.likes = article.likes!.filter(like =>
          String(like.userID) !== userID
        );
      } else {
        article.likes!.unshift({ userID });
      }
      //

      await article.save();

      res.json(article);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
    return;
  });


// @route    POST api/article/dislike/:id
// @desc     Dislike article
// @access   Private
router.post('/dislike/:id',
  [
    checkObjectID('id'),
    auth
  ], async (req: RequestExt, res: Response) => {
    const { userID } = req.user!;
    const { id } = req.params;
    try {
      const article: ArticleData | null = await Article.findById(id)
        .populate('comments.userID', ['nick', 'avatar']);

      if (!article) {
        return res.status(400).json({ msg: 'Article not found' });
      }

      // Check if the article has already been liked
      const isLiked = article.likes!.some(like =>
        String(like.userID) === userID
      );

      if (isLiked) {
        article.likes = article.likes!.filter(like =>
          String(like.userID) !== userID
        );
      }
      //

      // Check if the article has already been disliked
      const isDisliked = article.dislikes!.some(dislike =>
        String(dislike.userID) === userID
      );

      if (isDisliked) {
        article.dislikes = article.dislikes!.filter(like =>
          String(like.userID) !== userID
        );
      } else {
        article.dislikes!.unshift({ userID });
      }
      //

      await article.save();

      res.json(article);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
    return;
  });


// @route    POST api/article/comment/:id
// @desc     Comment article
// @access   Private
router.post('/comment/:id',
  [
    checkObjectID('id'),
    auth,
    body('text', 'This field can not be empty').trim().notEmpty()
  ], async (req: RequestExt, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { userID } = req.user!;
    const { id } = req.params;
    const { text } = req.body;

    try {
      let article: ArticleData | null = await Article.findById(id);

      if (!article) {
        return res.status(400).json({ msg: 'Article not found' });
      }

      article.comments!.unshift({
        userID,
        text
      })

      await article.save()

      article = await Article.findById(id)
        .populate('comments.userID', ['nick', 'avatar']);

      res.json(article);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
    return;
  });


// @route    DELETE api/article/comment/:articleID/:commentID
// @desc     Delete comment
// @access   Private
router.delete('/comment/:articleID/:commentID',
  [
    checkObjectID('articleID'),
    checkObjectID('commentID'),
    auth
  ], async (req: RequestExt, res: Response) => {
    const { articleID, commentID } = req.params;
    const { userID } = req.user!;
    try {
      const article: ArticleData | null = await Article.findById(articleID)
        .populate('comments.userID', ['nick', 'avatar']);

      if (!article) {
        return res.status(400).json({ msg: 'Article not found' });
      }

      const comment = article.comments!.find(comment => comment.id === commentID);

      if (!comment!.userID || comment!.userID.id !== userID) {
        return res.status(401).json(({
          errors:
            [{ param: 'comment', msg: 'you cannot delete a comment you did not write' }]
        }));
      }

      article.comments = article.comments!.filter(comment =>
        comment.id !== commentID
      );

      await article.save();

      res.json(article);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
    return;
  });


// @route    POST api/article/comment/like/:articleID/:commentID
// @desc     Like comment
// @access   Private
router.post('/comment/like/:articleID/:commentID',
  [
    checkObjectID('articleID'),
    checkObjectID('commentID'),
    auth
  ], async (req: RequestExt, res: Response) => {
    const { userID } = req.user!;
    const { articleID, commentID } = req.params;
    try {
      const article: ArticleData | null = await Article.findById(articleID)
        .populate('comments.userID', ['nick', 'avatar']);

      if (!article) {
        return res.status(400).json({ msg: 'Article not found' });
      }

      const comment = article.comments!.find(comment =>
        comment.id === commentID
      );

      if (!comment) {
        return res.json({ msg: 'Comment not found' })
      }

      // Check if the comment has already been disliked
      const isDisliked = comment.dislikes!.some(dislike =>
        String(dislike.userID) === userID
      );

      if (isDisliked) {
        comment.dislikes = comment.dislikes!.filter(dislike =>
          String(dislike.userID) !== userID
        );
      }
      //

      // Check if the comment has already been liked
      const isLiked = comment.likes!.some(like =>
        String(like.userID) === userID
      );

      if (isLiked) {
        comment.likes = comment.likes!.filter(like =>
          String(like.userID) !== userID
        );
      } else {
        comment.likes!.unshift({ userID });
      }
      //

      await article.save();

      res.json(article);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
    return;
  });


// @route    POST api/article/comment/dislike/:articleID/:commentID
// @desc     Dislike comment
// @access   Private
router.post('/comment/dislike/:articleID/:commentID',
  [
    checkObjectID('articleID'),
    checkObjectID('commentID'),
    auth
  ], async (req: RequestExt, res: Response) => {
    const { userID } = req.user!;
    const { articleID, commentID } = req.params;
    try {
      const article: ArticleData | null = await Article.findById(articleID)
        .populate('comments.userID', ['nick', 'avatar']);

      if (!article) {
        return res.status(400).json({ msg: 'Article not found' });
      }

      const comment = article.comments!.find(comment =>
        comment.id === commentID
      );

      if (!comment) {
        return res.json({ msg: 'Comment not found' })
      }

      // Check if the comment has already been liked
      const isLiked = comment.likes!.some(like =>
        String(like.userID) === userID
      );

      if (isLiked) {
        comment.likes = comment.likes!.filter(like =>
          String(like.userID) !== userID
        );
      }
      //

      // Check if the comment has already been disliked
      const isDisliked = comment.dislikes!.some(dislike =>
        String(dislike.userID) === userID
      );

      if (isDisliked) {
        comment.dislikes = comment.dislikes!.filter(dislike =>
          String(dislike.userID) !== userID
        );
      } else {
        comment.dislikes!.unshift({ userID });
      }
      //

      await article.save();

      res.json(article);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
    return;
  });


// @route    DELETE api/article/:id
// @desc     Delete article
// @access   Private
router.delete('/:id',
  [
    checkObjectID('id'),
    auth
  ], async (req: RequestExt, res: Response) => {
    const { id } = req.params;
    const { userID } = req.user!;
    try {
      let article: ArticleData | null = await Article.findById(id);

      if (!article) {
        return res.status(400).json({ msg: 'Article not found' });
      }

      if (String(article.userID) !== userID) {
        return res.json({ msg: 'You cannot delete an article you did not write' });
      }

      article = await Article.findByIdAndDelete(id);

      if (!article) {
        return res.json({ msg: 'Article not found' });
      }

      res.json(article);
    } catch (error) {
      console.error(error.message);
      res.send('server error');
    }
    return;
  });


// @route    POST api/article/upload
// @desc     Upload picture to article
// @access   Private
router.post('/upload/:id',
  [
    checkObjectID('id'),
    auth
  ], async (req: RequestExt, res: Response) => {
    try {
      if (req.files === null) {
        return res.status(400).json(({
          errors:
            [{ param: 'file', msg: "No file uploaded" }]
        }));
      }

      const { id } = req.params;
      const { file } = req.files as any;
      const { imgUrl } = req.body;

      if (!(file.name).includes('.jpg') && !file.name.includes('.jpeg')
        && !file.name.includes('.gif') && !file.name.includes('.png')
        && !file.name.includes('.svg')) {
        return res.status(400).json({
          errors:
            [{ param: 'file', msg: 'Not allowed extension. Use one of these (.jpg | .jpeg | .gif | .png | .svg)' }]
        });
      }

      if (file.size > 2097152) {
        return res.status(400).json({
          errors:
            [{ param: 'file', msg: 'The maximum file size is 2MB' }]
        });
      }

      const article: ArticleData | null = await Article.findById(id);

      if (!article) {
        return res.status(400).json({ msg: 'Article not found' });
      }

      if (String(article.userID) !== req.user!.userID) {
        return res.status(400).json({ msg: 'you cannot upload a file to article you did not write' });
      }

      if (article.picture!.length > 0) {
        return res.status(400).json({ msg: 'This article already contains a picture' });
      }

      article.picture!.unshift({
        imgUrl,
        imgName: file.name
      });

      await article.save();

      res.json(article);
    } catch (error) {
      console.error(error.message);
      res.send('server error');
    }
    return;
  });


// @route    DELETE api/article/upload
// @desc     Delete picture from article
// @access   Private
router.delete('/upload/:articleID/:pictureID',
  [
    checkObjectID('articleID'),
    checkObjectID('pictureID'),
    auth
  ], async (req: RequestExt, res: Response) => {
    const { articleID, pictureID } = req.params;
    try {
      const article: ArticleData | null = await Article.findById(articleID);

      if (!article) {
        return res.status(400).json({ msg: 'Article not found' });
      }

      if (String(article.userID) !== req.user!.userID) {
        return res.status(400).json({ msg: 'You cannot delete a file from article you did not write' });
      }

      if (article.picture!.length === 0) {
        return res.status(400).json({ msg: 'Picture not found' });
      }

      article.picture = article.picture!.filter(pic => pic.id !== pictureID);

      await article.save();

      res.json(article);
    } catch (error) {
      console.error(error.message);
      res.send('server error');
    }
    return;
  });


export default router;