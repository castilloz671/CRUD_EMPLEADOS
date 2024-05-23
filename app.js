const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Eps123456**",
  database: "empleados_db",
});

db.connect((err) => {
  if (err) {
      throw err;
  }
  console.log('Conectado a la base de datos MySQL');
});

//Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

//Rutas
app.get("/", (req, res) => {
  const query = `SELECT * FROM empleados`;
  db.query(query, (err, results) => {
    if (err) {
      throw err;
    }
    res.render('index', { empleados: results });
  });
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", (req, res) => {
  const { nombre, apellido, telefono, direccion, sueldo_bruto } = req.body;
  const ars = sueldo_bruto * 0.0304;
  const afp = sueldo_bruto * 0.0287;
  sueldo_neto = sueldo_bruto - ars - afp;

  const query = `INSERT INTO empleados (nombre, apellido, telefono, direccion, sueldo_bruto, sueldo_neto, ars, afp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(
    query,
    [
      nombre,
      apellido,
      telefono,
      direccion,
      sueldo_bruto,
      sueldo_neto,
      ars,
      afp,
    ],
    (err, result) => {
      if (err) {
        throw err;
      }
      res.redirect("/");
    }
  );
});

app.get("/edit/:id", (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM empleados WHERE id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) {
      throw err;
    }
    res.render("edit", { empleado: result[0] });
  });
});

app.post("/edit/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, telefono, direccion, sueldo_bruto } = req.body;
  const ars = sueldo_bruto * 0.0304;
  const afp = sueldo_bruto * 0.0287;
  sueldo_neto = sueldo_bruto - ars - afp;
  const query = `UPDATE empleados SET nombre = ?, apellido = ?, telefono = ?, direccion = ?, sueldo_bruto = ?, sueldo_neto =?, ars = ?, afp = ? WHERE id = ?`;
  db.query(
    query,
    [
      nombre,
      apellido,
      telefono,
      direccion,
      sueldo_bruto,
      sueldo_neto,
      ars,
      afp,
      id,
    ],
    (err, result) => {
      if (err) {
        throw err;
      }
      res.redirect("/");
    }
  );
});

app.get("/delete/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM empleados WHERE id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) {
      throw err;
    }
    res.redirect("/");
  });
});
