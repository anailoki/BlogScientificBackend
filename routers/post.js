const express = require('express');
const PostController = require('../controllers/post');
const multipart = require('connect-multiparty');

const md_auth = require('../middleware/authenticated');
const md_upload_avatar = multipart({ uploadDir: './uploads/post' });

const api = express.Router();

api.post('/add-post', [md_auth.ensureAuth], PostController.addPost);
api.get('/get-posts', PostController.getPosts);
api.put('/update-post/:id', [md_auth.ensureAuth], PostController.updatePost);
api.delete('/delete-post/:id', [md_auth.ensureAuth], PostController.deletePost);
api.get('/get-post/:url', PostController.getPost);
api.post(
    '/add-post-image/:id',
    [md_auth.ensureAuth, md_upload_avatar],
    PostController.addImagePdf
);
api.get('/get-post-image/:imageName', PostController.getImagePost);
api.get('/get-active-posts', PostController.getActivePosts);
module.exports = api;
