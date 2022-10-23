import React, { useState, useEffect } from 'react'
import Logo from './../Assets/img/AdminLTELogo.png'
import getAxiosInstance from './../Utils/axios'

export default function Menu() {
    const [isMentor, setIsMentor] = useState(false)

    useEffect(() => {
        getAxiosInstance()
            .get("/me")
            .then((res) => setIsMentor(res.data.result.mentor))
            .catch((err) => console.log(err));
    },[])

    return (
        <>
            <aside className="main-sidebar sidebar-light-primary elevation-4">
                <a href="#" className="brand-link">
                    <img src={Logo} alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{opacity: '.8'}} />
                    <span className="brand-text font-weight-light">PMS ADMIN</span>
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

                            <li className={`nav-item ${window.location.pathname.indexOf('technologies') >= 0  && 'menu-is-opening menu-open'}`}>
                                <a href="#" className={`nav-link ${window.location.pathname.indexOf('technologies') >= 0  && 'active'}`}>
                                    <i className="nav-icon fas fa-users" />
                                    <p>
                                        Manage Technologies
                                        <i className="fas fa-angle-left right" />
                                    </p>
                                </a>
                                <ul className="nav nav-treeview">
                                    <li className="nav-item">
                                        <a href="/technologies" className={`nav-link ${window.location.pathname === '/technologies'  && 'active'}`}>
                                            <i className="far fa-circle nav-icon" />
                                            <p>All Technologies</p>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="/technologies/add" className={`nav-link ${window.location.pathname.indexOf('/technologies/add') >= 0  && 'active'}`}>
                                            <i className="far fa-circle nav-icon" />
                                            <p>Add Technologies</p>
                                        </a>
                                    </li>
                                </ul>
                            </li>

                            <li className={`nav-item ${window.location.pathname.indexOf('projects') >= 0  && 'menu-is-opening menu-open'}`}>
                                <a href="#" className={`nav-link ${window.location.pathname.indexOf('projects') >= 0  && 'active'}`}>
                                    <i className="nav-icon fas fa-users" />
                                    <p>
                                        Manage Projects
                                        <i className="fas fa-angle-left right" />
                                    </p>
                                </a>
                                <ul className="nav nav-treeview">
                                    <li className="nav-item">
                                        <a href="/projects" className={`nav-link ${window.location.pathname.indexOf('/projects') >= 0  && 'active'}`}>
                                            <i className="far fa-circle nav-icon" />
                                            <p>Your Projects</p>
                                        </a>
                                    </li>
                                    {isMentor && <li className="nav-item">
                                        <a href="/projects/add" className={`nav-link ${window.location.pathname.indexOf('/add') >= 0  && 'active'}`}>
                                            <i className="far fa-circle nav-icon" />
                                            <p>Add Projects</p>
                                        </a>
                                    </li>}
                                </ul>
                            </li>

                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    )
}
