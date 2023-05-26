/// <reference types="react-scripts" />
export interface IUser {
    id: string;
    userName: string;
    password: string;
}

export interface ICollection {
    id: string;
    name: string;
    image: string;
    author: AUTHOR;
    tokens: Token[];
}

export const BASE_URL = 'https://localhost:5000';
export const BASE_API_URL = `${BASE_URL}/api`;
