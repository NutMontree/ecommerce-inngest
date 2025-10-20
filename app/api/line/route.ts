import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, subject, message, user, address, items, total } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
                { status: 400 }
            );
        }

        const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
        const TO = process.env.LINE_TO;

        if (!LINE_CHANNEL_ACCESS_TOKEN || !TO) {
            return NextResponse.json(
                { success: false, message: "LINE bot token หรือ TO ยังไม่ได้ตั้งค่า" },
                { status: 500 }
            );
        }

        const orderAddress = address || {};
        const userName = `${orderAddress.fullName || "-"}, `;
        const fullAddress = `${orderAddress.area || "-"}, ${orderAddress.city || "-"}, ${orderAddress.state || "-"}, ${orderAddress.pincode || "-"}`;
        const phoneNumberID = `${orderAddress.phoneNumber || "-"}, `;

        const orderDate = new Date();
        const formattedDate = orderDate.toLocaleString("th-TH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        // ✅ สร้าง Flex Message
        const flexMessage = {
            type: "flex",
            altText: "📦 มีออเดอร์ใหม่เข้ามา!",
            contents: {
                type: "bubble",
                size: "giga",
                body: {
                    type: "box",
                    layout: "vertical",
                    contents: [
                        {
                            type: "text",
                            text: "📦 รายละเอียดออเดอร์ใหม่",
                            weight: "bold",
                            size: "lg",
                            color: "#1DB446",
                            margin: "none",
                        },
                        {
                            type: "box",
                            layout: "vertical",
                            margin: "md",
                            spacing: "sm",
                            contents: [
                                {
                                    type: "text",
                                    text: `👤 ผู้สั่ง: ${userName}`,
                                    wrap: true,
                                },
                                {
                                    type: "text",
                                    text: `📞 เบอร์โทร: ${phoneNumberID}`,
                                    wrap: true,
                                },
                                {
                                    type: "text",
                                    text: `🏠 ที่อยู่: ${fullAddress}`,
                                    wrap: true,
                                },
                            ],
                        },
                        {
                            type: "text",
                            text: `🕒 วันที่สั่งซื้อ: ${formattedDate}`,
                            wrap: true,
                            margin: "sm",
                            size: "sm",
                            color: "#555555",
                        },
                        {
                            type: "separator",
                            margin: "md",
                        },
                        {
                            type: "separator",
                            margin: "md",
                        },
                        {
                            type: "box",
                            layout: "horizontal",
                            margin: "md",
                            contents: [
                                {
                                    type: "text",
                                    text: "ยอดรวมทั้งหมด",
                                    weight: "bold",
                                    size: "sm",
                                },
                                {
                                    type: "text",
                                    text: `฿${total || 0}`,
                                    size: "sm",
                                    weight: "bold",
                                    align: "end",
                                    color: "#E53935",
                                },
                            ],
                        },
                    ],
                },
                footer: {
                    type: "box",
                    layout: "vertical",
                    contents: [
                        {
                            type: "button",
                            style: "primary",
                            color: "#1DB446",
                            action: {
                                type: "uri",
                                label: "ดูรายละเอียดออเดอร์",
                                uri: "https://sonklin.vercel.app/seller/orders",
                            },
                        },
                    ],
                },
            },
        };

        // ✅ ส่ง Flex Message ไป LINE
        const res = await fetch("https://api.line.me/v2/bot/message/push", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({
                to: TO,
                messages: [flexMessage],
            }),
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error("LINE API response:", res.status, errText);

            // ถ้า Flex ล้มเหลว → fallback ส่งข้อความธรรมดา
            const textMessage = `
📦 มีออเดอร์ใหม่เข้ามา!
👤 ผู้สั่ง: ${userName}
📞 เบอร์โทร: ${phoneNumberID}
🏠 ที่อยู่: ${fullAddress}
🕒 วันที่สั่งซื้อ: ${formattedDate}
💰 ยอดรวม: ฿${total || 0}
🍮 รายการสินค้า:
กดดูรายละเอียดเพิ่มเติมได้ที่ร้านของคุณ: ${'https://sonklin.vercel.app/seller/orders'}
${(items || [])
                    .map(
                        (i: any) =>
                            `• ${i.product} x${i.quantity}${i.price ? ` (฿${i.price})` : ""}`
                    )
                    .join("\n")}
`;

            await fetch("https://api.line.me/v2/bot/message/push", {
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
        }

        return NextResponse.json({ success: true, message: "ส่งข้อความสำเร็จ!" });
    } catch (error: any) {
        console.error("LINE API error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "เกิดข้อผิดพลาด" },
            { status: 500 }
        );
    }
}
