const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  groupName: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },        // permission display name
  code: { type: String, required: true, trim: true, unique: true }, // permission code string
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Permission', PermissionSchema);
