import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { About } from './pages/About';
import { AccountInfo } from './pages/AccountInfo';
import { CreateCollection } from './pages/CreateCollection';
import Home from './pages/Home';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { Register } from './pages/Register';
import CollectionPage from './pages/CollectionPage';
import { useAppSelector } from './store/hooks';
import Collections from './store/reducers/collections';
import AddCollection from './pages/AddCollection';
import UpdateCollection from './pages/update/UpdateCollection';
import { tokenUtility } from './utils/tokenUtility';
import { useDispatch } from 'react-redux';
import { loginAction } from './store/reducers/account';
import { useEffect } from 'react';
// Bob_12345

export const App = () => {
    useEffect(() => {
        // 👇️ scroll to top on page load
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
      }, []);
    const isAuth = Boolean(tokenUtility.getToken()) ;
    // console.log(isAuth);
    const dispatch = useDispatch();
    dispatch(loginAction(isAuth));


    return (
        <>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home/>}></Route>
                    <Route path="/login" element={<Login/>}></Route>
                    <Route path="/register" element={<Register/>}></Route>
                    <Route path="/about" element={<About/>}></Route>
                    <Route path="/collection/create" element={<CreateCollection/>}></Route>
                    <Route path="/account" element={<AccountInfo/>}></Route>
                    <Route path="/add-collection" element={<AddCollection/>}></Route>
                    <Route path="/update-collection/:id" element={<UpdateCollection/>}></Route>
                    <Route path="/collections/:name" element={<CollectionPage/>}></Route>
                    <Route path="*" element={<NotFound/>}></Route>
                </Route>
            </Routes>
        </>
    );
};