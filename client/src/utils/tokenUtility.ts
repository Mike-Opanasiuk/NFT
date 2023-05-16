const TOKEN_ITEM_NAME:string = 'access_token';

const getToken = () => {
    return localStorage.getItem(TOKEN_ITEM_NAME);
}

const getBearerToken = () => {
    const token = getToken();
    if (token) {
        return 'Bearer ' + getToken();
    }
    return null;
}

const setToken = (token : string) => {
    localStorage.setItem(TOKEN_ITEM_NAME, token);
}

const clearToken = () => {
    localStorage.removeItem(TOKEN_ITEM_NAME);
}

export const tokenUtility = { getToken, getBearerToken, setToken, clearToken };