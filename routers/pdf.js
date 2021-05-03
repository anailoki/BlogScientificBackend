const express = require('express');
const PdfController = require('../controllers/pdf');
const multipart = require('connect-multiparty');

const md_auth = require('../middleware/authenticated');
const md_upload_pdf = multipart({ uploadDir: './uploads/pdf' });

const api = express.Router();

api.post(
    '/add-pdf/:id',
    [md_auth.ensureAuth, md_upload_pdf],
    PdfController.addPdf
);
api.get('/get-pdf/:pdfName', PdfController.getPdf);
api.get('/get-pdf-list/:idPost', PdfController.getListPdf);
api.delete('/delete-pdf/:id', [md_auth.ensureAuth], PdfController.deletePdf);

module.exports = api;
