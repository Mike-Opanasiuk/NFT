import {  Route, Routes } from 'react-router-dom';
import { About } from './pages/About';
import { AccountInfo } from './pages/AccountInfo';
import Home from './pages/Home';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { Register } from './pages/Register';
import CollectionPage from './pages/CollectionPage';
import UpdateCollection from './pages/UpdateCollection/UpdateCollection';
import { tokenUtility } from './utils/tokenUtility';
import { useDispatch } from 'react-redux';
import { loginAction } from './store/reducers/account';
import { useEffect } from 'react';
import TokensPage from 'pages/TokensPage';
import CollectionsPage from 'pages/CollectionsPage';
import CreateCollection from 'pages/CreateCollection';
// Bob_12345

export const App = () => {
    useEffect(() => {
        // 👇️ scroll to top on page load
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, []);
    //   const user = useAppSelector((state) => state.accountSlice.user);
    //   const isAuth = Boolean(user);
    // const user = useAppSelector((state) => state.accountSlice.user); // TODOAUTH
    // const isAuth = Boolean(user);
    const isAuth = Boolean(tokenUtility.getToken()) ;

    // console.log(isAuth);
    const dispatch = useDispatch();
    dispatch(loginAction(isAuth));


    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/register" element={<Register />}></Route>
                    <Route path="/about" element={<About />}></Route>
                    <Route path="/tokens" element={<TokensPage />}></Route>
                    <Route path="/collections" element={<CollectionsPage />}></Route>
                    <Route path="/collection/create" element={<CreateCollection />}></Route>
                    <Route path="/account" element={<AccountInfo />}></Route>
                    <Route path="/update-collection/:id" element={<UpdateCollection />}></Route>
                    <Route path="/collection/:id" element={<CollectionPage />}></Route>
                    <Route path="*" element={<NotFound />}></Route>
                </Route>
            </Routes>
        </>
    );
};
