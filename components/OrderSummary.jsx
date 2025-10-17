"use client";

import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const Spinner = () => (
  <div
    className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
    style={{ animationDuration: "30s" }}
  >
    <div className="w-16 h-16 border-4 border-t-orange-600 border-gray-300 rounded-full animate-spin"></div>
  </div>
);

const OrderSummary = () => {
  const router = useRouter();
  const {
    getCartCount,
    getCartAmount,
    getToken,
    user,
    cartItems,
    setCartItems,
  } = useAppContext();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  // ดึงที่อยู่ผู้ใช้
  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-address", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0) setSelectedAddress(data.addresses[0]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) fetchUserAddresses();
  }, [user]);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (!selectedAddress) {
        toast.error("Please select an address");
        setLoading(false);
        return;
      }

      let cartItemsArray = Object.keys(cartItems)
        .map((key) => ({ product: key, quantity: cartItems[key] }))
        .filter((item) => item.quantity > 0);

      if (cartItemsArray.length === 0) {
        toast.error("Cart is empty");
        setLoading(false);
        return;
      }

      const token = await getToken();

      const { data } = await axios.post(
        "/api/order/create",
        { address: selectedAddress._id, items: cartItemsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setCartItems({});
        // delay 1.5 วินาที ก่อน redirect
        setTimeout(() => {
          router.push("/my-orders");
        }, 7000);
      } else {
        toast.error(data.message);
        if (
          data.message === "User not authenticated" ||
          data.message === "User not found"
        ) {
          setTimeout(() => {
            router.push("/my-orders");
          }, 7000);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-96 bg-gray-50 p-5 rounded shadow-md relative">
      {loading && <Spinner />}

      <h2 className="text-xl md:text-2xl font-medium text-gray-700 mb-5">
        Order Summary
      </h2>

      {/* ที่อยู่ */}
      <div className="mb-6">
        <label className="text-base font-medium uppercase text-gray-600 block mb-2">
          Select Address
        </label>
        <div className="relative w-full text-sm border rounded">
          <button
            className="peer w-full text-left px-4 py-2 bg-white text-gray-700 flex justify-between items-center"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>
              {selectedAddress
                ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                : "Select Address"}
            </span>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-0" : "-rotate-90"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#6B7280"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5 rounded">
              {userAddresses.map((address, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleAddressSelect(address)}
                >
                  {address.fullName}, {address.area}, {address.city},{" "}
                  {address.state}
                </li>
              ))}
              <li
                onClick={() => router.push("/add-address")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-center font-medium text-orange-600"
              >
                + Add New Address
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* สรุปยอด */}
      <div className="space-y-3 border-t pt-3">
        <div className="flex justify-between text-gray-700">
          <span>Items ({getCartCount()})</span>
          <span>฿{getCartAmount()}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Shipping Fee</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Tax (2%)</span>
          <span>฿{(getCartAmount() * 0.02).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-medium text-lg border-t pt-3">
          <span>Total</span>
          <span>฿{(getCartAmount() * 1.02).toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={createOrder}
        disabled={loading}
        className={`w-full py-3 mt-5 rounded text-white transition-colors ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-orange-600 hover:bg-orange-700"
        }`}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default OrderSummary;
