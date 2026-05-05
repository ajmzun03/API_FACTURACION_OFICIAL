const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/categoria.controller.js');

// GET    /api/categorias
router.get('/', ctrl.getAll);

// GET    /api/categorias/:id
router.get('/:id', ctrl.getById);

// POST   /api/categorias
router.post('/', ctrl.create);

// PUT    /api/categorias/:id
router.put('/:id', ctrl.update);

// DELETE /api/categorias/:id
router.delete('/:id', ctrl.remove);

module.exports = router;