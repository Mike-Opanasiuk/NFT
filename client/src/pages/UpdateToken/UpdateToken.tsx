import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAppSelector } from '../../store/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert } from '../../components/Alert';
import { BASE_URL, BASE_API_URL, ICollection } from '../../react-app-env.d';
import { makeClient } from 'api/client';


interface IUpdateToken {
    id: string | any;
    name: string;
    image: string;
    imageName: string;
    description: string;
    price: number;
    collectionId: string;
}

const UpdateCollection = () => {
    const [status, setStatus] = useState<string>('');
    let [tokenImage, setTokenImage] = useState<string>("");
    let [showAlert, setShowAlert] = useState<boolean>();
    let [alertMessage, setAlertMessage] = useState<string>("");
    let [currentCollection, setCurrentCollection] = useState<ICollection>();

    const [form, setForm] = useState<IUpdateToken>({
        id: '',
        name: '',
        image: '',
        imageName: '',
        price: 0,
        collectionId: '',
        description: ''
    });

    const inputRef = React.useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const idImage: string = useAppSelector((state) => state.collectionSlice.idUpdated);
    const [userCollections, setUserCollections] = useState<ICollection[]>([]);
    const defaultCollectionText = "Choose collection";


    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        try {
            axios.get(BASE_API_URL + `/Tokens/${id}`).then((res) => {
                if (res.data.image) {
                    setTokenImage(BASE_URL + '/' + res.data.image);
                }
                else {
                    setTokenImage("../ImageNotFound.png");
                }
                let gotColId = res.data.collection.id;
                setCurrentCollection(res.data.collection);
                setForm({
                    id: '',
                    name: res.data.name,
                    image: '',
                    imageName: BASE_URL + '/' + res.data.image,
                    price: res.data.price,
                    collectionId: res.data.collection.id,
                    description: res.data.description
                });

                const accountClient = makeClient("account");

                accountClient.get("profile").then((res) => {
                    var user = res.data;

                    accountClient.get(`${user.id}/collections`).then((response) => {
                        var collections = response.data.filter((col: ICollection) => col.id != gotColId)

                        setUserCollections(collections)
                    })
                }).catch((e) => {
                    console.error(e);
                    setAlertMessage("Internal server error")
                    setShowAlert(true);
                })
            });
        } catch (e: any) {
            console.log("Error: " + e);
        }
    }, []);



    const _handleReaderLoaded = (readerEvt: any) => {
        let binaryString = readerEvt.target.result;
        changeHandler('image')(btoa(binaryString));
    };

    const changeHandler = (fieldName: string) => (value: string) => {
        setForm({
            ...form,
            [fieldName]: value
        });
    };

    const submitHandler = async (e: any) => {
        e.preventDefault();
        try {
            if (currentCollection?.name === defaultCollectionText || currentCollection?.id === '') {
                setAlertMessage("Please, select collection.");
                setShowAlert(true);
                return;
            }
            console.log(currentCollection?.id);
            await axios.put(`${BASE_API_URL}/Tokens/update`, {
                id: id,
                name: form.name,
                image: form.image,
                imageName: `${Date.now()}.jpg`,
                price: form.price,
                collectionId: form.collectionId,
                description: form.description
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then((res) => {
                if (res.status === 200) {
                    navigate('/tokens');
                }
                if (res.status) {
                    setStatus(res.statusText);
                }
                if (res.data === undefined) {
                    setAlertMessage('Token not found')
                    setShowAlert(true);
                    navigate('/tokens');
                }
            }).catch((error) => {
                if (error.response && error.response.status) {
                    if (error.response.status == 401) {
                        setAlertMessage("Please, login first");
                        setShowAlert(true);
                    }
                    else if (error.response.status == 400) {
                        setAlertMessage(error.response.data.Message)
                        setShowAlert(true);
                    }
                }
            });
        } catch (e: any) {
            setAlertMessage("An error has occured")
            setShowAlert(true);
        }
    };

    const onChange = (e: any) => {
        let file = e.target.files[0];
        if (file) {
            var imagePath = URL.createObjectURL(e.target.files[0]);
            setTokenImage(imagePath);
            setForm({
                ...form,
                imageName: file.name
            })
            const reader = new FileReader();
            reader.onload = _handleReaderLoaded;
            reader.readAsBinaryString(file);
        }

    };
    if (showAlert) {
        setTimeout(() => {
            setShowAlert(false);
        }, 5000);
    }

    return (
        <div className='mt-5'>
            {showAlert ? <Alert message={alertMessage}></Alert> : <></>}

            <h1 className='mb-5 d-flex flex-column align-items-center w-100'>Update token</h1>
            <p className='mb-4 d-flex flex-column align-items-center w-100' onClick={() => {
                if (inputRef.current !== null) {
                    inputRef.current.click();
                }
            }}>
                <img height="300px" src={tokenImage}></img>
            </p>
            <div>
                <div className={'d-none'}>
                    Your image:
                    <div>
                        <img src={`data:image/png;base64,${form.image}`} alt='image' />
                    </div>
                </div>
                {!!status && <div className='alert h2 alert-danger'><p className='text-black'>
                    {status}
                </p></div>}
                <form onSubmit={(e) => submitHandler(e)} className='d-flex flex-column align-items-center w-100'>
                    <div className='d-flex flex-column mb-5 w-50'>
                        <label className='mb-3'>Token Name</label>
                        <input type='text' onChange={(e) => changeHandler('name')(e.target.value)} value={form.name} />
                        <div className='form-item mb-3'>
                        <label className='mb-3 mt-3'>Price</label>

                            <input
                                type='number'
                                min={0}
                                className='form-control w-100 d-block w-25 me-3'
                                value={form.price}
                                onChange={(e) => changeHandler('price')(e.target.value)} />
                        </div>

                        <label className='mb-3'>Collection</label>
                        <select
                            className='form-select mb-3'
                            onChange={(e) => changeHandler('collectionId')(e.target.value)} >

                            <option> {currentCollection?.name} </option>
                            {
                                userCollections.map((c, index) => (
                                    <option key={index} value={c.id} >{c.name}</option>
                                ))
                            }
                        </select>

                        <div className='form-item mb-3'>
                        <label className='mb-3'>Description</label>
                            <textarea
                                cols={30}
                                rows={5}
                                className='form-control w-100 d-block w-25 me-3'
                                value={form.description}
                                onChange={(e) => changeHandler('description')(e.target.value)}
                            ></textarea>
                        </div>

                        <div className='d-flex flex-column mb-5 w-50 d-none'>
                            <label className='mb-3'>Token Image</label>
                            <input type='file' ref={inputRef} onChange={(e) => onChange(e)} />
                        </div>

                    </div>

                    <button className='btn btn-dark w-50 d-block' type='submit'>Update</button>
                </form>
            </div>

        </div>
    );
};

export default UpdateCollection;