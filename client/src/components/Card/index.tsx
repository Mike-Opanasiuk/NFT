import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateAction } from '../../store/reducers/collections';

import "./Card.scss"
import { Alert } from 'components/Alert';
import { BASE_API_URL, BASE_URL } from '../../react-app-env.d';
import { useAppSelector } from 'store/hooks';
import { tokenUtility } from 'utils/tokenUtility';
import { makeClient } from 'api/client';

const Card = ({ title, author, update, image, price, id, onClick }: {
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
    // console.log(id, 'id');
    const navigate = useNavigate();
    // console.log(title, 'title');
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
            });
        }
    }, []);

    let [errMsg, setErrMsg] = useState<string>("");
    const delItem = () => {
        try {
            axios.delete(`${BASE_API_URL}/Collections/delete?CollectionId=${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                }
            }).then((res) => {
                // res.status === 200 ? alert('deleted') : alert('error' + res.status + res.statusText);
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
                // console.log(Object.getOwnPropertyNames(err.response.data));
                // else if(err.response)

                // alert("Please login before deleting collection");
                // console.log(Object.getOwnPropertyNames(err));
                // alert(err)
            });
        } catch (e: any) {
            console.error(e);
            // throw new Error(e);
        }
    };

    //atob() method decodes a base-64 encoded string.

    const setUpdate = () => {
        // console.log(id, 'id');
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
            {showAlert === true ? (
                <Alert message={errMsg}></Alert>
            ) : (
                <span></span>
            )}
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
                        {
                            !!price ? <p className='card-text text-success'>{price}$</p> :
                                <p className='card-text text-white'>{' '}</p>
                        }
                    </div>
                    <div className='d-flex justify-content-between'>
                        {/* <span onClick={viewCollection} className='btn d-block btn-primary'>View collection</span> */}
                        {isAuth ?
                            <span onClick={setUpdate} className='btn d-block btn-transparent border border-primary'>Update</span> : <></>
                        }
                        {isAuth ?
                            <span onClick={delItem} className='btn d-block btn-transparent bg-transparent border border-primary'>
                                <i className="bi bi-trash3 text-danger"></i>
                            </span>
                            : <></>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Card;