import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL, IToken } from '../../react-app-env.d';
import { makeClient } from 'api/client';

const TokenPage = () => {
    const { id } = useParams();
    
    let [token, setToken] = useState<IToken>();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

        try {
            const client = makeClient("tokens");
            client.get(`${id}`).then((res) => {
                setToken(res.data);
            });
        } catch (e: any) {
            console.log("Error: " + e);
        }
    }, []);

    return (
        <section>
            <div className='container mt-5'>
                <div className='row'>
                    <div className='col-md-8'>
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
                        <p className='text-success h4 d-block'>{token?.price || '0'} ETH</p>
                        <p>
                            {
                                token?.description || 'Lorem ipsum dolor sit amet...'
                            }
                        </p>
                        <button className='btn w-50 d-block btn-primary'>Add to Cart</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TokenPage;