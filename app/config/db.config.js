const env = require('./env.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Registro de todos los modelos
db.Categoria = require('../models/categoria.model.js')(sequelize, Sequelize);
db.Producto  = require('../models/producto.model.js')(sequelize, Sequelize);
db.Cliente   = require('../models/cliente.model.js')(sequelize, Sequelize);
db.Rol       = require('../models/rol.model.js')(sequelize, Sequelize);
db.Usuario   = require('../models/usuario.model.js')(sequelize, Sequelize);
db.Factura   = require('../models/factura.model.js')(sequelize, Sequelize);
db.Pago            = require('../models/pago.model.js')(sequelize, Sequelize);
db.DetalleFactura  = require('../models/detalle_factura.model.js')(sequelize, Sequelize);

// Asociaciones definidas con .associate(db) en los modelos (Dev1)
// Se ejecutan aquí para que Categoria <-> Producto quede registrado
// y los include con as:'categoria' / as:'productos' funcionen.
Object.keys(db).forEach((modelName) => {
  if (db[modelName] && typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

// Asociaciones inline (Dev2 — Usuarios y Roles)
db.Usuario.belongsTo(db.Rol, { foreignKey: 'id_rol', as: 'rol' });
db.Rol.hasMany(db.Usuario, { foreignKey: 'id_rol', as: 'usuarios' });

module.exports = db;
