import { supabase } from "../supabaseClient"


class SupabaseAPI {
    
    constructor() {
        this.client = supabase
    }

    list = async (tableName) => {
        
        const response = await this.client
            .from(tableName)
            .select("*")

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
    
    createProduct(productId, payload) {
        return this.create(this.tableName, productId, payload)
    }
}

class OrderService extends SupabaseAPI {

    constructor() {
        super()
        this.tableName = "Orders"
    }

    listOrders() {
        return this.list(this.tableName)
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
    
    createOrder(orderId, payload) {
        return this.create(this.tableName, orderId, payload)
    }
}

const orderService = new OrderService()
const productService = new ProductService()

export {
    orderService,
    productService,
}