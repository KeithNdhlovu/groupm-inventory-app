import React, { Fragment, useState } from 'react'
import App from './App'
import Login from './Login'
import Authenticated from './pages/Authenticated'

import Dinero from "dinero.js"

// Set Money Formatters
Dinero.globalLocale = "en-ZA"
Dinero.defaultCurrency = "ZAR"

const Guest = (props) => {
    const {
        user
    } = props

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

    const [user, setUser] = useState({})

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
