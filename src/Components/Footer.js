import React from 'react'

export default function Footer() {
    return (
        <>
            <footer className="main-footer">
                <strong>Copyright © 2022-2023 <a href={window.location.origin}>PW.app</a>.</strong>
                All rights reserved.
                <div className="float-right d-none d-sm-inline-block">
                    <b>Version</b> 0.0.1
                </div>
            </footer>
        </>
    )
}
