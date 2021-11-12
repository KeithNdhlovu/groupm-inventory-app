import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import Swal from 'sweetalert2'
import Loader from '../partials/Loader'
import { find, isEmpty, map } from 'lodash'
import { orderService, productService } from '../api'
import DineroFactory from 'dinero.js'

const Form = (props) => {
    
    const {
        onChange,
        onConfirm,
        order,
        products,
        loading,
        amount,
    } = props

    const [state, setState] = useState(order)
    const [oProducts, setOProducts] = useState(products)

    useEffect(() => {
        setState(order)
    }, [order])
    
    useEffect(() => {
        setOProducts(products)
    }, [products])

    return (
        <div className="row">
            <form className="col s12">
                <div className="row">
                    <div className="input-field col s2">
                        <input 
                            onChange={onChange} 
                            name="title" 
                            id="title" 
                            type="text" />
                        <label htmlFor="title">Title</label>
                    </div>
                    <div className="input-field col s5">
                        <input 
                            onChange={onChange} 
                            name="first_name" 
                            id="first_name" 
                            type="text" />
                        <label htmlFor="first_name">First Name</label>
                    </div>
                    <div className="input-field col s5">
                        <input 
                            onChange={onChange} 
                            name="last_name" 
                            id="last_name" 
                            type="text" />
                        <label htmlFor="last_name">Last Name</label>
                    </div>
                </div>
                <div className="row">
                    <div className="col s6">
                        <span>Amount</span>
                        <h5>{DineroFactory({amount: amount}).toFormat()}</h5>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s6">
                        <input 
                            onChange={onChange} 
                            name="quantity" 
                            id="quantity" 
                            type="number" />
                        <label htmlFor="quantity">Quantity</label>
                    </div>
                </div>
                <div className="row">
                    <div className="col s6">
                        <select onChange={onChange} className="browser-default" name="product_id" id="product_id">
                            <option>--- Select Product ---</option>
                            {map(oProducts, p => <option value={ p.id }>{ p.name }</option>)}
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col s6">
                        {loading && <Loader />}
                        {!loading && (
                            <input 
                                className="btn btn-success" 
                                type="button" 
                                value="Save"
                                onClick={onConfirm} />
                        )}
                    </div>
                </div>
            </form>
        </div>
    )
}

const CreateOrder = () => {
    
    const [payload, setPayload] = useState({
        title: "",
        first_name: "",
        last_name: "",
        quantity: 0,
        product_id: null,
    })
    const [products, setProducts] = useState([])
    const [amount, setAmount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState({
        title: "",
        first_name: "",
        last_name: "",
        quantity: 1,
        product_id: null,
    })

    const fetchData = async () => {
        setLoading(true)

        let data = await productService.listProducts()

        setLoading(false)

        if (data) {
            setProducts(data)
        }
    }

    const handleInputChange = (event) => {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name

        setPayload({...payload, [name]: value})
    }

    const handlePostCreate = async () => {
        
        setLoading(true)
        
        const product = find(products, {'id': parseInt(payload.product_id)})
        
        // Save the order
        const data = await orderService.createOrder(payload)

        // Update the inventory on product
        const updated = await productService.updateProduct(payload.product_id, {
            inventory_on_hand: product.inventory_on_hand - payload.quantity
        })

        setLoading(false)

        if (data) {
            Swal.fire({
                title: 'Order Created!',
                text: 'Order was created successfully',
                icon: 'success',
            }).then(response => {
                window.location.href = "#/"
            })
        }
    }

    useEffect(() => {
        
        // Update the price
        let product = find(products, {'id': parseInt(payload.product_id)})
            product = product || {price: 0}
        let price   = product.price * payload.quantity
        setAmount(price)

    }, [payload.product_id, payload.quantity])

    useEffect(() => {
        fetchData()
        return () => {}
    }, [])


    return (
        <div>
            <div id="breadcrumbs-wrapper">
                <br />
                <div className="container">
                    <div className="row">
                        <div className="col s8">
                            <h5 className="breadcrumbs-title page-title">Create Order</h5>
                        </div>
                        <div className="col s4">
                            <a href="#/" className="waves-effect waves-light btn right">Back Home</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">

                <div className="row">
                    <div className="col s12">
                        <div className="card-panel z-depth-2">
                            <Form 
                                order={order}
                                products={products} 
                                onConfirm={handlePostCreate} 
                                onChange={handleInputChange}
                                loading={loading}
                                amount={amount} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Order(props) {

    const {
        isNew,
    } = props

    if (isNew) {
        return (
            <CreateOrder />
        )
    }

    return (
        <CreateOrder {...props} />
    )
}

export default Order
