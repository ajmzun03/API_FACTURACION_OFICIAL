module.exports = (sequelize, Sequelize) => {
    const Ejemplo = sequelize.define("ejemplos", {
        id_ejemplo: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: Sequelize.STRING
        },
        apellido: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        
        telefono: {
            type: Sequelize.INTEGER
        },
        direccion:{
            type: Sequelize.STRING
        },
        fecha_ingreso: {
            type: Sequelize.DATE
            //type: Sequelize.DATEONLY  Cambiado a DATEONLY para guardar solo la fecha
            //defaultValue: Sequelize.NOW   Establece la fecha actual como valor predeterminado
        },
        estado: {
            type: Sequelize.INTEGER
        }

    });
    return Ejemplo;
};