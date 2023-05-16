import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ICollection } from '../Home';
import { BASE_API_URL, BASE_URL } from '../../react-app-env.d';

const CollectionPage = () => {
    useEffect(() => {
        // 👇️ scroll to top on page load
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, []);
    let url: string = `${BASE_API_URL}/Collections?SearchString=`;
    const { id } = useParams();
    let [data, setData] = useState<ICollection>();
    // console.log(name);
    useEffect(() => {
        try {
            axios.get(BASE_API_URL + `/Collections/${id}`).then((res) => {
                setData(res.data);
            });
        } catch (e: any) {
            // console.error(e);
            console.log("Error: " + e);
        }
    }, []);


    return (
        <section>
            <div className='container mt-5'>
                <div className='row'>
                    <div className='col-md-6'>
                        <img
                            src={data?.image == null ?
                                '../ImageNotFound.png'
                                 : `${BASE_URL}/${data?.image}`}
                            alt='Product image' />
                    </div>
                    <div className='col-md-6'>
                        <h2>{data?.name}</h2>
                        <p className='text-muted'>{
                            data?.tokens[0]?.author?.userName || 'One-Gem-123'
                        }</p>
                        <p className='text-success h4 d-block'>{data?.tokens[0]?.price || '145'}$</p>

                        <p>
                            {
                                data?.tokens[0]?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ullamcorper malesuada justo,non posuere quam tempus vitae.'
                            }
                        </p>
                        <div className='d-flex align-items-center'>
                            {/*<input type='number' className='form-control w-25 me-3' value={number}*/}
                            {/*       onChange={(e) => setNumber(+e.target.value)} min='1' />*/}
                        </div>
                        <button className='btn w-50 d-block btn-primary'>Add to Cart</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CollectionPage;