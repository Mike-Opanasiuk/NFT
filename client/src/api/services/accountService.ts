import { makeClient } from '../client';


const client = makeClient("account");

const loginAsync = (loginRequest: ILoginRequest) => {
    return client.post("login", loginRequest);
}

const registerAsync = (registerRequest: IRegisterRequest) => {
    return client.post("register", registerRequest);
}

export interface ILoginRequest {
    userName : string;
    password : string;
    remember: boolean;
}

export interface IRegisterRequest {
    userName : string;
    password : string;
}

export const accountService = {
    loginAsync,
    registerAsync
}
