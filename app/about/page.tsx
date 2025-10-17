"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AboutPage: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
                {/* Hero Section */}
                <section className="relative bg-[#4CAF50] text-white flex flex-col items-center justify-center px-6 py-24 md:py-32 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-4xl md:text-6xl font-bold mb-4"
                    >
                        เกี่ยวกับเรา
                    </motion.h1>
                    <p className="text-lg md:text-xl max-w-2xl">
                        เราคือทีมงานที่มุ่งมั่นสร้างสรรค์ประสบการณ์ดิจิทัลที่ดีที่สุดให้กับผู้ใช้
                    </p>
                </section>

                {/* Mission Section */}
                <section className="flex flex-col md:flex-row items-center justify-center gap-10 px-6 py-16 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="md:w-1/2 space-y-5"
                    >
                        <h2 className="text-3xl font-semibold text-[#4CAF50]">
                            ภารกิจของเรา
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-lg md:text-xl">
                            เรามุ่งมั่นที่จะสืบสานและเผยแพร่เสน่ห์ของขนมไทย
                            ผ่านรสชาติที่กลมกล่อมและวัตถุดิบคุณภาพจากธรรมชาติ
                            เพื่อให้ทุกคำที่ลิ้มรสคือความสุขและความภาคภูมิใจในความเป็นไทย
                        </p>

                        <p className="text-gray-700 leading-relaxed text-lg md:text-xl">
                            ทีมของเราพัฒนาอย่างต่อเนื่องทั้งในด้านสูตรขนม การออกแบบบรรจุภัณฑ์
                            และประสบการณ์ของลูกค้า เพื่อให้ขนมไทยคงความอร่อยแบบดั้งเดิม
                            แต่ดูทันสมัยและเข้าถึงได้ในทุกยุคสมัย
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="md:w-1/2"
                    >
                        <Image
                            src="/teamwork.svg"
                            alt="Our Mission"
                            width={500}
                            height={400}
                            className="rounded-2xl shadow-lg"
                        />
                    </motion.div>
                </section>

                {/* Team Section */}
                <section className="bg-white py-16 px-6">
                    <div className="max-w-6xl mx-auto text-center">
                        <h2 className="text-3xl font-semibold text-[#4CAF50] mb-10">
                            ทีมของเรา
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
                            {[
                                {
                                    name: "นางปราณปรียา พรีมชา",
                                    role: "Thai dessert producer",
                                    img: "/team1.jpg",
                                },
                                {
                                    name: "นายณัช  มนตรี",
                                    role: "Frontend Developer, UX/UI Designer",
                                    img: "/team2.jpg",
                                },
                            ].map((member, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                    className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <Image
                                        src={member.img}
                                        alt={member.name}
                                        width={300}
                                        height={300}
                                        className="rounded-full mx-auto mb-4 object-cover"
                                    />
                                    <h3 className="text-xl font-bold">{member.name}</h3>
                                    <p className="text-gray-500">{member.role}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-[#4CAF50] text-white text-center py-16 px-6">
                    <h2 className="text-3xl font-semibold mb-6">
                        อยากร่วมงานกับเราหรือไม่?
                    </h2>
                    <p className="mb-8 text-lg">
                        ติดต่อเราวันนี้เพื่อเริ่มต้นโปรเจกต์ของคุณไปกับทีมมืออาชีพของเรา
                    </p>
                    <Link
                        href="/contact"
                        className="bg-white text-[#4CAF50] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
                    >
                        ติดต่อเรา
                    </Link>
                </section>

                {/* Back to Home */}
                <div className="text-center py-6">
                    <Link
                        href="/"
                        className="text-[#4CAF50] font-medium hover:underline text-lg"
                    >
                        ← กลับหน้าหลัก
                    </Link>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default AboutPage;
