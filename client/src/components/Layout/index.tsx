import { Outlet } from "react-router"
import { Navbar } from "../Navbar"
import '../../index.css';
import { Footer } from "../Footer";
import React from "react";

export const Layout = () => {
    return (
        <div className="yellow">
            <div className="container d-flex flex-column min-vh-100">
                <Navbar></Navbar>
                    <Outlet />
                <Footer></Footer>
            </div>
        </div>
    )
}