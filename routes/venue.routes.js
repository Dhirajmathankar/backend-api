const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/venue.controller');

router.post('/', ctrl.createVenue);
router.get('/', ctrl.getVenues);
router.put('/:id', ctrl.updateVenue);
router.delete('/:id', ctrl.deleteVenue);

module.exports = router;