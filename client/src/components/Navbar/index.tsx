import React from 'react';
import { Link } from 'react-router-dom';
import { loginAction, logoutAction } from '../../store/reducers/account';
import { tokenUtility } from '../../utils/tokenUtility';
import { useEffect, useState } from 'react';
import { makeClient } from '../../api/client';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export const Navbar = () => {
    let user = useAppSelector((state) => state.accountSlice.user);

    let [isAuth, setIsAuth] = useState<boolean>();
    useEffect(() => {
        setIsAuth(Boolean(user));
    }, [user])

    useEffect(() => {
        let token = tokenUtility.getToken()

        if (!user && token) {
            const client = makeClient("account");
            client.get("profile").then((res) => {
                user = res.data;
                setIsAuth(true);
            });
        }
    }, []);
    const dispatch = useAppDispatch();

    const onLogout = () => {
        dispatch(logoutAction());
        dispatch(loginAction(false))
        tokenUtility.clearToken();
        setIsAuth(false);
    };
    return (
        <nav className='navbar navbar-expand-lg neon-blue'>
            <div className='container-fluid'>
                <Link className='navbar-brand' to='/'>
                    NFT
                </Link>

                <div className='collapse navbar-collapse' id='navbarColor01'>
                    <ul className='navbar-nav me-auto'>
                        <li className='nav-item'>
                            <Link to='/collections' className='nav-link'>
                                Collections
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/tokens' className='nav-link'>
                                Tokens
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/about' className='nav-link'>
                                About
                            </Link>
                        </li>
                    </ul>
                </div>
                {isAuth ? (
                    <div>
                        <Link to='/collection/create' className='me-2'>
                            <button className='btn btn-secondary align-self-end'>
                                + Create collection
                            </button>
                        </Link>
                        <Link to='/token/create' className='me-2'>
                            <button className='btn btn-secondary align-self-end'>
                                + Create token
                            </button>
                        </Link>

                        <button className='btn btn-secondary align-self-end' onClick={onLogout}>
                            Logout
                        </button>
                        <Link to='/account'>
                            <i className='far fa-user-circle fa-2x align-middle'></i>
                        </Link>
                    </div>
                ) : (
                    <div>
                        <Link to='/login' className='me-2'>
                            <button className='btn btn-secondary align-self-end'>
                                Login
                            </button>
                        </Link>
                        <Link to='/register'>
                            <button className='btn btn-secondary align-self-end'>
                                Register
                            </button>
                        </Link>
                    </div>
                )}



                {/* <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Dropdown</a>
                    <div className="dropdown-menu">
                        <a className="dropdown-item" href="#">Action</a>
                        <a className="dropdown-item" href="#">Another action</a>
                        <a className="dropdown-item" href="#">Something else here</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#">Separated link</a>
                    </div>
                </li> */}
            </div>
        </nav>
    );
};
