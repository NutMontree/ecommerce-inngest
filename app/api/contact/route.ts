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
        const { name, email, subject, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
                { status: 400 }
            );
        }

        const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
        const TO = process.env.LINE_TO; // Group ID หรือ User ID ของ bot

        const textMessage = `
📩 ข้อความจาก Contact Form
ชื่อ: ${name}
อีเมล: ${email}
หัวข้อ: ${subject || "-"}
ข้อความ: ${message}
    `;

        const res = await fetch("https://api.line.me/v2/bot/message/push", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({
                to: TO,
                messages: [
                    {
                        type: "text",
                        text: textMessage,
                    },
                ],
            }),
        });

        if (!res.ok) {
            const errData = await res.json();
            return NextResponse.json(
                { success: false, message: errData.message || "ส่งข้อความไม่สำเร็จ" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: "ส่งข้อความเรียบร้อย!" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message || "เกิดข้อผิดพลาด" }, { status: 500 });
    }
}
