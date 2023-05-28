import React from 'react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../../components/Alert';
import { makeClient } from '../../api/client';
import { ICollection } from '../../react-app-env.d';

import './CreateTokenPage.scss';

interface TokenFormData {
    name: string;
    image: string | ArrayBuffer | null | File;
    imageName: string;
    price: number;
    collectionId: string;
    description: string;
}

const CreateTokenPage = () => {
    const [showAlert, setShowAlert] = useState<boolean>();
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [collectionImage, setCollectionImage] = useState<string>("");
    const [userCollections, setUserCollections] = useState<ICollection[]>([]);
    const defaultCollectionText = "Choose collection";

    const [form, setForm] = useState<TokenFormData>({
        name: '',
        image: '',
        imageName: '',
        price: 0,
        collectionId: '',
        description: ''
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const addHandler = () => {
        if (inputRef.current !== null) {
            inputRef.current.click();
        }
    };

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

    const onChange = (e: any) => {
        let file = e.target.files[0];
        if (file) {
            var imagePath = URL.createObjectURL(e.target.files[0]);
            setCollectionImage(imagePath);
            changeHandler('imageName')(file.name);
            const reader = new FileReader();
            reader.onload = _handleReaderLoaded;
            reader.readAsBinaryString(file);
        }
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (inputRef.current !== null) {
            if (inputRef.current.files!![0] == null) {
                setAlertMessage("Please, select image.");
                setShowAlert(true);
                return;
            }
        }
        if (form.collectionId === defaultCollectionText || form.collectionId === '') {
            setAlertMessage("Please, select collection.");
            setShowAlert(true);
            return;
        }
        try {
            const client = makeClient("tokens");

            await client.post("create", form).then(() => {
                navigate("/tokens");
            }).catch((e) => {
                setAlertMessage("Internal server error");
                console.error(e);
                setShowAlert(true);
            });
        } catch (e: any) {
            console.error(e);
            if (e.response.status == 400) {
                setAlertMessage(e.response.data.Message)
            }
            else {
                setAlertMessage("Internal server error");
                navigate("/tokens");
            }
            setShowAlert(true);
        }
    };

    useEffect(() => {
        try {
            const client = makeClient("account");

            client.get("profile").then((res) => {
                var user = res.data;

                client.get(`${user.id}/collections`).then((response) => {
                    setUserCollections(response.data)
                })
            })
        } catch (e: any) {
            setAlertMessage("Internal server error")
            setShowAlert(true);
        }

        if (showAlert) {
            setTimeout(() => {
                setShowAlert(false);
            }, 5000);
        }
    }, []);

    return (
        <div className='d-flex justify-content-center mt-5'>
            {showAlert ? <Alert message={alertMessage}></Alert> : <></>}

            <div className='wrap-img'>
                {!form.image ?
                    <span onClick={() => addHandler()}>
                        <i className="fas fa-image fa-10x"></i>
                    </span>
                    : <img className='form-img'
                        src={collectionImage}
                        alt='form image' />}
            </div>

            <div className='w-75 d-flex justify-content-center'>
                <form className='w-50' onSubmit={(e) => submitHandler(e)}>

                    <div className='form-item mb-3'>
                        <label> Name </label>
                        <input
                            type='text'
                            className='form-control w-100 d-block w-25 me-3'
                            value={form.name}
                            onChange={(e) => changeHandler('name')(e.target.value)} />
                    </div>

                    <div className='form-item mb-3'>
                        <label> Price </label>
                        <input
                            type='number'
                            min={0}
                            className='form-control w-100 d-block w-25 me-3'
                            value={form.price}
                            onChange={(e) => changeHandler('price')(e.target.value)} />
                    </div>

                    <select
                        className='form-select mb-3'
                        onChange={(e) => changeHandler('collectionId')(e.target.value)} >

                        <option> {defaultCollectionText} </option>
                        {
                            userCollections.map((c, index) => (
                                <option key={index} value={c.id} >{c.name}</option>
                            ))
                        }
                    </select>

                    <div className='form-item mb-3'>
                        <label> Description </label>
                        <textarea
                            cols={30}
                            rows={5}
                            className='form-control w-100 d-block w-25 me-3'
                            value={form.description}
                            onChange={(e) => changeHandler('description')(e.target.value)}
                        ></textarea>
                    </div>

                    <div className='form-item mb-3'>
                        <input
                            type='file'
                            accept="image/*"
                            onChange={(e) => onChange(e)}
                            ref={inputRef}
                            className='input-group-lg w-100 d-none' />
                    </div>

                    <button
                        className='btn btn-transparent border border-primary d-block m-auto mt-4'
                        type='submit'>
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTokenPage;