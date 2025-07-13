const {Router} = require('express');
const router = Router();
const {promptEnhancement} = require('../controllers/features/prompt_enhance');
const {imgGeneration} = require('../controllers/features/img_generation');
const {bgGeneration} = require('../controllers/features/bg_generation');
const {productPackshot} = require('../controllers/features/product_packshot');
const { generativefill } = require('../controllers/features/generative_fill');
const { vectorGraphics } = require('../controllers/features/vector_graphics');
const { generateLifeStyleShotByText } = require('../controllers/lifestyleshotby_text');
const { generateShadow } = require('../controllers/features/shadow');

router.post('/prompt-enhance', promptEnhancement);

router.post('/img-generation', imgGeneration );

router.post('/bg-generation', bgGeneration);

router.post('/product-packshot', productPackshot);

router.post('/generative-fill', generativefill);

router.post('/vector-graphics', vectorGraphics);

router.post('/lifestyle-shot-by-text', generateLifeStyleShotByText);

router.post('/generate-shadow', generateShadow);

module.exports = router;