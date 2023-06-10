import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../store/hooks';
import { updateAction } from '../../store/reducers/collections';
import { Alert } from '../Alert';
import { BASE_API_URL, BASE_URL } from '../../react-app-env.d';
import { tokenUtility } from '../../utils/tokenUtility';
import { makeClient } from '../../api/client';

import React from 'react';
import axios from 'axios';

import "./CollectionCard.scss"

const CollectionCard = ({ title, author, update, image, id, onClick }: {
    update: () => void
    title: string
    author: string
    image: string
    name: string
    id: string
    onClick: any
}) => {
    onClick();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let [showAlert, setShowAlert] = useState<boolean>();

    const viewCollection = () => {
        navigate(`/collection/${id}`);
    };
    const authToken = localStorage.getItem('access_token');

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
            }).catch((e: any) => {
                console.error(e);
            });
        }
    }, []);

    let [errMsg, setErrMsg] = useState<string>("");
    const delItem = () => {
        axios.delete(`${BASE_API_URL}/Collections/delete?CollectionId=${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
            }
        }).then((res) => {
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
    };

    const setUpdate = () => {
        dispatch(updateAction(id));
        navigate(`/update-collection/${id}`);
    }
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
                        <h5 className='btn btn-link p-0' onClick={viewCollection}>{title}</h5>
                    </div>
                    <div className='d-flex align-items-center justify-content-between'>
                        <p className='card-text'>Owner {author}</p>
                    </div>
                    <div className='d-flex justify-content-between'>
                        {isAuth ?
                            <>
                                <span onClick={setUpdate} className='btn d-block btn-transparent border border-primary'>Update</span>
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


export default CollectionCard;