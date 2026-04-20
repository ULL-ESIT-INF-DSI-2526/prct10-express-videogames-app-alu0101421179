import axios from 'axios';
import { Category, Question, TriviaParams, APIResponse } from './types_opentdb';

/**
 * Obtiene el listado de categorías de la API 
 * @returns Promesa con el conjunto de categorías
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get('https://opentdb.com/api_category.php');
    const categories = response.data.trivia_categories;
    if (!categories || categories.length === 0) {
      return Promise.reject(new Error('La lista de categorías está vacía'));
    } else {
      return Promise.resolve(categories);
    }
  } catch (error) {
    return Promise.reject(new Error('Error en la petición de categorías'));
  }
};

/**
 * Obtiene una lista de preguntas sacadas de la API
 * @param category - categoría de la pregunta
 * @param difficulty - dificultad de la pregunta (fácil, media, difícil)
 * @param type - tipo de la pregunta (de respuesta múltiple o booleana)
 * @returns Promesa con el conjunto de preguntas que devuelve la API bajo esos parámetros
 */
export const findQuestions = async (category?: number, difficulty?: 'easy' | 'medium' | 'hard', type?: 'multiple' | 'boolean'): Promise<Question[]> => {
  try {
    const params: TriviaParams = { amount: 10 }; 
    if (category) params.category = category;
    if (difficulty) params.difficulty = difficulty;
    if (type) params.type = type;
    const response = await axios.get<APIResponse>('https://opentdb.com/api.php', { params });
    if (response.data.response_code !== 0 || response.data.results.length === 0) {
      return Promise.reject(new Error('No hay resultados para los filtros aplicados'));
    }
    return Promise.resolve(response.data.results);
  } catch (error) {
    return Promise.reject(new Error('Error en la petición de preguntas'));
  }
};