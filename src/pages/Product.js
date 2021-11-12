import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import Swal from 'sweetalert2'
import Loader from '../partials/Loader'
import { isEmpty } from 'lodash'
import { productService } from '../api'

const Form = (props) => {
    
    const {
        onChange,
        onConfirm,
        product,
        loading,
    } = props

    const [state, setState] = useState(product)

    useEffect(() => {
        setState(product)
    }, [product])

    return (
        <div className="row">
            <form className="col s12">
                <div className="row">
                    <div className="input-field col s6">
                        <input onChange={onChange} placeholder=" " defaultValue={product.name} name="name" id="product_name" type="text" />
                        <label htmlFor="product_name">Product Name</label>
                    </div>
                    <div className="input-field col s6">
                        <input onChange={onChange} placeholder=" " defaultValue={product.price} name="price" id="price" type="text" />
                        <label htmlFor="price">Amount&nbsp;&nbsp;<small>(*** Please enter the amount in cents ***)</small></label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                        <input 
                            onChange={onChange} 
                            placeholder=" " 
                            defaultValue={product.inventory_on_hand} 
                            name="inventory_on_hand" 
                            id="inventory_on_hand" 
                            type="text" />
                        <label htmlFor="inventory_on_hand">How Many In Stock</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                        <textarea onChange={onChange} placeholder=" " defaultValue={product.description} name="description" id="textarea1" className="materialize-textarea"></textarea>
                        <label for="textarea1">Description</label>
                    </div>
                </div>
                {loading && <Loader />}
                {!loading && (
                    <input 
                        className="btn btn-success" 
                        type="button" 
                        value={isEmpty(product.name) ? "Save" : "Update"}
                        onClick={onConfirm} />
                )}
            </form>
        </div>
    )
}

const ShowProductDetail = (props) => {

    const [payload, setPayload] = useState({})
    const [loading, setLoading] = useState(false)
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: 0,
        inventory_on_hand: 0,
    })

    const handleInputChange = (event) => {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name

        setPayload({...payload, [name]: value})
    }

    const fetchData = async () => {
        setLoading(true)

        let data = await productService.getProduct(props.match.params.id)

        setLoading(false)

        if (data) {
            setProduct(data)
        }
    }

    useEffect(() => {
        fetchData()
        return () => {}
    }, [])


    const handlePostUpdate = () => {
        console.log("handlePostUpdate", payload)
    }
    
    return (
        <div>
            <div id="breadcrumbs-wrapper">
                <br />
                <div className="container">
                    <div className="row">
                        <div className="col s8">
                            <h5 className="breadcrumbs-title page-title">Showing Product Details</h5>
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
                            {!loading &&  (
                                <Form 
                                    product={product} 
                                    onConfirm={handlePostUpdate}
                                    onChange={handleInputChange} />
                            )}
                            {loading && <Loader />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const CreateProduct = () => {
    
    const [payload, setPayload] = useState({})
    const [loading, setLoading] = useState(false)
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: 0,
        inventory_on_hand: 0,
    })

    const handleInputChange = (event) => {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name

        setPayload({...payload, [name]: value})
    }

    const handlePostCreate = async () => {
        
        setLoading(true)

        const { data, error } = await supabase
            .from('Products')
            .insert([
                payload,
            ])

        setLoading(false)

        if (error) {
            Swal.fire({
                title: 'Error Occurred!',
                text: 'An error occurred while trying to create Product',
                icon: 'error',
            })
            throw error
        }

        if (data) {
            Swal.fire({
                title: 'Product Created!',
                text: 'Product was created successfully',
                icon: 'success',
            }).then(response => {
                window.location.href = "#/"
            })
        }
    }

    return (
        <div>
            <div id="breadcrumbs-wrapper">
                <br />
                <div className="container">
                    <div className="row">
                        <div className="col s8">
                            <h5 className="breadcrumbs-title page-title">Create Product</h5>
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
                                product={product} 
                                onConfirm={handlePostCreate} 
                                onChange={handleInputChange}
                                loading={loading} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Product(props) {

    const {
        isNew,
    } = props

    if (isNew) {
        return (
            <CreateProduct />
        )
    }

    return (
        <ShowProductDetail {...props} />
    )
}

export default Product
