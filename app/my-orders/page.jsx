"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";
import Swal from "sweetalert2";

const MyOrders = () => {
  const { currency, getToken, user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null); // 🕓 สำหรับติดตามออเดอร์ที่กำลังลบอยู่

  // ดึงรายการคำสั่งซื้อ
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get("/api/order/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setOrders(data.orders.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ยกเลิกรายการสั่งซื้อ
  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "คุณแน่ใจที่จะยกเลิกรายการสั่งซื้อนี้หรือไม่?"
    );
    if (!confirmCancel) return;

    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.post(
        "/api/order/cancel",
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message || "ยกเลิกรายการสั่งซื้อสำเร็จ!");
        await fetchOrders();
      } else {
        toast.error(data.message || "ไม่สามารถยกเลิกรายการได้");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด: " + error.message);
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
    if (user) fetchOrders();
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
        <div className="space-y-5">
          <h2 className="text-lg font-medium mt-6">My Orders</h2>
          {loading ? (
            <Loading />
          ) : (
            <div className="max-w-5xl border-t border-gray-300 text-sm">
              {orders.map((order, index) => {
                const statusLower = order.status.toLowerCase();
                return (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300"
                  >
                    <div className="flex-1 flex gap-5 max-w-80">
                      <Image
                        className="max-w-16 max-h-16 object-cover"
                        src={assets.box_icon}
                        alt="box_icon"
                      />
                      <p className="flex flex-col gap-3">
                        <span className="font-medium text-base">
                          {order.items
                            .map(
                              (item) =>
                                item.product.name + ` x ${item.quantity}`
                            )
                            .join(", ")}
                        </span>
                        <span>Items: {order.items.length}</span>
                      </p>
                    </div>

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

                    <p className="font-medium my-auto">
                      {currency}
                      {order.amount}
                    </p>

                    <div className="flex flex-col justify-between">
                      <p className="flex flex-col">
                        <span>Method: COD</span>
                        <span>
                          Date:{" "}
                          {new Date(order.date).toLocaleString("th-TH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </span>
                        <span>การชําระเงิน: รอดําเนินการ</span>
                      </p>

                      {/* ปุ่มยกเลิก */}
                      {statusLower === "pending" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="mt-3 py-2 px-4 text-xs text-white bg-red-500 rounded hover:bg-red-600 transition duration-150"
                        >
                          ยกเลิกรายการ (Cancel)
                        </button>
                      )}

                      {/* ปุ่มลบ */}
                      {["cancelled", "canceled"].includes(statusLower) && (
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="mt-3 py-2 px-4 text-xs text-white bg-gray-700 rounded hover:bg-gray-800 transition duration-150"
                        >
                          ลบรายการ (Delete)
                        </button>
                      )}

                      {/* แสดงสถานะอื่นๆ */}
                      {statusLower !== "pending" &&
                        !["cancelled", "canceled"].includes(statusLower) && (
                          <p className="mt-3 text-xs text-gray-500 italic">
                            สถานะ:{" "}
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </p>
                        )}
                    </div>
                    {/* ปุ่มลบรายการ (สามารถกดได้ทีละรายการ) */}
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="mt-12 py-2 px-4 text-xs text-white bg-red-700 rounded hover:bg-gray-800 transition duration-150"
                    >
                      ลบรายการ
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
