import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginAction, loginActionAsync } from '../../store/reducers/account';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { FormComponent } from '../../components/Form';
import { Spinner } from '../../components/Spinner';
import { Alert } from '../../components/Alert';
import React from 'react';

export const Login = () => {
    let [remember, setRemember] = useState<boolean>();
    let [alertMessage, setAlertMessage] = useState<string>("");

    const [showAlert, setShowAlert] = useState<boolean>();
    const status = useAppSelector((state) => state.accountSlice.status);
    const user = useAppSelector((state) => state.accountSlice.user);
    const isAuthenticated = Boolean(user);
    const dispatch = useAppDispatch();
    const nav = useNavigate();

    if (isAuthenticated) {
        dispatch(loginAction(isAuthenticated))
        nav('/');
    }

    const onRememberChange = () => {
        setRemember(!remember);
    };

    const onClickHandle = (data: any) => {
        data.remember = remember;
        dispatch(loginActionAsync(data)).then((res: any) => {
            console.log(res);
            if (res.error.message) {
                setAlertMessage(res.error.message);
                setShowAlert(true);
            }
        }).catch((e) => {
            // if (e.response.status == 400) {
            //     setAlertMessage(e.response.data.message);
            // }
            // else setAlertMessage("Wrong credentials");

            // console.log("set true");
            // setShowAlert(true);

            // console.error(e);
        });
    };

    if (showAlert) {
        setTimeout(() => {
            setShowAlert(false);
        }, 5000);
    }

    return (
        <FormComponent onFinish={onClickHandle}>
            {showAlert ? <Alert message={alertMessage}></Alert> : <></>}
            <div className='container'>
                <div className='row'>
                    <div className='col-4 offset-4'>
                        <div className='form-group'>
                            <label
                                htmlFor='inputUserName'
                                className='form-label mt-4'
                            >
                                Username
                            </label>
                            <input
                                type='text'
                                className='form-control'
                                id='inputUserName'
                                name='userName'
                                placeholder='Enter username'
                            />
                        </div>
                    </div>
                    <div className='col-4 offset-4'>
                        <div className='form-group'>
                            <label
                                htmlFor='inputPassword'
                                className='form-label mt-4'
                            >
                                Password
                            </label>
                            <input
                                type='password'
                                className='form-control'
                                id='inputPassword'
                                name='password'
                                placeholder='Password'
                            />
                        </div>
                    </div>
                    <div className='col-4 offset-4 mt-2'>
                        <div className='form-check'>
                            <input
                                className='form-check-input'
                                type='checkbox'
                                value=''
                                id='flexCheckChecked'
                                name='remember'
                                onClick={onRememberChange}
                            />
                            <label
                                className='form-check-label'
                                htmlFor='flexCheckChecked'
                            >
                                Remember me
                            </label>
                        </div>
                    </div>
                    <div className='col-4 offset-4 mt-5'>
                        <button
                            type='submit'
                            className='btn btn-outline-dark col-12'
                        >
                            {status === 'pending' ? (
                                <Spinner></Spinner>
                            ) : (
                                <span>Login</span>
                            )}
                        </button>

                        <div className='col-6 mt-2'>
                            <Link to='/register'>Register</Link>
                        </div>
                    </div>
                </div>
            </div>
        </FormComponent>
    );
};
