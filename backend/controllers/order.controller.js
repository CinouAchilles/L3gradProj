export const createOrder = async(req , res)=>{
    return res.status(201).json({
        message: "Order created successfully"
    })
}
export const getMyOrders = async(req , res)=>{
    return res.status(200).json({
        message: "Orders retrieved successfully"
    })
}
export const getOrderByTrackingCode = async(req , res)=>{
    return res.status(200).json({
        message: "Order retrieved successfully"
    })
}
export const getAllOrders = async(req , res)=>{
    return res.status(200).json({
        message: "All orders retrieved successfully"
    })
}
export const updateOrderStatus = async(req , res)=>{
    return res.status(200).json({
        message: "Order status updated successfully"
    })
}