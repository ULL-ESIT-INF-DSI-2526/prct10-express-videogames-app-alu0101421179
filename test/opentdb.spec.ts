import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { getCategories, findQuestions } from '../src/opentdb'; 
import { response } from 'express';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('API Trivia', () => {
  describe('Función getCategories', () => {
    it('Devolver las categorías si la API responde bien', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { trivia_categories: [{ id: 10, name: 'Entertainment: Books' }] }
      });
      const resultado = await getCategories();
      expect(resultado).toEqual([{ id: 10, name: 'Entertainment: Books' }]);
    });

    it('Debería rechazar con error si la petición falla', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Error en la red'));
      await expect(getCategories()).rejects.toThrow('Error en la petición de categorías');
    });
  });

  describe('Función findQuestions', () => {
    it('Devolver las preguntas si hay resultados', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { response_code: 0, results: [{ question: '¿Test?', correct_answer: 'Sí' }] }
      });
      const resultado = await findQuestions(9, 'easy', 'boolean');
      expect(resultado).toHaveLength(1);
      expect(resultado[0].question).toBe('¿Test?');
    });

    it('Debería rechazar con error si la API dice que no hay resultados', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { response_code: 1, results: [] }
      });
      await expect(findQuestions(999)).rejects.toThrow('No hay resultados para los filtros aplicados');
    });

  });
});

