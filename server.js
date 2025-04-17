// Cargar las variables del archivo .env
require('dotenv').config();

const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

// Configuración para servir archivos estáticos (form.js)
app.use(express.static(path.join(__dirname)));  // Sirve archivos desde la raíz del proyecto

// Configuración de Multer para manejar la carga de archivos
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).single('file');



// Configuración de la base de datos MySQL utilizando las variables de entorno
const db = mysql.createConnection({
  host: process.env.DB_HOST,  // Usando la variable de entorno
  user: process.env.DB_USER,  // Usando la variable de entorno
  password: process.env.DB_PASSWORD,  // Usando la variable de entorno
  database: process.env.DB_NAME, // Usando la variable de entorno
});

db.connect((err) => {
  if (err) return console.error('Error DB:', err);
  console.log('Conectado a MySQL');
});

// Ruta para servir el archivo 'contacto.html' desde la carpeta 'reference'
app.get('/contacto.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'reference', 'contacto.html'));
});

// Ruta para subir la imagen
app.post('/upload-image', (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ message: 'Error al subir imagen', error: err });

    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No se subió ningún archivo' });

    try {
   
     // const photo_reference = `http://localhost:${process.env.PORT}/uploads/${file.filename}`;
     const photo_reference = `https://foto.producto.jook.lat/uploads/${file.filename}`;

      // Guardar la URL de la imagen en la base de datos
      const query = 'INSERT INTO images (name, image_url) VALUES (?, ?)';
      await db.promise().query(query, [file.originalname, photo_reference]);

      // Retornar la URL de la imagen al frontend
      res.status(200).json({ message: 'Imagen subida correctamente', photo_reference });

    } catch (err) {
      res.status(500).json({ message: 'Error al guardar en la base de datos', error: err });
    }
  });
});

// Servir imágenes desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Iniciar el servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});
