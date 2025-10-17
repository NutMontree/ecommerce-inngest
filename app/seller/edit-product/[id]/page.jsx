"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";

const EditProductPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { getToken } = useAppContext();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ ดึงข้อมูลสินค้าเดิมมาแสดงในฟอร์ม
  const fetchProduct = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`/api/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setProduct(data.product);
      } else {
        toast.error(data.message || "ไม่พบข้อมูลสินค้า");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  // ✏️ เมื่อแก้ไข input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // 💾 อัปเดตสินค้า
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = await getToken();

      const { data } = await axios.put(
        `/api/product/${id}`,
        {
          name: product.name,
          category: product.category,
          offerPrice: product.offerPrice,
          description: product.description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("อัปเดตสินค้าสำเร็จ");
        router.push("/seller/product-list"); // ✅ กลับไปหน้ารายการสินค้า
      } else {
        toast.error(data.message || "ไม่สามารถอัปเดตสินค้าได้");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  if (!product)
    return (
      <div className="p-10 text-center text-gray-500">ไม่พบข้อมูลสินค้า</div>
    );

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">🛠 แก้ไขสินค้า</h2>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">ชื่อสินค้า</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">หมวดหมู่</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">ราคาเสนอขาย</label>
          <input
            type="number"
            name="offerPrice"
            value={product.offerPrice}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">รายละเอียดสินค้า</label>
          <textarea
            name="description"
            value={product.description || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[120px]"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-2 text-white rounded-md transition ${
            saving ? "bg-gray-400" : "bg-orange-600 hover:bg-orange-700"
          }`}
        >
          {saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
