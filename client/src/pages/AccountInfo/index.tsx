import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { ICollection, IUser } from "../../react-app-env.d";
import { makeClient } from "../../api/client";

export const AccountInfo = () => {
    let [user, setUser] = useState<IUser>();
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

    return (
        <div className="container rounded bg-white">
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
                        <span> </span>
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
                                    collections.map(collection => (
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
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
