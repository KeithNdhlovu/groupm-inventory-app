import React from 'react'
import { apiService } from '../api'

export default function Navigation(props) {
    
    const _handleLogout = async () => {
        await apiService.logout()
        window.location.reload()
    }

    return (
        <nav className="blue darken-3" role="navigation">
            <div className="nav-wrapper container"><a id="logo-container" href="#/" className="brand-logo">Home</a>
                <ul className="right hide-on-med-and-down">
                    <li><a href="#/shop">View Shop</a></li>
                    <li><a onClick={_handleLogout}>Logout</a></li>
                </ul>

                <ul id="nav-mobile" className="sidenav">
                    <li><a href="#/shop">View Shop</a></li>
                    {/* <li><a href="#/add/product">Create Product</a></li> */}
                </ul>
                <a href="#" data-target="nav-mobile" className="sidenav-trigger"><i className="material-icons">menu</i></a>
            </div>
        </nav>
    )
}
