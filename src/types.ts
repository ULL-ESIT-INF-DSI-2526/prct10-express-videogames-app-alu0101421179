/**
 * Plataformas y géneros de videojuegos disponibles en la colección.
 */
export type Platform = 'PC' | 'PlayStation 5' | 'Xbox Series X/S' | 'Nintendo Switch' | 'Steam Deck';
export type Genre = 'Acción' | 'Aventura' | 'Rol' | 'Estrategia' | 'Deportes' | 'Simulación';

/**
 * Interfaz para representar un videojuego en la colección.
 * Incluye propiedades como id, nombre, descripción, plataforma, género, desarrollador, año de lanzamiento,
 * si es multijugador, horas jugadas y valor del juego.
 */
export interface Videogame {
  id: number;
  name: string;
  description: string;
  platform: Platform | string;
  genre: Genre | string;
  developer: string;
  year: number;
  multiplayer: boolean;
  hours: number;
  value: number;
}

/**
 * Tipo para representar la respuesta de las operaciones en la API.
 * Incluye un campo de éxito, un mensaje opcional y una lista opcional de videojuegos.
 */
export type ResponseType = {
  success: boolean;
  message?: string; // Para enviar mensajes de error o éxito
  videogames?: Videogame[]; // Para cuando listemos o leamos juegos
}