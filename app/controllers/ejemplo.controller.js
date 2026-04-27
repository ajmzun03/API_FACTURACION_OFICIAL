const db = require('../config/db.config.js');
const Ejemplo = db.Ejemplo;

exports.create = (req, res) => {
    let ejemplo = {};

    try {
        ejemplo.nombre = req.body.nombre;
        ejemplo.apellido = req.body.apellido;
        ejemplo.email = req.body.email;
        ejemplo.telefono = req.body.telefono;
        ejemplo.direccion = req.body.direccion;
        ejemplo.fecha_ingreso = req.body.fecha_ingreso;
        ejemplo.estado = req.body.estado;

        Ejemplo.create(ejemplo).then(result => {
            res.status(200).json({
                message: "ejemplo creado exitosamente con id = " + result.id_ejemplo,
                ejemplo: result,
            });
        });
    } catch (error) {
        res.status(500).json({
            message: "¡Fallo al crear el ejemplo!",
            error: error.message
        });
    }
};

exports.retrieveAllEjemplos = (req, res) => {
    Ejemplo.findAll()
        .then(ejemploInfos => {
            res.status(200).json({
                message: "¡ejemplos obtenidos exitosamente!",
                ejemplos: ejemploInfos
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "¡Error al obtener los ejemplos!",
                error: error
            });
        });
};

exports.getEjemploById = (req, res) => {
    let ejemploId = req.params.id;
    Ejemplo.findByPk(ejemploId)
        .then(ejemplo => {
            res.status(200).json({
                message: "ejemplo obtenido exitosamente con id = " + ejemploId,
                ejemplo: ejemplo
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "¡Error al obtener ejemplo con id!",
                error: error
            });
        });
};

exports.getEjemploByName = (req, res) => {
    const ejemploName = req.params.nombre;
    Ejemplo.findAll({ where: { nombre: ejemploName } })
        .then(ejemplos => {
            res.status(200).json({
                message: "ejemplos obtenidas exitosamente con el nombre = " + ejemploName,
                ejemplos: ejemplos
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Error al obtener los ejemplos!",
                error: error.message
            });
        });
};

exports.updateById = async (req, res) => {
    try {
        let ejemploId = req.params.id;
        let ejemplo = await Ejemplo.findByPk(ejemploId);
    
        if (!ejemplo) {
            res.status(404).json({
                message: "No se encontró el ejemplo para actualizar con id = " + ejemploId,
                ejemplo: "",
                error: "404"
            });
        } else {    
            let updatedObject = {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.primer_apellid,  
                telefono: req.body.telefono,
                direccion: req.body.direccion,
                fecha_ingreso: req.body.fecha_ingreso,
                estado: req.body.estado
            }
            let result = await Ejemplo.update(updatedObject, {returning: true, where: {id_ejemplo: ejemploId}});
            
            if (!result) {
                res.status(500).json({
                    message: "No se puede actualizar un ejemplo con id = " + req.params.id,
                    error: "No se pudo actualizar el ejemplo",
                });
            };

            res.status(200).json({
                message: "Actualización exitosa de un ejemplo con id = " + ejemploId,
                ejemplo: updatedObject,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "No se puede actualizar un ejemplo con id = " + req.params.id,
            error: error.message
        });
    }
};

exports.deleteById = async (req, res) => {
    try {
        let ejemploId = req.params.id;
        let ejemplo = await Ejemplo.findByPk(ejemploId);

        if (!ejemplo) {
            res.status(404).json({
                message: "No existe el ejemplo con id = " + ejemploId,
                error: "404",
            });
        } else {
            await ejemplo.destroy();
            res.status(200).json({
                message: "Eliminación exitosa del ejemplo con id = " + ejemploId,
                ejemplo: ejemplo,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "No se puede eliminar un ejemplo con id = " + req.params.id,
            error: error.message,
        });
    }
}