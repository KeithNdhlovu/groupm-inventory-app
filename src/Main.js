import React, { Fragment, useEffect, useState } from 'react'
import App from './App'
import Login from './Login'
import Authenticated from './pages/Authenticated'

import Dinero from "dinero.js"
import { apiService } from './api'

// Set Money Formatters
Dinero.globalLocale = "en-ZA"
Dinero.defaultCurrency = "ZAR"

const Guest = (props) => {
    return <Login />
}

const Dashboard = (props) => {

    return (
        <section className="content">
            <h1>Example Dash</h1>
        </section>
    )
}

export const Main = (props) => {

    const [user, setUser] = useState(null)

    useEffect(() => {
        
        const authenticatedUser = apiService.client.auth.user()
        setUser(authenticatedUser)

        return () => {}
    }, [])

    return (
        <main>
            {user ? (
                <Authenticated />
            ) : (
                <Guest />
            )}
        </main>
    )
}
