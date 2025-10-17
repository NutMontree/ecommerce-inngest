"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const ProductList = () => {
  const { router, getToken, user } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📦 ดึงรายการสินค้าของผู้ขาย
  const fetchSellerProduct = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/product/seller-list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user]);

  // ✏️ ฟังก์ชันเปิดหน้าแก้ไขสินค้า
  const handleEditProduct = (productId) => {
    router.push(`/seller/edit-product/${productId}`);
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4">
          <h2 className="pb-4 text-lg font-medium">สินค้าทั้งหมด</h2>
          <div className="flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 text-sm text-left bg-gray-100">
                <tr>
                  <th className="w-2/5 px-4 py-3 font-medium truncate">
                    ผลิตภัณฑ์
                  </th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">
                    ประเภท
                  </th>
                  <th className="px-4 py-3 font-medium truncate">ราคา</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">
                    ข้อมูลสินค้า
                  </th>
                  <th className="px-4 py-3 font-medium truncate">การจัดการ</th>
                </tr>
              </thead>

              <tbody className="text-sm text-gray-600">
                {products.map((product, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    {/* 📦 ชื่อสินค้า + รูป */}
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="bg-gray-500/10 rounded p-2">
                        <Image
                          src={product.image[0]}
                          alt="ภาพสินค้า"
                          className="object-cover w-full h-full rounded"
                          width={80}
                          height={80}
                        />
                      </div>
                      <span className="truncate w-full">{product.name}</span>
                    </td>

                    {/* ประเภทสินค้า */}
                    <td className="px-4 py-3 max-sm:hidden">
                      {product.category}
                    </td>

                    {/* ราคา */}
                    <td className="px-4 py-3">฿{product.offerPrice}</td>

                    {/* ปุ่ม Visit */}
                    <td className="px-4 py-3 max-sm:hidden">
                      <button
                        onClick={() => router.push(`/product/${product._id}`)}
                        className="flex items-center gap-1 px-2 md:px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                      >
                        <span className="hidden md:block">ดูสินค้า</span>
                        <Image
                          className="h-3.5"
                          src={assets.redirect_icon}
                          alt="redirect_icon"
                        />
                      </button>
                    </td>

                    {/* ✏️ ปุ่มแก้ไข */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEditProduct(product._id)}
                        className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm transition"
                      >
                        แก้ไข
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductList;
