import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL, IToken } from '../../react-app-env.d';
import { makeClient } from 'api/client';
import { Alert } from 'components/Alert';

const TokenPage = () => {
    const { id } = useParams();

    const navigate = useNavigate();
    let [token, setToken] = useState<IToken>();
    let [showAlert, setShowAlert] = useState<boolean>();
    let [alertMessage, setAlertMessage] = useState<string>("");

    const buyToken = () => {
        var client = makeClient("tokens");

        client.post(`buy-now/${id}`, '').then((res) => {
            navigate("/tokens");
        }).catch((e) => {
            if (e.response.status === 400) {
                setAlertMessage(e.response.data.Message)
                // console.log(e.response.data.Message)
            }
            else if (e.response.status === 401) {
                setAlertMessage("Please, login first.")
                // console.log(e.response.data.Message)
            }
            else {
                setAlertMessage("Internal server error.")
            }
            setShowAlert(true);

            // console.log(Object.getOwnPropertyNames(e.respons.data));
            // console.error("Error: " + e);
        });
    }

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

        const client = makeClient("tokens");
        client.get(`${id}`).then((res) => {
            setToken(res.data);
        }).catch((e) => {
            console.error("Error: " + e);
        });


    }, []);

    if (showAlert) {
        setTimeout(() => {
            setShowAlert(false);
        }, 5000);
    }
    return (
        <section>
            {showAlert === true ? (
                <Alert message={alertMessage}></Alert>
            ) : (
                <span></span>
            )}
            <div className='container mt-5'>
                <div className='row'>
                    <div className='col-md-8 p-0 pe-5'>
                        <img className='w-100'
                            src={token?.image == null ?
                                '../ImageNotFound.png'
                                : `${BASE_URL}/${token?.image}`}
                            alt='Token image' />
                    </div>
                    <div className='col-md-4'>
                        <h2>{token?.name}</h2>
                        <p className='text-muted'>by @{
                            token?.author?.userName || 'anonymous'
                        }</p>
                        <h5>Price: <span className='text-success h4'>{token?.price || '0'} ETH</span></h5>
                        <button className='btn w-75 d-block btn-primary' onClick={buyToken}>Buy now</button>
                    </div>
                </div>
                <div className='row mt-4'>
                    {
                        token?.currentOwner ?
                            <p className='text-muted'>owner @{
                                token?.currentOwner?.userName || 'anonymous'
                            }</p>
                            : <></>
                    }
                    <p>
                        {
                            token?.description || 'Lorem ipsum dolor sit amet...'
                        }
                    </p>

                </div>
            </div>
        </section>
    );
};

export default TokenPage;