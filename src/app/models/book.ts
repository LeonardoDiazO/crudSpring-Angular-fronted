import { Image } from './image'; 
export interface Book {
    id: number;
    title: string;
    autor: string;
    pages: number;
    price: number;
    image?: Image;
}