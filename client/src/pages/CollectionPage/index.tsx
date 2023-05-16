import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { IItem } from '../Home';
import { BASE_API_URL, BASE_URL } from '../../react-app-env.d';

const CollectionPage = () => {
    let url: string = `${BASE_API_URL}/Collections?SearchString=`;
    const { name } = useParams();
    const [data, setData] = useState<IItem[]>([]);
    const [number, setNumber] = useState<number>(1);
    // console.log(name);
    useEffect(() => {
        axios.get(url + name).then((res) => {
            Array.from(res.data.collections).forEach((item: any) => {
                // console.log(item);
                if (item.name === name) {
                    setData([item]);
                }
            });
        });
        // console.log(data,"data");
    }, []);


    return (
        <section>
            <div className='container mt-5'>
                <div className='row'>
                    <div className='col-md-6'>
                        <img
                            src={`${BASE_URL}/` + data[0]?.image ?? 'https://azk.imgix.net/images/ee1d0116-ff80-4a31-a4a9-33bc554c4a0e.png?w=2048'}
                            alt='Product image' className='img-fluid' />
                    </div>
                    <div className='col-md-6'>
                        <h2>{data[0]?.name}</h2>
                        <p className='text-muted'>{
                            data[0]?.tokens[0]?.author?.userName || 'One-Gem-123'
                        }</p>
                        <p className='text-success h4 d-block'>{data[0]?.tokens[0]?.price || '145'}$</p>

                        <p>
                            {
                                data[0]?.tokens[0]?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ullamcorper malesuada justo,non posuere quam tempus vitae.'
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