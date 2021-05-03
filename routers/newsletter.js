const express = require('express');
const NewsletterControlller = require('../controllers/newsletter');
const md_auth = require('../middleware/authenticated');

const api = express.Router();

api.post('/suscribe-newsletter', NewsletterControlller.suscribeEmail);
api.get(
    '/get-user-register',
    [md_auth.ensureAuth],
    NewsletterControlller.getUserSuscribed
);

module.exports = api;
