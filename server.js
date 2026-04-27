const express = require('express');
const app = express();

var bodyParser = require('body-parser');
 
const db = require('./app/config/db.config.js');
  

db.sequelize.authenticate().then(() => {
  console.log('Conexión a la base de datos exitosa');
}).catch(err => {
  console.log('Error al conectar a la base de datos:', err);
});

let router = require('./app/routers/router.js');

const cors = require('cors')
const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use('/', router);
app.get("/",(req,res) => {
  res.json({mesage:"Bienvenido Estudiantes de UMG"});
})

const server = app.listen(8080, function () {
  let host = server.address().address
  let port = server.address().port
  console.log("App listening at http://%s:%s", host, port); 
})