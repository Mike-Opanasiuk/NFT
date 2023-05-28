import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../store/hooks';
import { updateAction } from '../../store/reducers/collections';
import { Alert } from '../Alert';
import { tokenUtility } from '../../utils/tokenUtility';
import { makeClient } from '../../api/client';
import { BASE_URL } from '../../react-app-env.d';

import "./TokenCard.scss"

const TokenCard = ({ title, author, update, image, price, id, onClick }: {
    update: () => void
    title: string
    author: string
    image: string
    price?: number
    name: string
    id: string
    onClick: any
}) => {
    onClick();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let [showAlert, setShowAlert] = useState<boolean>();
    let [isAuth, setIsAuth] = useState<boolean>();
    let [errMsg, setErrMsg] = useState<string>("");

    let user = useAppSelector((state) => state.accountSlice.user);

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

    const delItem = () => {
        try {
            const client = makeClient("tokens");

            client.delete(`delete?tokenId=${id}`).then((res) => {
                update();
            }).catch((err) => {
                if (err.response.status == 401) {
                    setErrMsg("Please, login first");
                    setShowAlert(true);
                }
                else if (err.response.status == 400) {
                    setShowAlert(true);
                    setErrMsg(err.response.data.Message);
                }
            });

        } catch (e: any) {
            console.error(e);
        }
    };

    if (showAlert) {
        setTimeout(() => {
            setShowAlert(false);
        }, 5000);
    }
    return (
        <div className='col-md-4'>
            {showAlert ? <Alert message={errMsg}></Alert> : <></>}
            <div className='card'>
                <img
                    src={image == null ? "ImageNotFound.png" : `${BASE_URL}/${image}`}
                    className='card-img-top image-h' alt='Image' />
                <div className='card-body'>
                    <div className='d-flex align-items-center justify-content-between'>
                        <Link className='btn btn-link p-0' to={`/token/${id}`}>{title}</Link>
                    </div>
                    <div className='d-flex align-items-center justify-content-between'>
                        <p className='card-text'>Owner {author}</p>
                        {
                            !!price ? <p className='card-text text-success'>{price}$</p> :
                                <p className='card-text text-white'>{' '}</p>
                        }
                    </div>
                    <div className='d-flex justify-content-between'>
                        {isAuth ?
                            <>
                                <Link className='btn d-block btn-transparent border border-primary' to={`/update-token/${id}`}>Update</Link>
                                <span onClick={delItem} className='btn d-block btn-transparent bg-transparent border border-primary'>
                                    <i className="bi bi-trash3 text-danger"></i>
                                </span>
                            </> : <></>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};


export default TokenCard;