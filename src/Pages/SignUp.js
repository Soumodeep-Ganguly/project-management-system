import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';
import { BASE_URL } from './../env'
import { Toast } from './../Utils/Toast'

export default function SignUp() {
    const [Email, setEmail] = useState("")
    const [FirstName, setFirstName] = useState("")
    const [LastName, setLastName] = useState("")
    const [Password, setPassword] = useState("")
    const [isMentor, setIsMentor] = useState(false)
    const [ConfirmPassword, setConfirmPassword] = useState("")
    const [IsLoading, setIsLoading] = useState(false)
    let navigate = useNavigate();

    useEffect(() => {
        // Check if is Logged in
        let isLocalAuth = localStorage.getItem('pms_user')
        let isSessionAuth = sessionStorage.getItem('pms_user');

        if(isLocalAuth || isSessionAuth) navigate("/")
    }, [])

    const signUserUp = (e) => {
        e.preventDefault()
        if(FirstName === "") return Toast.fire({ icon: 'error', title: 'First Name required' })
        if(LastName === "") return Toast.fire({ icon: 'error', title: 'Last Name required' })
        if(Email === "") return Toast.fire({ icon: 'error', title: 'Email required' })
        if(Password === "") return Toast.fire({ icon: 'error', title: 'Password required' })
        if(Password !== ConfirmPassword) return Toast.fire({ icon: 'error', title: 'Password does not match.' })
        
        const params = {
            first_name: FirstName,
            last_name: LastName,
            mentor: isMentor,
            email: Email,
            password: Password
        }
    
        setIsLoading(true)
        axios
            .post(BASE_URL+"/sign-up", params,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
            .then((res) => {
                // Validating form
                setIsLoading(false)
                if(res.data.status === 'success'){
                    sessionStorage.setItem('pms_user', res.data.token);
                    Toast.fire({ icon: 'success', title: 'Signed up successfully' })
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
                                <div className="row">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="firstNameField">First Name</label>
                                        <input type="text" className="form-control" id="firstNameField" placeholder="Enter First Name" value={FirstName} onChange={(e) => setFirstName(e.target.value)} />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label htmlFor="lastNameField">Last Name</label>
                                        <input type="text" className="form-control" id="lastNameField" placeholder="Enter Last Name" value={LastName} onChange={(e) => setLastName(e.target.value)} />
                                    </div>
                                </div>
                                <div className="form-group row pl-2 pr-2">
                                    <label htmlFor="emailField">Email</label>
                                    <input type="email" className="form-control" id="emailField" placeholder="Enter Email" value={Email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="form-group row pl-2 pr-2">
                                    <label htmlFor="passwordField">Password</label>
                                    <input type="password" className="form-control" id="passwordField" placeholder="Enter Password" value={Password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="form-group row pl-2 pr-2">
                                    <label htmlFor="confirmPasswordField">Confirm Password</label>
                                    <input type="password" className="form-control" id="confirmPasswordField" placeholder="Enter Password Again" value={ConfirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-6">
                                        <div className="custom-control custom-radio">
                                            <input className="custom-control-input" type="radio" id="isEmployee" name="mentorship" checked={isMentor !== true} onChange={(e) => setIsMentor(false)} />
                                            <label htmlFor="isEmployee" className="custom-control-label">Employee</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="custom-control custom-radio">
                                            <input className="custom-control-input" type="radio" id="isMentor" name="mentorship" checked={isMentor === true} onChange={(e) => setIsMentor(true)} />
                                            <label htmlFor="isMentor" className="custom-control-label">Mentor</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer" style={{ backgroundColor: '#ebebf0' }}>
                                <button type="submit" className="btn btn-dark float-left" onClick={(e) => signUserUp(e)} disabled={IsLoading}>Sign Up</button>
                                <div className="float-right">
                                    Already have an account? 
                                    <Link to="/sign-in" className="ml-2">
                                        Sign In
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
