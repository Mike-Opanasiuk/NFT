import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert } from 'components/Alert';
import { BASE_URL, BASE_API_URL } from '../../react-app-env.d';


interface IItem {
    id: string;
    name: string;
    image: string;
    imageName: string;
}

const UpdateCollection = () => {
    useEffect(() => {
        // 👇️ scroll to top on page load
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, []);
    // console.log(id);
    const { id } = useParams();
    useEffect(() => {
        try {
            axios.get(BASE_API_URL + `/Collections/${id}`).then((res) => {
                if(res.data.image) {
                    setCollectionStartImage(BASE_URL + '/' + res.data.image);
                }
                else {
                    setCollectionStartImage("../ImageNotFound.png");
                }
                changeHandler('name')(res.data.name);
            });
        } catch (e: any) {
            // console.error(e);
            console.log("Error: " + e);
        }
    }, []);

    const [status, setStatus] = useState<string>('');
   
    let [collectionStartImage, setCollectionStartImage] = useState<string>("");
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [form, setForm] = useState<IItem>({
        id: '',
        name: '',
        image: '',
        imageName: ''
    });
    const navigate = useNavigate();
    const idImage: string = useAppSelector((state) => state.collectionSlice.idUpdated);
    const _handleReaderLoaded = (readerEvt: any) => {
        let binaryString = readerEvt.target.result;
        // console.log(btoa(binaryString));
        changeHandler('image')(btoa(binaryString));
    };

    const changeHandler = (fieldName: string) => (value: string) => {
        setForm({
            ...form,
            [fieldName]: value
        });
    };
    let [showAlert, setShowAlert] = useState<boolean>();
    let [alertMessage, setAlertMessage] = useState<string>("");

    // console.log(idImage,"idddd");

    const submitHandler = async (e: any) => {
        e.preventDefault();
        // console.log(idImage);
        try {
            await axios.put(`${BASE_API_URL}/Collections/update`, {
                id: idImage as string,
                name: form.name,
                image: form.image,
                imageName: `${Date.now()}.jpg`,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
            }).then((res) => {
                // console.log(form);
                // console.log(res);
                if (res.data) {
                    // console.log(res.data);
                }
                if (res.status === 200) {
                    // alert('updated successfully');
                    navigate('/');
                }
                if (res.status) {
                    setStatus(res.statusText);
                    // console.log(res.status, res.statusText);
                }
                if (res.data === undefined) {
                    setAlertMessage('Collection not found')
                    setShowAlert(true);
                    // alert('Collection not found');
                    navigate('/');
                    // throw new Error('Collection not found');
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

                // alert(error.response)
                // throw new Error(error);
            });
        } catch (e: any) {
            // console.error(e);
            // setAlertMessage(e.response)
            setAlertMessage("An error has occured")
            setShowAlert(true);

            // throw new Error(e);
        }
    };
    const onChange = (e: any) => {
        let file = e.target.files[0];
        // console.log(file);
        if (file) {
            var imagePath = URL.createObjectURL(e.target.files[0]);
            setCollectionStartImage(imagePath);
            // console.log("12345578");
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
            {showAlert === true ? (
                <Alert message={alertMessage}></Alert>
            ) : (
                <span></span>
            )}

            <h1 className='mb-5 d-flex flex-column align-items-center w-100'>Update collection</h1>
            <p className='mb-4 d-flex flex-column align-items-center w-100' onClick={() => {
                if (inputRef.current !== null) {
                    inputRef.current.click();
                }
            }}>
                <img height="300px" src={collectionStartImage}></img>
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
                        <label htmlFor='title' className='mb-3'>Collection Name</label>
                        <input type='text' onChange={(e) => changeHandler('name')(e.target.value)} value={form.name} />
                    </div>
                    <div className='d-flex flex-column mb-5 w-50 d-none'>
                        <label htmlFor='title' className='mb-3'>Collection Image</label>
                        <input type='file' ref={inputRef} onChange={(e) => onChange(e)} />
                    </div>
                    <button className='btn btn-dark w-50 d-block' type='submit'>Update</button>
                </form>
            </div>

        </div>
    );
};

export default UpdateCollection;