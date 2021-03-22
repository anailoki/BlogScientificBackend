const express = require('express');
const NewsletterControlller = require('../controllers/newsletter');

const api = express.Router();

api.post('/suscribe-newsletter', NewsletterControlller.suscribeEmail);

module.exports = api;
