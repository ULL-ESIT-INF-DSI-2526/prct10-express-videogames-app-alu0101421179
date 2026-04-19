import fs from 'fs/promises';
import { Videogame, ResponseType } from './types.js';

// Usamos async/await porque estamos trabajando con Promesas
/**
 * Función para añadir un videojuego a la lista de un usuario. Crea un archivo JSON con los datos del videojuego.
 * @param user - El nombre del usuario al que se le va a añadir el videojuego
 * @param videogame - Un objeto con los datos del videojuego a añadir (debe cumplir la interfaz Videogame)
 * @returns - Un objeto con el resultado de la operación (success: boolean, message: string)
 */
export const addVideogame = async (user: string, videogame: Videogame): Promise<ResponseType> => {
  // Siguiendo la estructura típica: una carpeta por usuario
  const userDir = `./users/${user}`;
  const filePath = `${userDir}/${videogame.id}.json`;
  try {
    //Nos aseguramos de que la carpeta del usuario exista (si no, la crea)
    await fs.mkdir(userDir, { recursive: true });
    try {
      // Comprobamos si el fichero de ese videojuego ya existe
      await fs.access(filePath);
      // Si fs.access NO falla, significa que el archivo ya existe (devolvemos error)
      return { 
        success: false, 
        message: `El videojuego con ID ${videogame.id} ya existe en la lista de ${user}.` 
      };
    } catch {
      // Si fs.access falla, el archivo NO existe, así que podemos crear el nuevo videojuego
      // Convertimos el objeto videogame a un texto JSON 
      await fs.writeFile(filePath, JSON.stringify(videogame, null, 2));
      return { 
        success: true, 
        message: `Videojuego añadido correctamente a la lista de ${user}.` 
      };
    }
  } catch (error) {
    // Si falla el mkdir o hay algún problema de permisos 
    return { 
      success: false, 
      message: 'Error interno del servidor al acceder al sistema de ficheros.' 
    };
  }
};

/**
 * Función para leer un videojuego de la lista de un usuario. Lee el archivo JSON correspondiente al ID del videojuego y devuelve su contenido como objeto JavaScript.
 * @param user - El nombre del usuario al que pertenece el videojuego
 * @param id - El ID del videojuego que se quiere leer
 * @returns - Un objeto con el resultado de la operación (success: boolean, message: string, videogame?: Videogame)
 */
export const readVideogame = async (user: string, id: string) => {
  const filePath = `./users/${user}/${id}.json`;
  try {
    // Intentamos leer el archivo de texto
    const data = await fs.readFile(filePath, 'utf-8');
    // Si lo lee con éxito, lo convertimos a objeto JavaScript
    const videogame = JSON.parse(data);
    return { 
      success: true, 
      message: 'Videojuego encontrado',
      videogame: videogame 
    };
  } catch (error) {
    // Significa que fs.readFile ha fallado (el archivo no existe)
    return { 
      success: false, 
      message: `Error: No se encontró un videojuego con ID ${id} en la lista de ${user}.` 
    };
  }
};

/**
 * Función para modificar un videojuego de la lista de un usuario. Lee el archivo JSON correspondiente al ID del videojuego, actualiza los campos indicados y vuelve a escribir el archivo con los nuevos datos.
 * @param user - El nombre del usuario al que pertenece el videojuego
 * @param id - El ID del videojuego que se quiere modificar
 * @param updatedFields - Un objeto con los campos que se quieren actualizar (puede contener cualquier subconjunto de las propiedades de Videogame)
 * @returns - Un objeto con el resultado de la operación (success: boolean, message: string, videogame?: Videogame)
 */
export const modifyVideogame = async (user: string, id: string, updatedFields: Partial<Videogame>) => {
  const filePath = `./users/${user}/${id}.json`;
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const currentVideogame: Videogame = JSON.parse(data); // Tipamos lo que leemos
    const newVideogame: Videogame = { ...currentVideogame, ...updatedFields };
    newVideogame.id = Number(id); // Nos aseguramos de que el ID no se modifique 
    await fs.writeFile(filePath, JSON.stringify(newVideogame, null, 2));
    return { 
      success: true, 
      message: `Videojuego con ID ${id} modificado correctamente.`,
      videogame: newVideogame 
    };
  } catch (error) {
    return { 
      success: false, 
      message: `Error: No se puede modificar. No existe el videojuego con ID ${id} para el usuario ${user}.` 
    };
  }
};

/**
 * Función para eliminar un videojuego de la lista de un usuario. Elimina el archivo JSON correspondiente al ID del videojuego.
 * @param user - El nombre del usuario al que pertenece el videojuego
 * @param id -  El ID del videojuego que se quiere eliminar
 * @returns - Un objeto con el resultado de la operación (success: boolean, message: string)
 */
export const deleteVideogame = async (user: string, id: string) => {
  const filePath = `./users/${user}/${id}.json`;
  try {
    // fs.unlink es la función nativa de Node para eliminar un archivo físico
    await fs.unlink(filePath);
    return { 
      success: true, 
      message: `Videojuego con ID ${id} eliminado correctamente de la lista de ${user}.` 
    };
  } catch (error) {
    // Si fs.unlink falla, significa que el archivo no existía en primer lugar
    return { 
      success: false, 
      message: `Error: No se puede eliminar. No existe el videojuego con ID ${id} para el usuario ${user}.` 
    };
  }
};

/**
 * Función para listar todos los videojuegos de la lista de un usuario. Lee todos los archivos JSON de la carpeta del usuario, los convierte a objetos JavaScript y devuelve un array con todos los videojuegos.
 * @param user - El nombre del usuario del que se quieren listar los videojuegos
 * @returns - Un objeto con el resultado de la operación (success: boolean, message: string, videogames?: Videogame[])
 */
export const listVideogames = async (user: string) => {
  const userDir = `./users/${user}`;
  try {
    // Leemos los nombres de todos los archivos en la carpeta del usuario
    const files = await fs.readdir(userDir);
    const videogames = [];
    for (const file of files) {
      // Nos aseguramos de leer solo los .json 
      if (file.endsWith('.json')) {
        const data = await fs.readFile(`${userDir}/${file}`, 'utf-8');
        videogames.push(JSON.parse(data));
      }
    }
    return { 
      success: true, 
      message: `Colección de ${user} recuperada con éxito.`,
      videogames: videogames // Devolvemos el array completo
    };
  } catch (error) {
    // Si falla readdir, es que la carpeta del usuario no existe (no tiene juegos)
    return { 
      success: false, 
      message: `Error: No se encontró ninguna colección para el usuario ${user}.` 
    };
  }
};