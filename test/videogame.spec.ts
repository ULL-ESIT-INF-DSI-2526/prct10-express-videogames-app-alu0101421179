import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs/promises';
import { addVideogame, readVideogame, modifyVideogame, deleteVideogame, listVideogames } from '../src/videogames.js';

describe('Operaciones de Sistema de Ficheros (videogames.ts)', () => {
  const testUser = 'testuser';
  const testGame = {
    id: 99,
    name: 'Test Game',
    description: 'Un juego de prueba',
    platform: 'PC',
    genre: 'Acción',
    developer: 'TestDev',
    year: 2024,
    multiplayer: false,
    hours: 10,
    value: 20
  };
  // Limpiamos la carpeta de prueba antes y después de los tests
  beforeAll(async () => {
    await fs.mkdir(`./users/${testUser}`, { recursive: true });
  });
  afterAll(async () => {
    await fs.rm(`./users/${testUser}`, { recursive: true, force: true });
  });

  it('Añadir un videojuego nuevo a la lista', async () => {
    const result = await addVideogame(testUser, testGame);
    expect(result.success).toBe(true);
  });

  it('Dar error al intentar añadir un videojuego con un ID que ya existe', async () => {
    const result = await addVideogame(testUser, testGame);
    expect(result.success).toBe(false);
  });

  it('Leer la información de un videojuego concreto', async () => {
    const result = await readVideogame(testUser, '99');
    expect(result.success).toBe(true);
    expect(result.videogame?.name).toBe('Test Game');
  });

  it('Modificar un videojuego existente', async () => {
    const result = await modifyVideogame(testUser, '99', { hours: 50 });
    expect(result.success).toBe(true);
    expect(result.videogame?.hours).toBe(50);
  });

  it('Listar todos los videojuegos del usuario', async () => {
    const result = await listVideogames(testUser);
    expect(result.success).toBe(true);
    expect(result.videogames?.length).toBe(1);
  });
  
  it('Eliminar un videojuego de la lista', async () => {
    const result = await deleteVideogame(testUser, '99');
    expect(result.success).toBe(true);
  });
});