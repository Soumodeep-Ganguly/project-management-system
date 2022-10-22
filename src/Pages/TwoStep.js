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

export default function TwoStep() {
    const [Email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [RememberMe, setRememberMe] = useState(false)
    const [IsLoading, setIsLoading] = useState(false)
    let navigate = useNavigate();

    useEffect(() => {
        // Check if is Logged in
        let isLocalAuth = localStorage.getItem('pw_user')
        let isSessionAuth = sessionStorage.getItem('pw_user');

        if(isLocalAuth || isSessionAuth) navigate("/")
    }, [])

    useEffect(() => {
        // Check user data
        let remember = sessionStorage.getItem('pw_remember')
        if(remember) setRememberMe(true)
        let email = sessionStorage.getItem('pw_email');
        if(email) setEmail(email)
    }, [])

    const signUserIn = (e) => {
        e.preventDefault()
        const params = { email: Email, otp: otp }
    
        // converting (json --> form-urlencoded)
        const data = Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
    
        setIsLoading(true)
        axios
            .post(BASE_URL+"/admin/two-step-verification", data,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
            .then((res) => {
                // Validating form
                setIsLoading(false)
                if(res.data.status === 'success'){
                    if(RememberMe) localStorage.setItem('pw_user', res.data.token);
                    else sessionStorage.setItem('pw_user', res.data.token);
                    // console.log(res.data);
                    // navigate("/")
                    Toast.fire({ icon: 'success', title: 'Signed in successfully' })
                    window.location.reload()
                } else if(res.data.status === "error") Toast.fire({ icon: 'error', title: res.data.message })
                else Toast.fire({ icon: 'error', title: 'Cannot process request' })
            })
            .catch((err) => {
                setIsLoading(false)
                console.log(err);
                Toast.fire({ icon: 'error', title: 'Please Try Again' })
            })
    }

    const resendOtp = (e) => {
        e.preventDefault()
        const params = { email: Email, otp: otp }
    
        // converting (json --> form-urlencoded)
        const data = Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
    
        setIsLoading(true)
        axios
            .post(BASE_URL+"/admin/resend-otp", data,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
            .then((res) => {
                // Validating form
                setIsLoading(false)
                if(res.data.status === 'success') Toast.fire({ icon: 'success', title: `OTP sent to ${Email}` })
                else if(res.data.status === "error") Toast.fire({ icon: 'error', title: res.data.message })
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
                    <div className="card" style={{ backgroundColor: '#ebebf0', borderRadius: 20, padding: 20 }}>
                        <form className="form-horizontal">
                            <div className="card-body">
                                <div className="form-group row justify-content-center">
                                    <h4>OTP Verification</h4>
                                </div>
                                <div className="form-group row justify-content-center">
                                    <small className="col-8 text-center">
                                        Enter 4 Digit otp number that we send to <br/> {Email}
                                    </small>
                                </div>
                                <div className="form-group row justify-content-center">
                                    <input type="text" className="form-control col-6" id="emailField" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                                </div>
                                <div className="form-group row justify-content-center">
                                    <small className="col-8 text-center">
                                        Didn't Recieve OTP? <b style={{ cursor: 'pointer' }} onClick={(e) => resendOtp(e)}>Resend</b>
                                    </small>
                                </div>
                                <div className="row justify-content-center">
                                    <button type="submit" className="btn btn-dark" style={{ width: 180 }}onClick={(e) => signUserIn(e)}>Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
