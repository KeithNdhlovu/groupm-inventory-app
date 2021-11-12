import React, { Fragment, useState, useEffect } from 'react'
import Dinero from "dinero.js"
import { map, size } from "lodash"
import { supabase } from '../supabaseClient'
import Swal from 'sweetalert2'
import Loader from '../partials/Loader'
import { orderService, productService } from '../api'

const TableData = (props) => {

    const {
        body,
        data,
        title,
        header,
        loading,
        colCount
    } = props


    return (
        <div className="row">
            <div className="col s8">
                <h5 className="breadcrumbs-title page-title">{title}</h5>
            </div>
            <div className="col s12">
                <div className="overflow-scroll">

                    <table className="card-panel striped inventory-table z-depth-2">
                        <thead>
                            {header}
                        </thead>

                        {/* Show data only if they exist */}
                        {(size(data) > 0 && !loading) && body}

                        {/* Show when no data */}
                        {(size(data) === 0 && !loading) && (
                            <tbody>
                                <tr>
                                    <td colSpan={colCount} className="center">
                                        <h5>No data available yet</h5>
                                    </td>
                                </tr>
                            </tbody>
                        )}

                        {/* Show when Loading */}
                        {(loading) && (
                            <tbody>
                                <tr>
                                    <td colSpan={colCount} className="center">
                                        <Loader />
                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                </div>
            </div>
        </div>
    )
}


function Home() {

    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchData = async () => {
        setLoading(true)

        let products = await productService.listProducts()
        let orders = await orderService.listOrders()
        const ordersTransformed = map(orders, o => {
            return {
                ...o,
                price: o.quantity * o.Products.price,
            }
        })

        setLoading(false)
        setProducts(products)
        setOrders(ordersTransformed)
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
                return productService.remove(product.id)
            }

            return Promise.resolve({ data: {}, error: undefined })
        }).then(response => {
            const { data, error } = response

            console.log({ data, error })
        })
    }
 
    /**
     * Delete the currently selected order
     * 
     * @param {*} order 
     */
    const _handleDeleteOrder = (order) => {

        Swal.fire({
            title: 'Warning!',
            text: `Are you sure you want to delete Order from: ${order.first_name} ${order.last_name}?`,
            icon: 'warning',
            confirmButtonText: 'Continue',
            showCancelButton: true,
            cancelButtonText: "Cancel"
        }).then(response => {

            const { isConfirmed } = response

            if (isConfirmed) {
                setLoading(true)
                return orderService.remove(order.id)
            }

            return Promise.resolve({ data: {}, error: undefined })
        }).then(response => {
            const { data, error } = response

            console.log({ data, error })
        })
    }

    return (
        <div>
            <div id="breadcrumbs-wrapper">
                <br />
                <br />
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
                <TableData
                    title="Products"
                    header={
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Total Stock</th>
                            <th className="center-align">Actions</th>
                        </tr>
                    }
                    colCount={6}
                    body={
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
                    }
                    loading={loading}
                    data={products} />
            </div>
            <br />
            <br />
            <div className="container">
                <TableData
                    title="Orders"
                    header={
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Amount</th>
                            <th className="center-align">Actions</th>
                        </tr>
                    }
                    colCount={8}
                    body={
                        <tbody>
                            {map(orders, order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.title}</td>
                                    <td>{order.first_name}</td>
                                    <td>{order.last_name}</td>
                                    <td>{order.Products.name}</td>
                                    <td>{order.quantity}</td>
                                    <td>{Dinero({ amount: order.price }).toFormat()}</td>
                                    <td>
                                        <div className="center-align">
                                            <a onClick={() => _handleDeleteOrder(order)} className="btn-floating red">
                                                <i className="material-icons sustain-red">delete</i>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    }
                    loading={loading}
                    data={orders} />
            </div>
        </div>
    )
}

export default Home
