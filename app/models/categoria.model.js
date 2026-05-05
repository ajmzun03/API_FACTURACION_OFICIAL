module.exports = (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categoria', {
    id_categoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'categoria_producto',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Categoria.associate = (db) => {
    Categoria.hasMany(db.Producto, {
      foreignKey: 'id_categoria',
      as: 'productos',
    });
  };

  return Categoria;
};