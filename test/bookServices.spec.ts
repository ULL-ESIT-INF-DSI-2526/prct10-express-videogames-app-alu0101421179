import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { Book } from '../src/models/books'; 
import * as BookService from '../src/services/bookServices';

describe('Pruebas para libros', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/library-app');
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
  beforeEach(async () => {
    await Book.deleteMany({});
  });
  const validBook = {
    title: 'El Señor de los Anillos',
    author: 'Tolkien',
    genre: 'Fantasy' as const, 
    year: 1954,
    isbn: '9780261102385',
    pages: 1178,
  };
  describe('Creación de libros', () => {
    it('Crear un libro con datos válidos', async () => {
      const book = await BookService.createBook(validBook);
      expect(book).toBeDefined();
      expect(book.title).toBe(validBook.title);
      expect(book.available).toBe(true); 
    });
    
    it('Fallar al intentar crear un libro con campos obligatorios sin completar', async () => {
      const invalidBook = { title: 'Libro chungo' };
      await expect(BookService.createBook(invalidBook)).rejects.toThrow();
    });

    it('Fallar al intentar crear un libro con un ISBN duplicado', async () => {
      await BookService.createBook(validBook);
      await expect(BookService.createBook(validBook)).rejects.toThrow('El libro ya existe');
    });
  });

  describe('Obtención de libros', () => {
    it('Obtener todos los libros si no hay filtros', async () => {
      await BookService.createBook(validBook);
      await BookService.createBook({ ...validBook, isbn: '1111111111111', title: 'Otro libro' });
      const books = await BookService.getBook();
      expect(books).toHaveLength(2);
    });

    it('Obtener libros filtrando por género y autor', async () => {
      await BookService.createBook(validBook); 
      await BookService.createBook({ ...validBook, isbn: '1111111111111', genre: 'Science', author: 'Carl Sagan' });
      const tolkienBooks = await BookService.getBook({ author: 'Tolkien' });
      expect(tolkienBooks).toHaveLength(1);
      expect(tolkienBooks[0].author).toBe('Tolkien');
      const scienceBooks = await BookService.getBook({ genre: 'Science' });
      expect(scienceBooks).toHaveLength(1);
      expect(scienceBooks[0].genre).toBe('Science');
    });

    it('Obtener un libro según su ID', async () => {
      const created = await BookService.createBook(validBook);
      const found = await BookService.getBookById(created.id);
      expect(found).not.toBeNull();
      expect(found.title).toBe(validBook.title);
    });
  });

  describe('Actualización de libros', () => {
    it('Acttualizar los datos de un libro', async () => {
      const created = await BookService.createBook(validBook);
      const updated = await BookService.updateBook(created.id, { 
        title: 'Título Modificado',
        pages: 2000,
        isbn: '9999999999999' 
      });
      expect(updated.title).toBe('Título Modificado');
      expect(updated.pages).toBe(2000);
      expect(updated.isbn).toBe(validBook.isbn); 
    });

    it('Fallar al intentar actualizar un libro con un ID inexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      await expect(BookService.updateBook(fakeId, { title: 'Nuevo Título' })).rejects.toThrow('No se ha encontrado el libro');
    });
  });

  describe('Eliminación de libros', () => {
    it('Eliminar un libro según su ID', async () => {
      const created = await BookService.createBook(validBook);
      const deleted = await BookService.deleteBookById(created.id);
      expect(deleted.title).toBe(validBook.title);
      const dbCheck = await Book.findById(created.id);
      expect(dbCheck).toBeNull();
    });
  });
});