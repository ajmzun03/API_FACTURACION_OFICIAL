const db = require('../config/db.js');
const Categoria = db.Categoria;

// ──────────────────────────────────────────────
// GET /api/categorias
// ──────────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      where: { activo: true },
      order: [['nombre', 'ASC']],
    });
    return res.status(200).json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// ──────────────────────────────────────────────
// GET /api/categorias/:id
// ──────────────────────────────────────────────
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findOne({
      where: { id_categoria: id, activo: true },
    });

    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    return res.status(200).json(categoria);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// ──────────────────────────────────────────────
// POST /api/categorias
// ──────────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ mensaje: 'El nombre de la categoría es requerido' });
    }

    const nueva = await Categoria.create({ nombre, descripcion });
    return res.status(201).json({ mensaje: 'Categoría creada correctamente', categoria: nueva });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// ──────────────────────────────────────────────
// PUT /api/categorias/:id
// ──────────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const categoria = await Categoria.findOne({ where: { id_categoria: id, activo: true } });

    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    await categoria.update({ nombre, descripcion });
    return res.status(200).json({ mensaje: 'Categoría actualizada correctamente', categoria });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// ──────────────────────────────────────────────
// DELETE /api/categorias/:id  (soft delete)
// ──────────────────────────────────────────────
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findOne({ where: { id_categoria: id, activo: true } });

    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    await categoria.update({ activo: false });
    return res.status(200).json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};