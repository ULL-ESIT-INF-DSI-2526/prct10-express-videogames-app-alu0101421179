import express from 'express';
import { addVideogame, readVideogame, modifyVideogame, deleteVideogame, listVideogames } from './videogames.js';

const app = express();
const PORT = 3001;

// Para que Express entienda el cuerpo de las peticiones como JSON
app.use(express.json());

// Petición POST para añadir un videojuego
app.post('/videogames', (req, res) => {
  // Sacamos el nombre del usuario 
  const user = req.query.user as string;
  const videogame = req.body;
  if (!user) {
    // Si no nos pasan el usuario en la URL, devolvemos error
    res.send({ success: false, message: 'Debes proporcionar un usuario en la consulta (?user=nombre)' });
  } else {
    addVideogame(user, videogame).then((response) => {
      res.send(response); // Enviamos el resultado (éxito o error) de vuelta al cliente
    });
  }
});

app.get('/videogames', (req, res) => {
  const user = req.query.user as string;
  const id = req.query.id as string;
  // Si no hay usuario, lanzamos error sí o sí
  if (!user) {
    res.send({ 
      success: false, 
      message: 'Debes proporcionar un usuario (?user=nombre)' 
    });
    return; 
  }
  // Si hay ID, buscamos solo ese juego
  if (id) {
    readVideogame(user, id).then((response) => {
      res.send(response);
    });
  } 
  // Si no hay ID, listamos toda la colección del usuario
  else {
    listVideogames(user).then((response) => {
      res.send(response);
    });
  }
});

app.patch('/videogames', (req, res) => {
  // Sacamos el usuario y el ID de la URL
  const user = req.query.user as string;
  const id = req.query.id as string;
  // Sacamos los datos a cambiar del cuerpo de la petición (Postman)
  const updatedFields = req.body; 
  if (!user || !id) {
    res.send({ 
      success: false, 
      message: 'Debes proporcionar un usuario y un ID (?user=edu&id=1)' 
    });
  } else {
    // Llamamos a la función
    modifyVideogame(user, id, updatedFields).then((response) => {
      res.send(response);
    });
  }
});

app.delete('/videogames', (req, res) => {
  const user = req.query.user as string;
  const id = req.query.id as string;
  if (!user || !id) {
    res.send({ 
      success: false, 
      message: 'Debes proporcionar un usuario y un ID (?user=edu&id=1)' 
    });
  } else {
    // Llamamos a la función de borrado
    deleteVideogame(user, id).then((response) => {
      res.send(response);
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de videojuegos ejecutándose en http://localhost:${PORT}`);
});