import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { registerActionAsync } from "../../store/reducers/account";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { FormComponent } from "../../components/Form";
import { Spinner } from "../../components/Spinner";
import { Alert } from "components/Alert";
import { makeClient } from "api/client";

export const Register = () => {
    const dispatch = useAppDispatch();
    let [alertMessage, setAlertMessage] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>();

    const onClickHandle = async (data: any) => {
        dispatch(registerActionAsync(data)).then((res: any) => {
            console.log(res);
            console.log(res.error.errors);
            console.log(res.error.message)
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
    }

    const status = useAppSelector(state => state.accountSlice.status);
    const user = useAppSelector(state => state.accountSlice.user);

    if (user) {
        return <Navigate to="/" />;
    }

    if (showAlert) {
        setTimeout(() => {
            setShowAlert(false);
        }, 5000);
    }
    return (
        <FormComponent onFinish={onClickHandle}>
            {showAlert ? <Alert message={alertMessage}></Alert> : <></>}
            <div className="container">
                <div className="row">
                    <div className="col-4 offset-4">
                        <div className="form-group">
                            <label
                                htmlFor="userName"
                                className="form-label mt-4"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="userName"
                                placeholder="Enter username"
                                name="username"
                            />
                        </div>
                    </div>
                    <div className="col-4 offset-4">
                        <div className="form-group">
                            <label
                                htmlFor="password"
                                className="form-label mt-4"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Password"
                                name="password"
                            />
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
                                <span>Register</span>
                            )}
                        </button>

                        <div className='col-6 mt-2'>
                            <Link to='/login'>Login instead</Link>
                        </div>
                    </div>
                </div>
            </div>
        </FormComponent>
    );
};
