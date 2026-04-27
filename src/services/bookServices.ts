import { Book, BookDocument } from '../models/books';
import { FilterQuery } from 'mongoose';

/**
 * Función que crea un libro en la base de datos
 * @param data - datos con los que vamos a crear el libro
 * @returns libro creado y guardado
 */
export const createBook = async (data: Partial<BookDocument>) => {
	const existingBook = await Book.findOne({ isbn: data.isbn });
	if (existingBook) {
		throw new Error('El libro ya existe');
	}
	const book = new Book(data);
	return await book.save();
}

/**
 * Función que nos devuelve todos los libros de la  base de datos
 * @param filter - nos permite filtrar por género y/o autor
 * @returns libros encontrados
 */
export const getBook = async (filter?: { genre?: string, author?: string }) => {
	const query: FilterQuery<BookDocument> = {};
	if (filter?.genre) {
		query.genre = filter.genre;
	}
	if (filter?.author) {
		query.author = filter.author;
	}
	return await Book.find(query);
}

/**
 * Función que nos permite buscar un libro por su id
 * @param id - id a buscar
 * @returns libro encontrado
 */
export const getBookById = async (id: string) => {
	const book = await Book.findById(id);
	if (!book) {
		throw new Error('No se ha encontrado el libro');
	}
	return book;
}

/**
 * Función que nos permite actualizar un libro
 * @param id - id del libro
 * @param data - datos a introducir
 * @returns libro actualizado
 */
export const updateBook = async (id: string, data: Partial<BookDocument>) => {
	  if (data.isbn) {
    delete data.isbn;
  }
  const book = await Book.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!book) {
    throw new Error('No se ha encontrado el libro');
  }
  return book;
};

/**
 * Función que nos permite borrar un libro por su id
 * @param id - id del libro a borrar
 * @returns - libro borrado
 */
export const deleteBookById = async (id: string) => {
	const book = await Book.findByIdAndDelete(id);
	if (!book) {
		throw new Error('No se ha encontrado el libro');
	}
	return book;
}