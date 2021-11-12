import React, {Fragment, useState, useEffect} from 'react'
import Dinero from "dinero.js"
import { map, size } from "lodash"
import { supabase } from '../supabaseClient'
import Swal from 'sweetalert2'
import Loader from '../partials/Loader'

function Home() {
    
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchData = async () => {
        setLoading(true)

        let { data: products, error, status } = await supabase
            .from('Products')
            .select('*')

        setLoading(false)

        if (error && status !== 406) {
            throw error
        }

        if (products) {

            setProducts(products)
        }
    }

    useEffect(() => {

        fetchData()
        return () => { }
    }, [])

    /**
     * Navigate to the edit product page
     * 
     * @param {*} product 
     */
    const _handleEditProduct = (product) => {
        window.location.href = "#/products/".concat(product.id)
    }

    /**
     * Delete the currently selected product
     * 
     * @param {*} product 
     */
    const _handleDeleteProduct = (product) => {
        Swal.fire({
            title: 'Warning!',
            text: `Are you sure you want to delete: ${product.name}?`,
            icon: 'warning',
            confirmButtonText: 'Continue',
            showCancelButton: true,
            cancelButtonText: "Cancel"
        }).then(response => {
            
            const { isConfirmed } = response
            
            if (isConfirmed) {
                setLoading(true)
                return supabase.from("Products")
                    .delete()
                    .eq('id', product.id)
            }
        }).then(response => {
            const { data, error } = response
            
            console.log({ data, error })
        })
    }

    return (
        <div>
            <div id="breadcrumbs-wrapper">
                <br/>
                <br/>
                <div className="container">
                    <div className="row">
                        <div className="col s8">
                            <h5 className="breadcrumbs-title page-title">Inventory</h5>
                            <p className="page-description">Bellow is a list of your Products and Orders that exist in this system.</p>
                        </div>
                        <div className="col s4">
                            <a href="#/create/products" className="waves-effect waves-light btn right">Add Product</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">

                <div className="row">
                    <div className="col s12">
                        <div className="overflow-scroll">

                            <table className="card-panel striped inventory-table z-depth-2">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Amount</th>
                                        <th>Total Stock</th>
                                        <th className="center-align">Actions</th>
                                    </tr>
                                </thead>

                                {/* Show Products only if they exist */}
                                {(size(products) > 0 && !loading) && (
                                    <tbody>
                                        {map(products, product => (
                                            <tr key={product.id}>
                                                <td>{product.id}</td>
                                                <td>{product.name}</td>
                                                <td>{product.description}</td>
                                                <td>{Dinero({ amount: product.price }).toFormat()}</td>
                                                <td>{product.inventory_on_hand}</td>
                                                <td>
                                                    <div className="center-align">
                                                        <a onClick={() => _handleEditProduct(product)} className="btn-floating primary-color mg-right-10px">
                                                            <i className="material-icons sustain-blue">mode_edit</i>
                                                        </a>
                                                        <a onClick={() => _handleDeleteProduct(product)} className="btn-floating red">
                                                            <i className="material-icons sustain-red">delete</i>
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                )}

                                {/* Show when no Products */}
                                {(size(products) === 0 && !loading) && (
                                    <tbody>
                                        <tr>
                                            <td colSpan="6" className="center">
                                                <h5>No Products</h5>
                                            </td>
                                        </tr>
                                    </tbody>
                                )}

                                {/* Show when Loading */}
                                {(loading) && (
                                    <tbody>
                                        <tr>
                                            <td colSpan="6" className="center">
                                                <Loader />
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
