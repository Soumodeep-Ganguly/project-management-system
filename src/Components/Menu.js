import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import Logo from './../Assets/img/AdminLTELogo.png'

export default function Menu() {
    return (
        <>
            <aside className="main-sidebar sidebar-light-primary elevation-4">
                <a href="#" className="brand-link">
                    <img src={Logo} alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{opacity: '.8'}} />
                    <span className="brand-text font-weight-light">PW ADMIN</span>
                </a>
                <div className="sidebar">
                    <nav style={{ marginTop: 80 }}>
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            <li className="nav-item active">
                                <a href="/" className={`nav-link ${window.location.pathname === '/' && 'active'}`}>
                                    <i className="nav-icon fas fa-th" />
                                    <p>
                                        Dashboard
                                    </p>
                                </a>
                            </li>

                            <li className={`nav-item ${window.location.pathname.indexOf('user') >= 0  && 'menu-is-opening menu-open'}`}>
                                <a href="#" className={`nav-link ${window.location.pathname.indexOf('user') >= 0  && 'active'}`}>
                                    <i className="nav-icon fas fa-users" />
                                    <p>
                                        Manage Users
                                        <i className="fas fa-angle-left right" />
                                    </p>
                                </a>
                                <ul className="nav nav-treeview">
                                    <li className="nav-item">
                                        <a href="/all-users" className={`nav-link ${window.location.pathname.indexOf('/all-users') >= 0  && 'active'}`}>
                                            <i className="far fa-circle nav-icon" />
                                            <p>All Users</p>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="/add-user" className={`nav-link ${window.location.pathname.indexOf('/add-user') >= 0  && 'active'}`}>
                                            <i className="far fa-circle nav-icon" />
                                            <p>Add Users</p>
                                        </a>
                                    </li>
                                </ul>
                            </li>

                            <li className={`nav-item ${window.location.pathname.indexOf('/location') >= 0  && 'menu-is-opening menu-open'}`}>
                                <a href="#" className={`nav-link ${window.location.pathname.indexOf('/location') >= 0  && 'active'}`}>
                                    <i className="nav-icon fas fa-location-arrow" />
                                    <p>
                                        Locations
                                        <i className="fas fa-angle-left right" />
                                    </p>
                                </a>
                                <ul className="nav nav-treeview">
                                    <li className="nav-item">
                                        <a href="/location/countries" className={`nav-link ${window.location.pathname.indexOf('/countries') >= 0  && 'active'}`}>
                                            <i className="far fa-circle nav-icon" />
                                            <p>Countries</p>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="/location/states" className={`nav-link ${window.location.pathname.indexOf('/states') >= 0  && 'active'}`}>
                                            <i className="far fa-circle nav-icon" />
                                            <p>States</p>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="/location/cities" className={`nav-link ${window.location.pathname.indexOf('/cities') >= 0  && 'active'}`}>
                                            <i className="far fa-circle nav-icon" />
                                            <p>Cities</p>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="/location/buildings" className={`nav-link ${window.location.pathname.indexOf('/buildings') >= 0  && 'active'}`}>
                                            <i className="far fa-circle nav-icon" />
                                            <p>Buildings</p>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="/location/floors" className={`nav-link ${window.location.pathname.indexOf('/floors') >= 0  && 'active'}`}>
                                            <i className="far fa-circle nav-icon" />
                                            <p>Floors</p>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="/location/screens" className={`nav-link ${window.location.pathname.indexOf('/screens') >= 0  && 'active'}`}>
                                            <i className="far fa-circle nav-icon" />
                                            <p>Screens</p>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    )
}
