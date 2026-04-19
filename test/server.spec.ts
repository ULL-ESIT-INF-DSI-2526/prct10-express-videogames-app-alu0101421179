import { describe, it, expect } from 'vitest';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:3001/videogames';
const testUser = 'apitester';

describe('Rutas del Servidor Express (server.ts)', () => {
  const testGame = {
    id: 100,
    name: 'API Test Game',
    description: 'Juego desde Express',
    platform: 'PS5',
    genre: 'Aventura',
    developer: 'Sony',
    year: 2023,
    multiplayer: true,
    hours: 30,
    value: 70
  };

  it('POST: Debería añadir un videojuego mediante la API', async () => {
    const response = await axios.post(`${API_URL}?user=${testUser}`, testGame);
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });

  it('GET: Debería listar los videojuegos del usuario', async () => {
    const response = await axios.get(`${API_URL}?user=${testUser}`);
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(Array.isArray(response.data.videogames)).toBe(true);
  });

  it('GET: Debería obtener un videojuego por su ID', async () => {
    const response = await axios.get(`${API_URL}?user=${testUser}&id=100`);
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.videogame.name).toBe('API Test Game');
  });

  it('PATCH: Debería modificar un videojuego', async () => {
    const response = await axios.patch(`${API_URL}?user=${testUser}&id=100`, {
      hours: 100
    });
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.videogame.hours).toBe(100);
  });

  it('DELETE: Debería eliminar el videojuego', async () => {
    const response = await axios.delete(`${API_URL}?user=${testUser}&id=100`);
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });

  it('GET: Debería dar error si no se proporciona usuario', async () => {
    const response = await axios.get(API_URL);
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(false);
  });
});