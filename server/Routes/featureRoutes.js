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
const creditsAuth = require('../middlewares/creditsAuth');

router.post('/prompt-enhance', promptEnhancement);

router.post('/img-generation', creditsAuth, imgGeneration);

router.post('/bg-generation', creditsAuth, bgGeneration);

router.post('/product-packshot', creditsAuth, productPackshot);

router.post('/generative-fill', creditsAuth, generativefill);

router.post('/vector-graphics', creditsAuth, vectorGraphics);

router.post('/lifestyle-shot-by-text', creditsAuth, generateLifeStyleShotByText);

router.post('/generate-shadow', creditsAuth, generateShadow);

module.exports = router;