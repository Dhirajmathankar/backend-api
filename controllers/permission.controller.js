const Category = require('../models/Category-model/Category');
const Permission = require('../models/Category-model/Permission');

// Create category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name required' });

    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Category already exists' });

    const cat = await Category.create({ name });
    res.status(201).json({ success: true, category: cat });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List categories
exports.listCategories = async (req, res) => {
  try {
    const cats = await Category.find().sort({ name: 1 });
    res.json({ success: true, categories: cats });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create permission
exports.createPermission = async (req, res) => {
  try {
    const { categoryId, groupName, name, code, active } = req.body;
    if (!categoryId || !groupName || !name || !code) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // unique code
    const exists = await Permission.findOne({ code });
    if (exists) return res.status(400).json({ message: 'Permission code must be unique' });

    const perm = await Permission.create({ categoryId, groupName, name, code, active });
    res.status(201).json({ success: true, permission: perm });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List permissions (optionally by category)
exports.listPermissions = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const filter = {};
    if (categoryId) filter.categoryId = categoryId;
    const perms = await Permission.find(filter).populate('categoryId', 'name').sort({ groupName: 1, name: 1 });
    res.json({ success: true, permissions: perms });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update permission (toggle active or edit fields)
exports.updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body; // { name, code, groupName, active, categoryId }
    const perm = await Permission.findByIdAndUpdate(id, payload, { new: true });
    if (!perm) return res.status(404).json({ message: 'Permission not found' });
    res.json({ success: true, permission: perm });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete permission
exports.deletePermission = async (req, res) => {
  try {
    const { id } = req.params;
    await Permission.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
