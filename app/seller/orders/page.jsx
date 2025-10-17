"use client";

import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Orders = () => {
  const { currency, getToken, user } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null); // 🕓 สำหรับติดตามออเดอร์ที่กำลังลบอยู่

  // 📦 ดึงรายการออเดอร์ของผู้ขาย
  const fetchSellerOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/order/seller-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ ลบออเดอร์ทีละรายการ
  const handleDeleteOrder = async (orderId) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "ต้องการลบออเดอร์นี้ออกจากระบบใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบเลย",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(orderId);
      const token = await getToken();

      const { data } = await axios.delete(`/api/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        // ✅ ลบจาก state เพื่ออัปเดต UI ทันที
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        toast.success("ลบออเดอร์เรียบร้อยแล้ว");
      } else {
        toast.error(data.message || "ไม่สามารถลบออเดอร์ได้");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (user) fetchSellerOrders();
  }, [user]);

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">Orders</h2>

          <div className="max-w-4xl rounded-md">
            {orders.length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                ยังไม่มีออเดอร์ในขณะนี้
              </p>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300 relative hover:bg-gray-50 transition-all duration-200"
                >
                  {/* ❌ ปุ่มลบออเดอร์ */}
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    disabled={deletingId === order._id}
                    className={`absolute top-2 right-2 text-xl font-bold transition ${
                      deletingId === order._id
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  >
                    {deletingId === order._id ? "⌛" : "×"}
                  </button>

                  {/* 📦 รายละเอียดสินค้า */}
                  <div className="flex-1 flex gap-5 max-w-80">
                    <Image
                      className="max-w-16 max-h-16 object-cover"
                      src={assets.box_icon}
                      alt="box_icon"
                    />
                    <p className="flex flex-col gap-3">
                      <span className="font-medium">
                        {order.items
                          .map(
                            (item) => item.product.name + ` x ${item.quantity}`
                          )
                          .join(", ")}
                      </span>
                      <span>Items : {order.items.length}</span>
                    </p>
                  </div>

                  {/* 📍 ที่อยู่ผู้รับ */}
                  <div>
                    <p>
                      <span className="font-medium">
                        {order.address.fullName}
                      </span>
                      <br />
                      <span>{order.address.area}</span>
                      <br />
                      <span>{`${order.address.city}, ${order.address.state}`}</span>
                      <br />
                      <span>{order.address.phoneNumber}</span>
                    </p>
                  </div>

                  {/* 💰 ราคา */}
                  <p className="font-medium my-auto">
                    {currency}
                    {order.amount}
                  </p>

                  {/* 📅 ข้อมูลอื่น */}
                  <div>
                    <p className="flex flex-col">
                      <span>Method : COD</span>
                      <span>
                        Date : {new Date(order.date).toLocaleDateString()}
                      </span>
                      <span>การชำระเงิน : รอดำเนินการ</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Orders;
