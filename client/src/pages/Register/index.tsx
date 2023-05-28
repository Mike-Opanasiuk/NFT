import React from "react";
import { Link, Navigate } from "react-router-dom";
import { registerActionAsync } from "../../store/reducers/account";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { FormComponent } from "../../components/Form";
import { Spinner } from "../../components/Spinner";

export const Register = () => {
    const dispatch = useAppDispatch();

    const onClickHandle = (data: any) => {
        dispatch(registerActionAsync(data));
    }

    const status = useAppSelector(state => state.accountSlice.status);
    const user = useAppSelector(state => state.accountSlice.user);

    if (user) {
        return <Navigate to="/" />;
    }

    return (
        <FormComponent onFinish={onClickHandle}>
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
                    <div className="col-4 offset-4 mt-5">
                        <Link to="/login" className="text-decoration-none"><button type="button" className="btn btn-outline-dark col-5">
                            Login instead</button></Link>
                        <button type="submit" className="btn btn-outline-dark col-5 offset-2" onClick={onClickHandle}>
                            {status === 'pending' ? (
                                <Spinner></Spinner>
                            ) : (
                                <span>Register</span>
                            )}</button>
                    </div>
                </div>
            </div>
        </FormComponent>
    );
};
