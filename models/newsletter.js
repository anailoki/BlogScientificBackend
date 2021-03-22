const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsletterSchema = Schema({
    email: {
        type: String,
        require: true,
        unique: true,
    },
    name: {
        type: String,
        require: true,
    },
    lastname: {
        type: String,
        require: true,
    },
    message: String,
});

module.exports = mongoose.model('Newsletter', NewsletterSchema);
