const app = require("express");
const router = app.Router();
const { createPost, fetchPosts, fetchPost, updatePost, updateValidations, updateImage, deletePost, home, homeTesting, postDetail } = require("../controllers/postController");
const auth = require("../utils/auth");

//router.get('/home/:page', home);
router.post('/createpost', auth, createPost);
router.get('/posts/:id/:page', auth, fetchPosts);
router.get('/post/:id', auth, fetchPost);
router.post('/editpost', [auth, updateValidations], updatePost);
router.post('/updateImage', auth, updateImage);
router.get('/delete/:id', auth, deletePost);
router.get('/delete/:id', auth, deletePost);
// router.get('/home/:page', home);
router.get('/homeTesting', homeTesting);
router.get('/postview/:id', postDetail);

module.exports = router;