import { Link } from 'react-router-dom';
import { loginAction, logoutAction } from '../../store/reducers/account';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { tokenUtility } from '../../utils/tokenUtility';
import { useEffect, useReducer, useState } from 'react';
import { IUser } from 'react-app-env';
import { makeClient } from 'api/client';

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

    // user = useAppSelector((state) => state.accountSlice.user);




    // useEffect(() => {
    //     setIsAuth(Boolean(tokenUtility.getToken()));
    // }, []);



    // const isAuth = Boolean(tokenUtility.getToken()) ;
    // if (isAuthenticated) {
    //     dispatch(loginAction(isAuthenticated))
    //     nav('/');
    // }
    // console.log(isAuth);
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

                {/* <li className="nav-item">
        <Link to="/bla" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Features</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Pricing</a>
        </li> */}

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
