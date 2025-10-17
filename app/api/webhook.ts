import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // LINE จะส่ง POST มาที่ webhook
    if (req.method === "POST") {
        console.log("LINE webhook payload:", JSON.stringify(req.body, null, 2));
        res.status(200).send("ok");
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}



