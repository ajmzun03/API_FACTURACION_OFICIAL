module.exports = (sequelize, Sequelize) => {
  const Pago = sequelize.define("pago", {
    id_pago: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    id_factura_pago: { type: Sequelize.INTEGER },
    fecha_pago: { type: Sequelize.DATE },
    monto_pago: { type: Sequelize.NUMERIC(14, 2) },
    metodo_pago: { type: Sequelize.STRING(15) },
    numero_referencia_pago: { type: Sequelize.STRING(100), allowNull: true },
    estado_pago: { type: Sequelize.STRING(20), allowNull: true },
    fecha_creacion_pago: { type: Sequelize.DATEONLY }
  }, { timestamps: false, freezeTableName: true });

  // Asociación: un pago pertenece a una factura
  Pago.associate = (db) => {
    Pago.belongsTo(db.Factura, {
      foreignKey: 'id_factura_pago',
      as: 'factura',
    });
    db.Factura.hasMany(Pago, {
      foreignKey: 'id_factura_pago',
      as: 'pagos',
    });
  };

  return Pago;
};
