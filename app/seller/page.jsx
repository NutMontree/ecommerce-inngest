"use client";
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { getToken } = useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("ขนมไทย");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("offerPrice", offerPrice);

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const token = await getToken();

      const { data } = await axios.post("/api/product/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success(data.message);
        setFiles([]);
        setName("");
        setDescription("");
        setCategory("ขนมไทย");
        setPrice("");
        setOfferPrice("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="flex-1 min-h-screen flex flex-col justify-between">
        <form
          onSubmit={handleSubmit}
          className="md:p-10 p-4 space-y-5 max-w-lg"
        >
          <div>
            <p className="text-base font-medium">ภาพสินค้า</p>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {[...Array(4)].map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                  <Image
                    key={index}
                    className="max-w-24 cursor-pointer"
                    src={
                      files[index]
                        ? URL.createObjectURL(files[index])
                        : assets.upload_area
                    }
                    alt=""
                    width={100}
                    height={100}
                  />
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <label className="text-base font-medium" htmlFor="product-name">
              ชื่อผลิตภัณฑ์
            </label>
            <input
              id="product-name"
              type="text"
              placeholder="พิมพ์ที่นี่"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <label
              className="text-base font-medium"
              htmlFor="product-description"
            >
              รายละเอียดสินค้า
            </label>
            <textarea
              id="product-description"
              rows={4}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
              placeholder="พิมพ์ที่นี่"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            ></textarea>
          </div>
          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex flex-col gap-1 w-32">
              <label className="text-base font-medium" htmlFor="category">
                ประเภท
              </label>
              <select
                id="category"
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                onChange={(e) => setCategory(e.target.value)}
                defaultValue={category}
              >
                <option value="Thai_desserts">ขนมไทย</option>
                <option value="Thai_dessert_set">ชุดขนมไทย</option>
                <option value="Snack_break">ขนมจัดเบรค</option>
                <option value="Auspicious_Thai_desserts">ขนมไทยมงคล</option>
                <option value="Bakery">เบเกอรี่</option>
                <option value="Herbal_water">น้ำสมุนไพร</option>
                <option value="Sweet_water">น้ำหวาน</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 w-32">
              <label className="text-base font-medium" htmlFor="product-price">
                ราคาสินค้า
              </label>
              <input
                id="product-price"
                type="number"
                placeholder="0"
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                required
              />
            </div>
            <div className="flex flex-col gap-1 w-32">
              <label className="text-base font-medium" htmlFor="offer-price">
                ราคาเสนอ
              </label>
              <input
                id="offer-price"
                type="number"
                placeholder="0"
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                onChange={(e) => setOfferPrice(e.target.value)}
                value={offerPrice}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-8 py-2.5 bg-orange-600 hover:bg-green-600 text-white font-medium rounded"
          >
            เพิ่มข้อมูล
          </button>
        </form>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default AddProduct;
