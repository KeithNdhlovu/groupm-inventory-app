import React, { useEffect } from 'react'
import logo from "./logo.png"


export default function Login() {
    
    useEffect(() => {
        // We need to add a blocked class to the body so we can customize the look and feel
        document.body.classList.add('app-background')

        return () => {
            document.body.classList.remove('app-background')
        }
    }, [])

    return (
        <div className="valign-wrapper h-100">
            <div id="login-page" className="row">
                <br/><br/>
                <div className="col s12 z-depth-4 card-panel">
                    <form id="login-form" className="login-form" method="POST" action="" novalidate="novalidate">
                        <div className="row">
                            <div className="input-field col s12 center">
                                <br />
                                <img src={logo} alt="" className="logo-image login-image responsive-img" />
                                <p>Welcome to our Inventory system, we strive to keep things in order and always up to date.</p>
                            </div>
                        </div>
                        <div className="row margin">
                            <div className="input-field col s12">
                                <input id="email" name="email" type="text" autoComplete="nay" />
                                <label htmlFor="email" class ="active">Email Address</label>
                            </div>
                        </div>
                        <div className="row margin">
                            <div className="input-field col s12">
                                <input id="password" name="password" type="password" autoComplete="nay" />
                                <label htmlFor="password" class ="active">Password</label>
                            </div>
                        </div>
                        <div className="row">
                            <br />
                            <div className="input-field col s12">
                                <button className="btn waves-effect waves-light col s12" type="submit">Login</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
