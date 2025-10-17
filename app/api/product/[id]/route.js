import { NextResponse } from "next/server";
// import connectDB from "@/lib/connectDB";
import connectDB from "@/config/db";
import Product from "@/models/Product";

export async function GET(req, { params }) {
    try {
        await connectDB();
        const product = await Product.findById(params.id);
        if (!product) {
            return NextResponse.json({ success: false, message: "ไม่พบสินค้า" }, { status: 404 });
        }
        return NextResponse.json({ success: true, product });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await connectDB();
        const body = await req.json();

        const updated = await Product.findByIdAndUpdate(params.id, body, { new: true });
        if (!updated) {
            return NextResponse.json({ success: false, message: "ไม่พบสินค้า" }, { status: 404 });
        }

        return NextResponse.json({ success: true, product: updated });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
