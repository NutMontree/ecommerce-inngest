// const LINE_TOKEN = "u6Es8v8XLytQurPCWjuanLSItUf6deRXP3jGKEhYwgTNV0dxOUJRoKnY2UTtAJY6LxUSK9lUtCaQGYCQHVbTh6DhNbg0OvYFxZvIBVKBwfdwuVMq/Cy7djgFN2ju7MVnJOHFQDvwWvacjBrbsRdOzAdB04t89/1O/w1cDnyilFU="; // ใส่ token ของกลุ่มคุณ

// const res = await fetch("https://api.line.me/v2/bot/message/push", {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${LINE_TOKEN}`,
//     },
//     body: new URLSearchParams({ message }),
// });
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, subject, message, user, address, items, total } = body;

        // ตรวจสอบข้อมูลสำคัญ
        if (!name || !email || !message) {
            return NextResponse.json({ success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
        }


        // ตรวจสอบค่า LINE Token และ TO
        const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
        const TO = process.env.LINE_TO;

        if (!LINE_CHANNEL_ACCESS_TOKEN || !TO) {
            return NextResponse.json(
                { success: false, message: "LINE bot token หรือ TO ยังไม่ได้ตั้งค่า" },
                { status: 500 }
            );
        }

        // Fallback ค่า user และ address
        const userName = user || "ไม่ระบุ";
        const orderAddress = address || {};
        const fullAddress = `${orderAddress.fullName || "-"}, ${orderAddress.area || "-"}, ${orderAddress.city || "-"}, ${orderAddress.state || "-"}`;

        // สร้างข้อความ LINE
        const textMessage = `
📦 มีออเดอร์ใหม่เข้ามา!
👤 ผู้สั่ง: ${userName}
🏠 ที่อยู่: ${fullAddress}
💰 ยอดรวม: ฿${total || 0}
🍮 รายการสินค้า:
${(items || []).map((i: { product: any; quantity: any; price?: any }) => `• ${i.product} x${i.quantity}${i.price ? ` (฿${i.price})` : ""}`).join("\n")}
    `;

        console.log("LINE message:", textMessage);
        console.log("Sending to:", TO);

        // ส่งข้อความไป LINE
        const res = await fetch("https://api.line.me/v2/bot/message/push", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({
                to: TO,
                messages: [{ type: "text", text: textMessage }],
            }),
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error("LINE API response:", res.status, errText);
            return NextResponse.json(
                { success: false, message: errText || "ส่งข้อความไม่สำเร็จ" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: "ส่งข้อความเรียบร้อย!" });
    } catch (error: any) {
        console.error("LINE API error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "เกิดข้อผิดพลาด" },
            { status: 500 }
        );
    }
}
