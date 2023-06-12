import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Author, ICollection } from "../../react-app-env.d";
import { makeClient } from "../../api/client";
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';
import { Alert } from "components/Alert";

export const AccountInfo = () => {
    let [user, setUser] = useState<Author>();
    let [collections, setCollections] = useState<ICollection[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const client = makeClient("account");
        client.get("profile").then((res) => {
            user = res.data;
            setUser(user)
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
    return (
        <div className="container rounded bg-white">
            {showAlert === true ? (
                <Alert message={alertMessage}></Alert>
            ) : (
                <span></span>
            )}
            <div className="row">
                <div className="col-md-3 border-right">
                    <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                        <img
                            className="rounded-circle"
                            width="150px"
                            src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                        />
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
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="labels">Surname</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Surname"
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
                                />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-6">
                                <label className="labels">Country</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Country"
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="labels">State/Region</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="State"
                                />
                            </div>
                        </div>
                        <div className="mt-5 text-center">
                            <Link to="/">
                                <button
                                    className="btn btn-primary profile-button"
                                    type="button"
                                >
                                    Save Profile
                                </button>
                            </Link>
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
    );
};
