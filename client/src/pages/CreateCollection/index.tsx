import React, { FormEvent, useRef, useState } from 'react';
import './CreateCollection.scss';
import axios from 'axios';
import { BASE_API_URL } from '../../react-app-env.d';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../../components/Alert';
import { tokenUtility } from 'utils/tokenUtility';

interface FormData {
    name: string;
    image: string | ArrayBuffer | null | File;
    imageName: string;

}

const CreateCollection = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState<FormData>({
        name: '',
        image: '',
        imageName: '1234'
    });
    const inputRef = useRef<HTMLInputElement>(null);

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
    const authToken = localStorage.getItem('access_token');

    let [showAlert, setShowAlert] = useState<boolean>();
    let [alertMessage, setAlertMessage] = useState<string>("");

    let [collectionImage, setCollectionImage] = useState<string>("");

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log(form);
        if (inputRef.current !== null) {
            if (inputRef.current.files!![0] == null) {
                alert('Please select image');
                return;
            }
        }
        await axios.post(`${BASE_API_URL}/Collections/create`, {
            name: form.name,
            image: form.image,
            imageName: form.imageName
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
            }
        }).then((res) => {
            navigate("/collections");
        }).catch((e) => {
            if (e.response.status == 400) {
                setAlertMessage(e.response.data.Message)
                setShowAlert(true);
            }
            else {
                navigate("/");
            }
        });

    };

    return (
        <div className='d-flex justify-content-center mt-5'>
            {showAlert === true ? (
                <Alert message={alertMessage}></Alert>
            ) : (
                <span></span>
            )}
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
                        <label>
                            Collection Name
                        </label>
                        <input type='text' className='form-control w-100 d-block w-25 me-3' value={form.name}
                            onChange={(e) => changeHandler('name')(e.target.value)} />
                    </div>
                    <div className='form-item mb-3'>
                        <input type='file'
                            accept="image/*"
                            onChange={(e) => onChange(e)}
                            ref={inputRef} className='input-group-lg w-100' />
                    </div>
                    <button className='btn btn-search' type='submit'>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCollection;