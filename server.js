const app = require("./app/app.js"); // Aquí traemos todo lo configurado abajo

const PORT = 3000; // El puerto que pediste

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🔗 Localhost: http://localhost:${PORT}`);
});

const categoriaRoutes = require('./app/routes/categoria.routes.js');
const productoRoutes  = require('./app/routes/producto.routes.js');
 
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos',  productoRoutes);