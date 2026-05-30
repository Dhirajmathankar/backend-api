const router = require('express').Router();
const txController = require('../controllers/tx.controller');
const verifyToken = require('../middleware/auth');

router.post('/insert', verifyToken, txController.createTransaction);
router.get('/history', verifyToken , txController.getTransactionHistory);

module.exports = router;