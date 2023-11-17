// routes/api/posts.js
const express = require('express');
const router = express.Router();
const postController = require('../../controllers/postController');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage: multer.memoryStorage() });


router.route('/')
    .get(postController.getAllPosts)
    .post(upload.array('images',12), postController.createNewPost)
    .put(postController.updatePost)
    .delete(postController.deletePost);

router.route('/:id')
    .get(postController.getPost);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const Post = require('../models/Post');

// router.get('/posts/:id', async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);

//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }

//     // Set appropriate content type (e.g., for images)
//     res.set('Content-Type', 'image/png'); // adjust as needed
//     res.send(post.file);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// module.exports = router;
