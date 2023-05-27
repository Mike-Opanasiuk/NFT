/// <reference types="react-scripts" />
export interface IUser {
    id: string;
    userName: string;
    password: string;
}

export interface Author {
    id: string;
    userName: string;
    image: string;
}

export interface ICollection {
    id: string;
    name: string;
    image: string;
    author: Author;
    tokens: IToken[];
}

export interface IToken {
    id: string;
    name: string;
    image: string;
    description: string;
    price: number;
    collection: string;
    author: Author;
}


export const BASE_URL = 'https://localhost:5000';
export const BASE_API_URL = `${BASE_URL}/api`;
