// app/api/order/create/route.js
import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }

        const { address, items } = await request.json();

        if (!address || !items?.length) {
            return NextResponse.json({ success: false, message: "Invalid data" });
        }

        // Fetch products in parallel
        const products = await Product.find({
            _id: { $in: items.map(item => item.product) }
        });

        const productMap = {};
        products.forEach(p => productMap[p._id.toString()] = p);

        let amount = 0;
        for (const item of items) {
            const product = productMap[item.product];
            if (!product) continue;
            amount += product.offerPrice * item.quantity;
        }

        const finalAmount = amount * 1.02;

        await inngest.send({
            name: 'order/created',
            data: {
                userId,
                address,
                items,
                amount: finalAmount,
                date: Date.now()
            }
        });

        // Clear cart
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" });
        }
        user.cartItems = {};
        await user.save();

        return NextResponse.json({ success: true, message: 'สั่งซื้อแล้ว' });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}
