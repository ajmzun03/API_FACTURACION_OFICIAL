const db = require('../config/db.js');
const Producto  = db.Producto;
const Categoria = db.Categoria;

const STOCK_MINIMO_GLOBAL = 5;

// Helper: genera alerta si el stock está bajo
const alertaStock = (producto) => {
  const limite = producto.stock_minimo ?? STOCK_MINIMO_GLOBAL;
  if (producto.stock <= limite) {
    return {
      alerta: true,
      mensaje: `⚠️ Stock bajo: el producto "${producto.nombre}" tiene ${producto.stock} unidades (mínimo: ${limite})`,
    };
  }
  return { alerta: false };
};

// ──────────────────────────────────────────────
// GET /api/productos
// ──────────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: { activo: true },
      include: [{ model: Categoria, as: 'categoria', attributes: ['id_categoria', 'nombre'] }],
      order: [['nombre', 'ASC']],
    });

    // Adjuntar info de alerta a cada producto
    const resultado = productos.map((p) => ({
      ...p.toJSON(),
      ...alertaStock(p),
    }));

    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// ──────────────────────────────────────────────
// GET /api/productos/:id
// ──────────────────────────────────────────────
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findOne({
      where: { id_producto: id, activo: true },
      include: [{ model: Categoria, as: 'categoria', attributes: ['id_categoria', 'nombre'] }],
    });

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    return res.status(200).json({ ...producto.toJSON(), ...alertaStock(producto) });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// ──────────────────────────────────────────────
// GET /api/productos/stock-bajo
// Listado de productos con stock bajo o agotado
// ──────────────────────────────────────────────
exports.getStockBajo = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const productos = await Producto.findAll({
      where: {
        activo: true,
        stock: { [Op.lte]: db.sequelize.col('stock_minimo') },
      },
      include: [{ model: Categoria, as: 'categoria', attributes: ['id_categoria', 'nombre'] }],
    });

    return res.status(200).json({
      total: productos.length,
      productos,
    });
  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// ──────────────────────────────────────────────
// POST /api/productos
// ──────────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const { id_categoria, nombre, descripcion, precio, stock, stock_minimo } = req.body;

    if (!nombre || !precio || id_categoria === undefined) {
      return res.status(400).json({ mensaje: 'nombre, precio e id_categoria son requeridos' });
    }

    // Verificar que la categoría existe
    const categoria = await Categoria.findOne({ where: { id_categoria, activo: true } });
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    const nuevo = await Producto.create({
      id_categoria,
      nombre,
      descripcion,
      precio,
      stock: stock ?? 0,
      stock_minimo: stock_minimo ?? STOCK_MINIMO_GLOBAL,
    });

    const info = alertaStock(nuevo);
    return res.status(201).json({ mensaje: 'Producto creado correctamente', producto: nuevo, ...info });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// ──────────────────────────────────────────────
// PUT /api/productos/:id
// ──────────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_categoria, nombre, descripcion, precio, stock, stock_minimo } = req.body;

    const producto = await Producto.findOne({ where: { id_producto: id, activo: true } });
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    if (id_categoria) {
      const categoria = await Categoria.findOne({ where: { id_categoria, activo: true } });
      if (!categoria) {
        return res.status(404).json({ mensaje: 'Categoría no encontrada' });
      }
    }

    await producto.update({ id_categoria, nombre, descripcion, precio, stock, stock_minimo });

    const info = alertaStock(producto);
    return res.status(200).json({ mensaje: 'Producto actualizado correctamente', producto, ...info });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// ──────────────────────────────────────────────
// DELETE /api/productos/:id  (soft delete)
// ──────────────────────────────────────────────
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findOne({ where: { id_producto: id, activo: true } });

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    await producto.update({ activo: false });
    return res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// ──────────────────────────────────────────────
// PATCH /api/productos/:id/actualizar-stock
// Usado por DEV3 al facturar (descuenta stock)
// body: { cantidad: N }
// ──────────────────────────────────────────────
exports.actualizarStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    if (cantidad === undefined || cantidad <= 0) {
      return res.status(400).json({ mensaje: 'La cantidad debe ser un número positivo' });
    }

    const producto = await Producto.findOne({ where: { id_producto: id, activo: true } });
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    if (producto.stock < cantidad) {
      return res.status(400).json({
        mensaje: `Stock insuficiente. Disponible: ${producto.stock}, solicitado: ${cantidad}`,
      });
    }

    const nuevoStock = producto.stock - cantidad;
    await producto.update({ stock: nuevoStock });

    const info = alertaStock({ ...producto.toJSON(), stock: nuevoStock });
    return res.status(200).json({
      mensaje: 'Stock actualizado correctamente',
      stock_anterior: producto.stock,
      stock_actual: nuevoStock,
      ...info,
    });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};