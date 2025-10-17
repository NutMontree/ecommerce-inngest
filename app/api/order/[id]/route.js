// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";
// import connectDB from "@/config/db";
// import Order from "@/models/Order";

// export async function DELETE(req, { params }) {
//     await connectDB();

//     // ✅ ดึง token จาก NextAuth
//     const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//     if (!token) {
//         return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//     }

//     const { id } = params;
//     const order = await Order.findById(id);

//     if (!order) {
//         return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
//     }

//     // ✅ ตรวจสิทธิ์เจ้าของร้าน
//     if (order.sellerId.toString() !== token.id) {
//         return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
//     }

//     await Order.findByIdAndDelete(id);

//     return NextResponse.json({ success: true, message: "Order deleted successfully" });
// }

import { NextResponse } from "next/server";
// import connectDB from "@/lib/connectDB"; // ตัวอย่างการเชื่อมต่อ DB
import connectDB from "@/config/db";
import Order from "@/models/Order"; // โมเดลออเดอร์ของคุณ

// 🔧 ลบออเดอร์ตาม ID
export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return NextResponse.json(
                { success: false, message: "ไม่พบออเดอร์นี้" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "ลบออเดอร์เรียบร้อยแล้ว" },
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Error deleting order:", error);
        return NextResponse.json(
            { success: false, message: "เกิดข้อผิดพลาดในการลบออเดอร์" },
            { status: 500 }
        );
    }
}
