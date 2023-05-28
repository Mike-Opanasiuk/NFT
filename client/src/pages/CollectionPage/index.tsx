import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BASE_API_URL, BASE_URL, ICollection } from '../../react-app-env.d';

const CollectionPage = () => {
    const { id } = useParams();
    let [data, setData] = useState<ICollection>();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

        axios.get(BASE_API_URL + `/Collections/${id}`).then((res) => {
            setData(res.data);
        }).catch((e) => {
            console.log(e);
        });
    }, []);


    return (
        <section>
            <div className='container mt-5'>
                <div className='row'>
                    <div className='col-md-6'>
                        <img className='w-75'
                            src={data?.image == null ?
                                '../ImageNotFound.png'
                                : `${BASE_URL}/${data?.image}`}
                            alt='Product image' />
                    </div>
                    <div className='col-md-6'>
                        <h2>{data?.name}</h2>
                        <p className='text-muted'> @{
                            data?.author?.userName || 'anonymous'
                        }</p>
                        <p>
                            {
                                data?.tokens[0]?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ullamcorper malesuada justo,non posuere quam tempus vitae.'
                            }
                        </p>
                        <button className='btn w-50 d-block btn-primary'>Add to Cart</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CollectionPage;