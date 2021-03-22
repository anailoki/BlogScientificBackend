const Post = require('../models/post');

function addPost(req, res) {
    const body = req.body;
    body.user = req.user.id;
    const post = new Post(body);

    post.save((err, postStored) => {
        if (err) {
            res.status(500).send({ code: 500, message: 'Error del servidor.' });
        } else {
            if (!postStored) {
                res.status(400).send({
                    code: 400,
                    message: 'No se ha podido crear el post',
                });
            } else {
                res.status(200).send({
                    code: 200,
                    message: 'Post creado correctamente.',
                });
            }
        }
    });
}

const getPosts = async (req, res) => {
    // const { page = 1, limit = 10 } = req.query;
    // const options = {
    //     page: page,
    //     limit: parseInt(limit),
    //     sort: { date: 'desc' },
    //     populate: 'user',
    //     // select: 'name lastname',
    // };

    // Post.paginate({}, options, (err, postsStored) => {
    //     if (err) {
    //         res.status(500).send({
    //             code: 500,
    //             message: 'Error del servidor.',
    //         });
    //     } else {
    //         if (!postsStored) {
    //             res.status(404).send({
    //                 code: 404,
    //                 message: 'No se ha encontrado ningun post.',
    //             });
    //         } else {
    //             res.status(200).send({
    //                 code: 200,
    //                 posts: postsStored,
    //             });
    //         }
    //     }
    // });

    //SIN LIBRERIA
    const { page = 0, limit = 12 } = req.query;
    const { limite = limit, desde = page } = req.query;
    // const query = { estado: true };

    const [total, posts] = await Promise.all([
        Post.countDocuments(),
        Post.find()
            .populate('user', 'name')
            .skip(Number(desde))
            .limit(Number(limite))
            .sort({ date: 'desc' }),
    ]);

    res.status(200).send({
        code: 200,
        posts: posts,
        total,
        page: desde,
        pages: Math.ceil(total / limite),
    });
};

function updatePost(req, res) {
    const postData = req.body;
    const { id } = req.params;

    Post.findByIdAndUpdate(id, postData, (err, postUpdate) => {
        if (err) {
            res.status(500).send({ code: 500, message: 'Error del servidor.' });
        } else {
            if (!postUpdate) {
                res.status(404).send({
                    code: 404,
                    message: 'No se ha encontrado ningun post.',
                });
            } else {
                res.status(200).send({
                    code: 200,
                    message: 'Post actualizado correctamente.',
                });
            }
        }
    });
}

function deletePost(req, res) {
    const { id } = req.params;

    Post.findByIdAndUpdate(id, (err, postDelete) => {
        if (err) {
            res.status(500).send({ code: 500, message: 'Error del servidor.' });
        } else {
            if (!postDelete) {
                res.status(404).send({
                    code: 404,
                    message: 'Post no encontrado.',
                });
            } else {
                res.status(200).send({
                    code: 200,
                    message: 'El post se ha eliminado correctamente.',
                });
            }
        }
    });
}

const getPost = async (req, res) => {
    const { url } = req.params;

    const post = await Post.findOne({ url: url }).populate('user', 'name');

    console.log(post);

    if (!post) {
        res.status(404).send({
            code: 404,
            message: 'No se ha encontrado ningun post.',
        });
    } else {
        res.status(200).send({
            code: 200,
            posts: post,
        });
    }

    // Post.findOne({ url: url }, (err, postStored) => {
    //     if (err) {
    //         res.status(500).send({ code: 500, message: 'Error del servidor.' });
    //     } else {
    //         if (!postStored) {
    //             res.status(404).send({
    //                 message: 'No se ha encontrado ningun post.',
    //             });
    //         } else {
    //             res.status(200).send({ code: 200, post: postStored });
    //         }
    //     }
    // });
};

module.exports = {
    addPost,
    getPosts,
    updatePost,
    deletePost,
    getPost,
};
