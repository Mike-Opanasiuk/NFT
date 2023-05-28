import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="text-center text-lg-start bg-light text-muted mt-5">
            <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
                <div className="me-5 d-none d-lg-block">
                    <span>Get connected with us on social networks:</span>
                </div>

                <div>
                    <a href="" className="me-4 text-reset">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="" className="me-4 text-reset">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="" className="me-4 text-reset">
                        <i className="fab fa-google"></i>
                    </a>
                    <a href="" className="me-4 text-reset">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="" className="me-4 text-reset">
                        <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="" className="me-4 text-reset">
                        <i className="fab fa-github"></i>
                    </a>
                </div>
            </section>

            <section className="">
                <div className="container text-center text-md-start mt-5">
                    <div className="row mt-3">
                        <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                <i className="fas fa-gem me-3"></i>NFT Marketplace
                            </h6>
                            <p>
                                Here you can buy, sell and discover different nft products!
                            </p>
                        </div>

                        <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                Products
                            </h6>
                            <p>
                                <Link to="/" className="text-reset">Home</Link>
                            </p>
                            <p>
                                <Link to="/login" className="text-reset">Login</Link>
                            </p>
                            <p>
                                <Link to="/register" className="text-reset">Register</Link>
                            </p>
                            <p>
                                <Link to="/" className="text-reset">Pay</Link>
                            </p>
                        </div>

                        <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                Useful links
                            </h6>
                            <p>
                                <a href="#!" className="text-reset">
                                    Pricing
                                </a>
                            </p>
                            <p>
                                <a href="#!" className="text-reset">
                                    Settings
                                </a>
                            </p>
                            <p>
                                <a href="#!" className="text-reset">
                                    Orders
                                </a>
                            </p>
                            <p>
                                <a href="#!" className="text-reset">
                                    Help
                                </a>
                            </p>
                        </div>

                        <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
                            <p>
                                <i className="fas fa-home me-3"></i> Lviv
                            </p>
                            <p>
                                <i className="fas fa-envelope me-3"></i>
                                nft.com
                            </p>
                            <p>
                                <i className="fas fa-phone me-3"></i> +380 67 333 11 11
                            </p>
                            <p>
                                <i className="fas fa-print me-3"></i> +380 67 444 11 11
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="text-center p-4">
                © 2023 Copyright:
                <a className="text-reset fw-bold" href="https://mdbootstrap.com/">
                    NFT.com
                </a>
            </div>
        </footer>
    );
};
