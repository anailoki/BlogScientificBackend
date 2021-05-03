const Post = require('../models/post');
const fs = require('fs');
const path = require('path');

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
    //     // populate: 'user',
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

    const { page = 1, limit = 10, active } = req.query;
    const { limite = limit } = req.query;
    // const { limite = limit, desde = page } = req.query;
    // const query = { estado: true }; NO
    let desde = 0;
    if (page == 1) {
        desde = 0;
    } else {
        desde = (page - 1) * limite;
    }
    // const query = { date: 'desc' };

    const [total, posts] = await Promise.all([
        Post.countDocuments(),
        Post.find()
            .populate('user')
            .skip(Number(desde))
            .limit(Number(limite))
            .sort({ date: 'desc' }),
    ]);

    res.status(200).send({
        code: 200,
        posts: posts,
        total,
        limit: parseInt(limite),
        page: page,
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

    Post.findByIdAndDelete(id, (err, postDelete) => {
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

    const post = await Post.findOne({ url: url }).populate('user');

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

const getActivePosts = async (req, res) => {
    //SIN LIBRERIA

    const { page = 1, limit = 10, active } = req.query;
    const { limite = limit } = req.query;
    // const { limite = limit, desde = page } = req.query;
    // const query = { estado: true }; NO
    let desde = 0;
    if (page == 1) {
        desde = 0;
    } else {
        desde = (page - 1) * limite;
    }
    const query = { active: true };

    const [total, posts] = await Promise.all([
        Post.countDocuments(query),
        Post.find(query)
            .populate('user')
            .skip(Number(desde))
            .limit(Number(limite))
            .sort({ date: 'desc' }),
    ]);

    res.status(200).send({
        code: 200,
        posts: posts,
        total,
        limit: parseInt(limite),
        page: page,
        pages: Math.ceil(total / limite),
    });
};

function addImagePdf(req, res) {
    const params = req.params;

    Post.findById({ _id: params.id }, (err, postData) => {
        if (err) {
            res.status(500).send({ message: 'Error del servidor.' });
        } else {
            if (!postData) {
                res.status(404).send({
                    message: 'No se ha encontrado ningun usuario.',
                });
            } else {
                let post = postData;

                if (req.files) {
                    let filePath = req.files.file.path;
                    let fileSplit = filePath.split('/');
                    let fileName = fileSplit[2];

                    let extSplit = fileName.split('.');
                    let fileExt = extSplit[1];

                    if (
                        fileExt !== 'png' &&
                        fileExt !== 'jpg' &&
                        fileExt !== 'webp' &&
                        fileExt !== 'jpeg'
                    ) {
                        res.status(400).send({
                            message:
                                'La extension de la imagen no es valida. Extension permitida: .jpg y .png',
                        });
                    } else {
                        post.image = fileName;
                        Post.findByIdAndUpdate(
                            { _id: params.id },
                            post,
                            (err, pdfResult) => {
                                if (err) {
                                    res.status(500).send({
                                        message: 'Error del servidor',
                                    });
                                } else {
                                    if (!pdfResult) {
                                        res.status(404).send({
                                            message:
                                                'No se ha encontrado ningun usuario',
                                        });
                                    } else {
                                        res.status(200).send({
                                            message:
                                                'Imagen creado correctamente.',
                                        });
                                    }
                                }
                            }
                        );
                    }
                }
            }
        }
    });
}

function getImagePost(req, res) {
    const imageName = req.params.imageName;
    const filePath = './uploads/post/' + imageName;

    if (!fs.existsSync(filePath)) {
        res.status(404).send({ message: 'La imagen que buscas no existe' });
    } else {
        res.sendFile(path.resolve(filePath));
    }
}

module.exports = {
    addPost,
    getPosts,
    updatePost,
    deletePost,
    getPost,
    getActivePosts,
    addImagePdf,
    getImagePost,
};
