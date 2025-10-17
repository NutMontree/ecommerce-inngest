"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const ContactPage: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(data.message || "ส่งข้อความเรียบร้อย!");
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                toast.error(data.message || "เกิดข้อผิดพลาด");
            }
        } catch (error: any) {
            toast.error(error.message || "เกิดข้อผิดพลาด");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col md:flex-row">
                {/* ส่วนซ้าย */}
                <div className="bg-[#4CAF50] text-white md:w-1/3 p-10 flex flex-col justify-center items-start">
                    <h1 className="text-3xl font-bold mb-4">ติดต่อเรา</h1>
                    <p className="mb-6">
                        หากมีข้อสงสัยหรือข้อเสนอแนะ กรุณากรอกแบบฟอร์มด้านข้าง
                        ทีมงานจะติดต่อกลับโดยเร็วที่สุด
                    </p>

                    {/* 🔙 ปุ่มย้อนกลับ */}
                    <button
                        onClick={() => router.push("/")}
                        className="mt-4 px-5 py-2 bg-white text-[#4CAF50] font-semibold rounded-lg hover:bg-gray-100 transition-all"
                    >
                        ← กลับหน้าหลัก
                    </button>
                </div>

                {/* ฟอร์ม */}
                <div className="md:w-2/3 p-10 bg-gray-50 flex justify-center items-center">
                    <form
                        className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg space-y-5"
                        onSubmit={handleSubmit}
                    >
                        <h2 className="text-2xl font-semibold text-gray-700">
                            ส่งข้อความถึงเรา
                        </h2>

                        <input
                            type="text"
                            name="name"
                            placeholder="ชื่อของคุณ"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="อีเมล"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                        <input
                            type="text"
                            name="subject"
                            placeholder="หัวข้อ"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <textarea
                            name="message"
                            placeholder="ข้อความ"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none h-32"
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#4CAF50] hover:bg-orange-700"
                                }`}
                        >
                            {loading ? "กำลังส่ง..." : "ส่งข้อความ"}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />

        </>
    );
};

export default ContactPage;
