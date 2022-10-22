import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios';
import { BASE_URL } from './../env'

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

export default function SignIn() {
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [RememberMe, setRememberMe] = useState(false)
    const [IsLoading, setIsLoading] = useState(false)
    let navigate = useNavigate();

    useEffect(() => {
        // Check if is Logged in
        let isLocalAuth = localStorage.getItem('pw_user')
        let isSessionAuth = sessionStorage.getItem('pw_user');

        if(isLocalAuth || isSessionAuth) navigate("/")
    }, [])

    const signUserIn = (e) => {
        e.preventDefault()
        if(Email === "") return Toast.fire({ icon: 'error', title: 'Email required' })
        if(Password === "") return Toast.fire({ icon: 'error', title: 'Password required' })
        
        const params = {
            email: Email,
            password: Password
        }
    
        // converting (json --> form-urlencoded)
        const data = Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
    
        setIsLoading(true)
        axios
            .post(BASE_URL+"/admin/login", data,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
            .then((res) => {
                // Validating form
                setIsLoading(false)
                if(res.data.status === 'success'){
                    if(RememberMe) sessionStorage.setItem('pw_remember', "true");
                    sessionStorage.setItem('pw_email', res.data.email);
                    // console.log(res.data);
                    Toast.fire({ icon: 'success', title: `OTP sent to your email.` })
                    navigate("/two-step-verification")
                    // window.location.reload()
                } else if(res.data.status === "error") Toast.fire({ icon: 'error', title: res.data.message })
                else Toast.fire({ icon: 'error', title: 'Cannot process request' })
            })
            .catch((err) => {
                setIsLoading(false)
                console.log(err);
                Toast.fire({ icon: 'error', title: 'Please Try Again' })
            })
    }

    return (
        <>
            <div className="row justify-content-center mt-5">
                <div className="col-md-5">
                    <div className="card" style={{ backgroundColor: '#ebebf0', borderRadius: 20, padding: 10 }}>
                        <form className="form-horizontal">
                            <div className="card-body">
                                <div className="form-group row">
                                    <label htmlFor="emailField">Email</label>
                                    <input type="email" className="form-control" id="emailField" placeholder="Enter your Email" value={Email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="passwordField">Password</label>
                                    <input type="password" className="form-control" id="passwordField" placeholder="Enter your Password" value={Password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="form-group row">
                                    <div className="col-6">
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="rememberMe" onChange={(e) => setRememberMe(!RememberMe)} defaultChecked={RememberMe} />
                                            <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-check float-right">
                                            <Link to="/add-user">
                                                Forgot password
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer" style={{ backgroundColor: '#ebebf0' }}>
                                <button type="submit" className="btn btn-dark float-right" onClick={(e) => signUserIn(e)}>Log in</button>
                                {/* <button type="submit" className="btn btn-default float-right">Cancel</button> */}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
