import mongoose from "mongoose";

const cleanupLegacyOrderIndexes = async () => {
    try {
        const ordersCollection = mongoose.connection.collection("orders");
        const indexes = await ordersCollection.indexes();
        const hasLegacyTrackingCodeIndex = indexes.some((index) => index.name === "trackingCode_1");

        if (hasLegacyTrackingCodeIndex) {
            await ordersCollection.dropIndex("trackingCode_1");
            console.log("Dropped legacy index: trackingCode_1");
        }
    } catch (error) {
        console.error("Error cleaning up legacy order indexes:", error.message);
    }
};

export const connectDB = async ()=>{
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        // console.log(process.env.MONGO_URI);
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB" + conn.connection.host + " \nconnected successfully");
        await cleanupLegacyOrderIndexes();
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}