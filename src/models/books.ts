import { Schema, model, Document } from 'mongoose';

/**
 * Interfaz BookDocument
 */
export interface BookDocument extends Document {
  title: string;
  author: string;
  genre: 'Fiction' | 'Non-Fiction' | 'Science' | 'History' | 'Fantasy' | 'Biography';
  year: number;
  isbn: string;
  pages: number;
  available: boolean;
  rating?: number;
}

/**
 * Esquema con las especificaciones del guión
 */
const BookSchema = new Schema<BookDocument>({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  author: { 
    type: String, 
    required: true
  },
  genre: { 
    type: String, 
    enum: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Fantasy', 'Biography']
  },
  year: { 
    type: Number, 
    min: 1000,
		max: new Date().getFullYear()
  },
  isbn: { 
    type: String, 
    required: true, 
    unique: true,
    validate: (value: string) => {
			if (value.length !== 13){
				throw new Error('El ISBN debe tener exactamente 13 dígitos');
			}
		}
  },
  pages: { 
    type: Number,  
    min: 1
  },
  available: { 
    type: Boolean, 
    default: true 
  },
  rating: { 
    type: Number, 
    min: 0,
    max: 5
  }
});

export const Book = model<BookDocument>('Book', BookSchema);