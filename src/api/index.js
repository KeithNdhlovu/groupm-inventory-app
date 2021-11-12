import Swal from "sweetalert2"
import { supabase } from "../supabaseClient"


class SupabaseAPI {
    
    constructor() {
        this.client = supabase
    }

    createProfile = async (payload) => {
        const response = await this.client.auth.signUp(payload)
        return this.errorOrData({
            error: response.error,
            data: response.user
        })
    }
    
    login = async (payload) => {
        const response = await this.client.auth.signIn(payload)
        return this.errorOrData({
            error: response.error,
            data: response.user
        })
    }
    
    logout = async (payload) => {
        const response = await this.client.auth.signOut(payload)
        return this.errorOrData({
            error: response.error,
            data: {}
        })
    }

    // Get a related record when specified
    // related = {table: String, foreign: String}
    /**
     * 
     * @param {String} tableName 
     * @param {table: String, foreign: String} related 
     * @returns 
     */
    list = async (tableName, related = null) => {
        
        const query = this.client
            .from(tableName)
            .select("*")

        if (!related) {
            query.select("*")
        } else {
            query.select(`
                *,
                ${related.table} (
                    ${related.fields}
                )
            `)
        }

        const response = await query

        return this.errorOrData(response)
    }
    
    get = async (tableName, recordId) => {
        
        const response = await this.client
            .from(tableName)
            .select("*")
            .single()
            .eq('id', recordId)

        return this.errorOrData(response)
    }
    
    delete = async (tableName, recordId) => {
        
        const response = await this.client
            .from(tableName)
            .delete()
            .eq('id', recordId)

        return this.errorOrData(response)
    }
    
    update = async (tableName, recordId, payload) => {
        
        const response = await this.client
            .from(tableName)
            .update(payload)
            .eq('id', recordId)

        return this.errorOrData(response)
    }

    create = async (tableName, payload) => {
        
        const response = await this.client
            .from(tableName)
            .insert(payload)

        return this.errorOrData(response)
    }

    errorOrData = (response) => {

        const { data, error, status } = response

        if (error) {
            Swal.fire({
                title: 'Error Occurred!',
                text: error,
                icon: 'error',
            })
            throw error
        }

        return data
    }

}

class ProductService extends SupabaseAPI {

    constructor() {
        super()
        this.tableName = "Products"
    }

    listProducts() {
        return this.list(this.tableName)
    }
    
    getProduct(productId) {
        return this.get(this.tableName, productId)
    }
    
    remove(productId) {
        return this.delete(this.tableName, productId)
    }
    
    updateProduct(productId, payload) {
        return this.update(this.tableName, productId, payload)
    }
    
    createProduct(payload) {
        return this.create(this.tableName, payload)
    }
}

class OrderService extends SupabaseAPI {

    constructor() {
        super()
        this.tableName = "Orders"
    }

    listOrders() {
        return this.list(this.tableName, {table: "Products", fields: "*"})
    }
    
    getOrder(orderId) {
        return this.get(this.tableName, orderId)
    }
    
    remove(orderId) {
        return this.delete(this.tableName, orderId)
    }
    
    updateOrder(orderId, payload) {
        return this.update(this.tableName, orderId, payload)
    }
    
    createOrder(payload) {
        return this.create(this.tableName, payload)
    }
}

const apiService = new SupabaseAPI()
const orderService = new OrderService()
const productService = new ProductService()

export {
    apiService,
    orderService,
    productService,
}