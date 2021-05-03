const Newsletter = require('../models/newsletter');

function suscribeEmail(req, res) {
    const { name, lastname, email, message } = req.body;
    const newsletter = new Newsletter();

    if (!email || !name || !lastname) {
        res.status(404).send({
            code: 404,
            message: 'El nombre, apellido y email son obligatorio.',
        });
    } else {
        if (message && message.length > 120) {
            res.status(404).send({
                code: 404,
                message: 'El mensaje es muy largo.',
            });
        } else {
            newsletter.name = name;
            newsletter.lastname = lastname;
            newsletter.email = email.toLowerCase();
            newsletter.message = message;

            newsletter.save((err, newsletterStore) => {
                if (err) {
                    res.status(500).send({
                        code: 500,
                        message: 'El email ya existe.',
                    });
                } else {
                    if (!newsletterStore) {
                        res.status(400).send({
                            code: 400,
                            message: 'Error al registrar en la newsletter',
                        });
                    } else {
                        res.status(200).send({
                            code: 200,
                            message: 'Email registrado correctamente.',
                        });
                    }
                }
            });
        }
    }
}

function getUserSuscribed(req, res) {
    Newsletter.find().exec((err, newsletterStored) => {
        if (err) {
            res.status(500).send({ message: 'Error del servidor.' });
        } else {
            if (!newsletterStored) {
                res.status(404).send({
                    message: 'No se ha encontrado ningun elemento en el menu.',
                });
            } else {
                res.status(200).send({
                    code: 200,
                    newsletter: newsletterStored,
                });
            }
        }
    });
}

module.exports = {
    suscribeEmail,
    getUserSuscribed,
};
