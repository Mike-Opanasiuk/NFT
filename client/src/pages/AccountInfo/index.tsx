import React, { useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Author, ICollection } from "../../react-app-env.d";
import { makeClient } from "../../api/client";
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';
import { Alert } from "components/Alert";
import { useAppSelector } from "store/hooks";
import { BASE_URL } from "../../react-app-env.d";

interface IUpdateUser {
    id: string | any;
    name: string;
    surname: string;
    image: string;
    imageName: string;
    mobilePhone: string;
    country: string;
    region: string;
    moneyAvailable: number;
    userName: string;
}

export const AccountInfo = () => {
    let [user, setUser] = useState<IUpdateUser>();
    let [collections, setCollections] = useState<ICollection[]>([]);
    let [userImage, setUserImage] = useState<string>("");

    useEffect(() => {
        const client = makeClient("account");
        client.get("profile").then((res) => {
            user = res.data;
            setForm({
                id: '',
                name: res.data.name || '',
                surname: res.data.surname || '',
                image: '',
                imageName: BASE_URL + '/' + res.data.image,
                moneyAvailable: res.data.moneyAvaialble || 0,
                region: res.data.region || '',
                userName: res.data.userName || '',
                country: res.data.country || '',
                mobilePhone: res.data.mobilePhone || ''
            });
            setUser(user);
            setUserImage(BASE_URL + '/' + res.data.image);
            const client = makeClient("account");
            client.get(`${user?.id}/collections`).then((res) => {
                setCollections(res.data);
            });

        }).catch((e: any) => {
            console.error(e);
            navigate("/not-found")
        });

    }, []);

    const moneyCount = useRef<HTMLInputElement>(null);
    let [showAlert, setShowAlert] = useState<boolean>();
    let [alertMessage, setAlertMessage] = useState<string>("");
    const [form, setForm] = useState<IUpdateUser>({
        id: '',
        name: '',
        surname: '',
        region: '',
        country: '',
        mobilePhone: '',
        image: '',
        imageName: '',
        moneyAvailable: 0,
        userName: ''
    });

    const inputRef = React.useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleClose = () => {
        setIsModalVisible(false)
    }
    const replenishMoney = () => {
        setIsModalVisible(false)
        if (!moneyCount.current?.value) return;
        const client = makeClient("account");
        client.post(`replenish/${moneyCount.current?.value}`, '').then((res) => {
            console.log("Success!")
            setAlertMessage(`${moneyCount.current?.value} ETH were successfully added.`)
            setShowAlert(true);
        }).catch((e: any) => {
            setAlertMessage(`Internal server error.`)
            setShowAlert(true);
            console.error(e);
        });
    }
    const handleShow = () => setIsModalVisible(true);
    if (showAlert) {
        setTimeout(() => {
            setShowAlert(false);
        }, 5000);
    }

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
            var client = makeClient("account");

            client.put("update", {
                name: form.name,
                surname: form.surname,
                image: form.image,
                imageName: `${Date.now()}.png`,
                mobilePhone: form.mobilePhone,
                region: form.region,
                country: form.country
            }).then((res) => {
                navigate("/")
            }).catch((e) => {
                console.error("error")
            } )
        } catch (e: any) {
            setAlertMessage("An error has occured")
            setShowAlert(true);
        }
    };

    const onChange = (e: any) => {
        let file = e.target.files[0];
        if (file) {
            var imagePath = URL.createObjectURL(e.target.files[0]);
            setUserImage(imagePath);
            setForm({
                ...form,
                imageName: file.name
            })
            const reader = new FileReader();
            reader.onload = _handleReaderLoaded;
            reader.readAsBinaryString(file);
        }

    };
    return (
        <form onSubmit={(e) => submitHandler(e)}>
            <div className="container rounded bg-white">
                {showAlert === true ? (
                    <Alert message={alertMessage}></Alert>
                ) : (
                    <span></span>
                )}
                <div className="row">
                    <div className="col-md-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">

                            <p className='mb-4 d-flex flex-column align-items-center w-100' onClick={() => {
                                if (inputRef.current !== null) {
                                    inputRef.current.click();
                                }
                            }}>
                                <img
                                    className="rounded mx-auto"
                                    width="150px"
                                    src={userImage || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"}
                                />
                            </p>

                            <span className="font-weight-bold">{user?.userName}</span>
                            <span className="text-black-50">{user?.userName}@nft.com.ua</span>

                            <Button className="nextButton mt-3" onClick={handleShow}>
                                Replenish ETH ({user?.moneyAvailable || ''})
                            </Button>

                            <Modal show={isModalVisible} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Put ETH on your account</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <span>ETH count: </span>
                                    <input type="number" name="moneyCount"
                                        id="moneyCount" min={0} defaultValue={0} ref={moneyCount} />
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                    <Button variant="primary" onClick={replenishMoney}>
                                        Buy
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                    <div className="col-md-5 border-right">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">Profile Settings</h4>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <label className="labels">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Name"
                                        onChange={(e) => changeHandler('name')(e.target.value)} value={form.name}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">Surname</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Surname"
                                        onChange={(e) => changeHandler('surname')(e.target.value)} value={form.surname}
                                    />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <label className="labels">Mobile Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter phone number"
                                        onChange={(e) => changeHandler('mobilePhone')(e.target.value)} value={form.mobilePhone}
                                    />
                                </div>
                            </div>
                            <div className='d-flex flex-column mb-5 w-50 d-none'>
                                <input type='file' ref={inputRef} onChange={(e) => onChange(e)} />
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <label className="labels">Country</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Country"
                                        onChange={(e) => changeHandler('country')(e.target.value)} value={form.country}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">State/Region</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Region"
                                        onChange={(e) => changeHandler('region')(e.target.value)} value={form.region}
                                    />
                                </div>
                            </div>
                            <div className="mt-5 text-center">
                                {/* <Link to="/"> */}
                                    <button
                                        className="btn btn-primary profile-button"
                                        type='submit'
                                    >
                                        Save Profile
                                    </button>
                                {/* </Link> */}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center experience mb-2">
                                <span>Collections</span>
                                <Link to="/collection/create">
                                    <button className="border px-3 p-1 add-experience bg-dark text-white">
                                        <i className="fa fa-plus"></i> Add collection
                                    </button>
                                </Link>
                            </div>
                            <div className="col-md-12">
                                <ul className="list-group">
                                    {
                                        collections.map((collection, index) => (
                                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                {collection.name}
                                                <span className="badge badge-pill bg-warning">
                                                    {collection.tokens.length}
                                                </span>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};
