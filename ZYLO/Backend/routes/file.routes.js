const express = require('express');
const router = express.Router();
const { authUser } = require('../middlewares/auth.middleware');
const fileController = require('../controllers/file.controller');

router.post('/upload', authUser, fileController.uploadFile);
router.get('/', authUser, fileController.getFiles);
router.delete('/:id', authUser, fileController.deleteFile);

module.exports = router;