import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import axios from 'axios';
import { useEffect } from 'react';
import { BASE_API_URL } from "../../react-app-env.d";

export const AccountInfo = () => {
    const user = useAppSelector(state => state.accountSlice.user);


    useEffect(() => {

        if (!user) {
            return;
        }
        try {
            axios.get(`${BASE_API_URL}/Account/profile`, {
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": "Bearer " + localStorage.getItem('access_token'),
                }
            }).then((res) => {
                // console.log(res.data);
            })
        }
        catch (e: any) {
            // console.log(e);
            throw new Error(e);
        }
    }, []);

    if(!user)
    {
        return (
            <Link to="/login" className="text-center">
                <h1>Login first . . .</h1>
            </Link>
        )
    }
    // console.log(user);
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
                        <span className="font-weight-bold">{user.userName}</span>
                        <span className="text-black-50">bob@nft.com.ua</span>
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
                                <i className="fa fa-plus"></i>&nbsp;Add collection
                            </button>
                            </Link>
                        </div>
                        <div className="col-md-12">
                            <ul className="list-group">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                Collection [1]
                                    <span className="badge badge-pill bg-warning">
                                        14
                                    </span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Collection [2]
                                    <span className="badge badge-pill bg-warning">
                                        2
                                    </span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                Collection [3]
                                    <span className="badge badge-pill bg-warning">
                                        1
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
