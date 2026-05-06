const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db.config.js'); // Quité el /app/ porque ya estás dentro
const router = require("./routers/router.js"); // Quité el /app/ porque ya estás dentro
const errorHandler = require("./middlewares/errorHandler");

// Rutas de Dev1 (Categorías y Productos) — se montan aquí porque el resto de
// rutas viven en router.js. Las rutas de Dev2/Dev3/Dev4 ya están en router.js.
const categoriaRoutes = require('./routers/categoriaRoutes.js');
const productoRoutes  = require('./routers/productoRoutes.js');

const app = express();

// --- Configuración de Middlewares ---
const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

// --- Conexión a la Base de Datos ---
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos exitosa.');
  })
  .catch(err => {
    console.error('❌ Error al conectar a la base de datos:', err.message);
  });

// --- Rutas ---
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos',  productoRoutes);
app.use('/', router);

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido Estudiantes de UMG" });
});

// --- Manejo de Errores ---
app.use(errorHandler);

module.exports = app;
