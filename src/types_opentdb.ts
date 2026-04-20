/**
 * Interfaz Category con lo que nos devuelve la ruta api_category.php que contiene cada una
 */
export interface Category {
  id: number;
  name: string;
}

/**
 * Interfaz Question con lo que devuelve cada pregunta una vez trabajamos con la API
 */
export interface Question {
  type: string;
  difficulty: string;
	category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

/**
 * Interfaz con los parámetros que nos pide introducir la API cuando queremos hacer una pregunta
 */
export interface TriviaParams {
  amount: number;
  category?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  type?: 'multiple' | 'boolean';
}

/**
 * Interfaz con la respuesta que la API nos devuelve cuando hacemos una pregunta
 */
export interface APIResponse {
  response_code: number;
  results: Question[];
}

