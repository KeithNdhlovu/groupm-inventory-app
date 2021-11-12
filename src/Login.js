import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { apiService } from './api'
import logo from "./logo.png"


export default function Login() {
    
    const [payload, setPayload] = useState({
        email: "",
        password: ""
    })

    useEffect(() => {
        // We need to add a blocked class to the body so we can customize the look and feel
        document.body.classList.add('app-background')

        return () => {
            document.body.classList.remove('app-background')
        }
    }, [])

    const handleInputChange = (event) => {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name

        setPayload({...payload, [name]: value})
    }

    const _handleLogin = async () => {

        // create account
        if (payload.email.length === 0 || payload.password.length === 0) {
            Swal.fire({
                title: "Error Occurred.",
                text: "Please fill in required fields"
            })
            return;
        }

        // validation passed, create or login
        await apiService.client.auth.signIn(payload)
        window.location.reload()
    }

    return (
        <div className="valign-wrapper h-100">
            <div id="login-page" className="row">
                <br/><br/>
                <div className="col s12 z-depth-4 card-panel">
                    <form id="login-form" className="login-form" noValidate="novalidate">
                        <div className="row">
                            <div className="input-field col s12 center">
                                <img src={logo} alt="" className="logo-image login-image responsive-img" />
                                <p className="no-margin">Welcome to our Inventory system, we strive to keep things in order and always up to date.</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <input 
                                    id="email" 
                                    name="email" 
                                    type="text"
                                    onChange={handleInputChange}/>
                                <label htmlFor="email">Email Address</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <input 
                                    id="password" 
                                    name="password" 
                                    type="password"
                                    onChange={handleInputChange}/>
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <button onClick={_handleLogin} className="btn waves-effect waves-light col s12" type="button">Login</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
