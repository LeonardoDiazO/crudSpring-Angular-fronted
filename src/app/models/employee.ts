import { Image } from './image';

export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    department: string;
    salary: number;
    hireDate: Date;
    phone: string;
    image?: Image;
}
