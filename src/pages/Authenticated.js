import React, { Fragment, useState } from 'react'
import App from '../App'
import Home from '../pages/Home'
import CreateOrder from '../pages/CreateOrder'
import Product from './Product'

import Navigation from '../navigation/Navigation'
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

const Authenticated = () => {
    
    return (
        <Fragment>
            <Navigation />
            <section id="content">
                <Router>
                    <Switch>
                        <Route exact path='/' render= {(props)=>{ return <Home {...props}/>}}/>
                        <Route exact path="/shop" component= {(props)=>{ return <CreateOrder {...props}/>}} />
                        <Route exact path="/add/order" component= {(props)=>{ return <CreateOrder {...props}/>}} />
                        <Route exact path="/products/:id" component= {(props)=>{ return <Product {...props}/>}} />
                        <Route exact path="/create/products" component= {(props)=>{ return <Product isNew={true} {...props}/>}} />
                    </Switch>
                </Router>
            </section>
        </Fragment>
    )
}

export default Authenticated