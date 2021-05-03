const fs = require('fs');
const path = require('path');
const Pdf = require('../models/pdf');

function addPdf(req, res) {
    const params = req.params;
    const { id } = params;

    if (req.files) {
        let filePath = req.files.file.path;
        let fileSplit = filePath.split('/');
        let fileName = fileSplit[2];

        let extSplit = fileName.split('.');
        let fileExt = extSplit[1];

        if (fileExt !== 'pdf') {
            res.status(400).send({
                message:
                    'La extension del archivo no es valida. Extension permitida: .pdf',
            });
        } else {
            const pdf = new Pdf();
            pdf.url = fileName;
            pdf.name = req.files.file.name;
            pdf.post = id;

            pdf.save((err, createdPdf) => {
                if (err) {
                    res.status(500).send({ message: 'Error del servidor' });
                } else {
                    if (!createdPdf) {
                        res.status(404).send({
                            message: 'Error al subir el pdf.',
                        });
                    } else {
                        res.status(200).send({
                            message: 'Pdf creado correctamente.',
                        });
                    }
                }
            });
        }
    } else {
        res.status(404).send({
            message: 'No se encontro archivo.',
        });
    }
}

function getPdf(req, res) {
    const pdfName = req.params.pdfName;
    const filePath = './uploads/pdf/' + pdfName;

    if (!fs.existsSync(filePath)) {
        res.status(404).send({ message: 'El avatar que buscas no existe' });
    } else {
        res.sendFile(path.resolve(filePath));
    }
}

function getListPdf(req, res) {
    const idPost = req.params.idPost;
    const query = { post: idPost };

    Pdf.find(query).exec((err, pdfStored) => {
        if (err) {
            res.status(500).send({ message: 'Error del servidor.' });
        } else {
            if (!pdfStored) {
                res.status(404).send({
                    message: 'No se ha encontrado ningun elemento en los pdf.',
                });
            } else {
                res.status(200).send({ pdf: pdfStored });
            }
        }
    });
}

function deletePdf(req, res) {
    const { id } = req.params;

    Pdf.findByIdAndDelete(id, (err, pdfDelete) => {
        if (err) {
            res.status(500).send({ code: 500, message: 'Error del servidor.' });
        } else {
            if (!pdfDelete) {
                res.status(404).send({
                    code: 404,
                    message: 'Pdf no encontrado.',
                });
            } else {
                res.status(200).send({
                    code: 200,
                    message: 'El pdf se ha eliminado correctamente.',
                });
            }
        }
    });
}

module.exports = {
    addPdf,
    getPdf,
    getListPdf,
    deletePdf,
};
