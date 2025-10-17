import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { orderId } = body;

        console.log("🗑️ Request to cancel order:", orderId);

        if (!orderId) {
            return NextResponse.json(
                { success: false, message: "ไม่พบหมายเลขคำสั่งซื้อ (orderId)" },
                { status: 400 }
            );
        }

        // ✅ ตรวจสอบว่ามี order จริงไหม
        const existingOrder = await Order.findById(orderId);
        if (!existingOrder) {
            return NextResponse.json(
                { success: false, message: "ไม่พบคำสั่งซื้อนี้ในระบบ" },
                { status: 404 }
            );
        }

        // ✅ ลบคำสั่งซื้อออกจากฐานข้อมูล
        await Order.deleteOne({ _id: orderId });

        return NextResponse.json({
            success: true,
            message: "ลบคำสั่งซื้อเรียบร้อยแล้ว",
        });
    } catch (error) {
        console.error("❌ Error cancelling order:", error);
        return NextResponse.json(
            { success: false, message: "เกิดข้อผิดพลาด: " + error.message },
            { status: 500 }
        );
    }
}
