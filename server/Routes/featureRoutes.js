const {Router} = require('express');
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});
const router = Router();
const {promptEnhancement} = require('../controllers/features/prompt_enhance');
const {imgGeneration} = require('../controllers/features/img_generation');
const {bgGeneration} = require('../controllers/features/bg_generation');

router.post('/prompt-enhance', promptEnhancement);

router.post('/img-generation', imgGeneration );

router.post('/bg-generation', bgGeneration)

module.exports = router;