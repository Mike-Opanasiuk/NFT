import { makeClient } from '../client';


const client = makeClient("collections");


export interface ICreateRequest {
    name: string
}

const createAsync = (createRequest: ICreateRequest) => {
    return client.post("create", createRequest);
}

export const collectionService = {
    createAsync
}