import React from "react";

const NewsLetter = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 pt-8 pb-14">
      <h1 className="md:text-4xl text-2xl font-medium">
        🎉🔥 โปรแรง! สั่งวันนี้ ลดทันที 20% 🔥🎉
      </h1>
      <p className="md:text-base text-gray-500/80 pb-8">
        ขนมไทยโบราณ หวานหอม สดใหม่ทุกวัน <br />
        📦 ส่งตรงถึงบ้าน สะดวก อร่อย ฟิน! <br />
        💥 วันนี้ - สิ้นเดือนเท่านั้น! <br />
        กดสั่งเลยก่อนหมดโปร 👉 [ใส่ลิงก์ร้าน] <br />
        #ขนมไทยลดราคา #โปรขนมไทย #ของหวานออนไลน์
      </p>
      {/* <div className="flex items-center justify-between max-w-2xl w-full md:h-14 h-12">
        <input
          className="border border-gray-500/30 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
          type="text"
          placeholder="Enter your email id"
        />
        <button className="md:px-12 px-8 h-full text-white bg-orange-600 rounded-md rounded-l-none">
          Subscribe
        </button>
      </div> */}
    </div>
  );
};

export default NewsLetter;
