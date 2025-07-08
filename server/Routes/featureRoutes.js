const {Router} = require('express');
const router = Router();
const {promptEnhancement} = require('../controllers/features/prompt_enhance');
const {imgGeneration} = require('../controllers/features/img_generation');
const {bgGeneration} = require('../controllers/features/bg_generation');
const {productPackshot} = require('../controllers/features/product_packshot');
const { generativefill } = require('../controllers/features/generative_fill');

router.post('/prompt-enhance', promptEnhancement);

router.post('/img-generation', imgGeneration );

router.post('/bg-generation', bgGeneration);

router.post('/product-packshot', productPackshot);

router.post('/generative-fill', generativefill);

module.exports = router;