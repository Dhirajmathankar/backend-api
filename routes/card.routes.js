const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/permission.controller');
// const { protect } = require('../middleware/authMiddleware'); // optional if you want auth

// Categories
router.post('/categories', /*protect,*/ ctrl.createCategory);
router.get('/categories', /*protect,*/ ctrl.listCategories);

// Permissions
router.post('/', /*protect,*/ ctrl.createPermission);
router.get('/', /*protect,*/ ctrl.listPermissions);
router.put('/:id', /*protect,*/ ctrl.updatePermission);
router.delete('/:id', /*protect,*/ ctrl.deletePermission);

module.exports = router;
