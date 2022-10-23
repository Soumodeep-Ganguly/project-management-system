import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';
import { BASE_URL } from './../env'
import { Toast } from './../Utils/Toast'

export default function SignIn() {
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [RememberMe, setRememberMe] = useState(false)
    const [IsLoading, setIsLoading] = useState(false)
    let navigate = useNavigate();

    useEffect(() => {
        // Check if is Logged in
        let isLocalAuth = localStorage.getItem('pms_user')
        let isSessionAuth = sessionStorage.getItem('pms_user');

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
            .post(BASE_URL+"/sign-in", data,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
            .then((res) => {
                // Validating form
                setIsLoading(false)
                if(res.data.status === 'success'){
                    if(RememberMe) localStorage.setItem('pms_user', res.data.token);
                    else sessionStorage.setItem('pms_user', res.data.token);
                    Toast.fire({ icon: 'success', title: 'Signed in successfully' })
                    window.location.reload()
                } else Toast.fire({ icon: 'error', title: 'Cannot process request' })
            })
            .catch((err) => {
                setIsLoading(false)
                // console.log(err);
                Toast.fire({ icon: 'error', title: err?.response?.data?.message })
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
                                <button type="submit" className="btn btn-dark float-left" onClick={(e) => signUserIn(e)} disabled={IsLoading}>Sign in</button>
                                <div className="float-right">
                                    Don't have an account? 
                                    <Link to="/sign-up" className="ml-2">
                                        Sign Up
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
