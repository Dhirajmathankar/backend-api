const router = require('express').Router();
const walletController = require('../controllers/wallet.controller');
const verifyToken = require('../middleware/auth'); // आपका JWT ऑथेंटिकेशन मिडिलवेयर

router.get('/snapshot', verifyToken, walletController.getWalletSnapshot);

module.exports = router;