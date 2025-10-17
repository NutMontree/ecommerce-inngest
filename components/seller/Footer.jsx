import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-10">
      <div className="flex items-center gap-4">
        <Image className="hidden md:block w-8" src={assets.logo} alt="logo" />
        <div className="hidden md:block h-7 w-px bg-gray-500/60"></div>
        <div className="flex justify-center py-4 text-center text-xs md:text-sm gap-1">
          <div>Copyright 2025 ©</div>
          <Link
            href="https://allmaster.vercel.app/"
            className="hover:text-blue-500"
          >
            AllMaster
          </Link>
          <div>All Right Reserved.</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <a target="_blank" href="https://www.facebook.com/sonkllin">
          <Image src={assets.facebook_icon} alt="facebook_icon" />
        </a>
        {/* <a href="#">
          <Image src={assets.twitter_icon} alt="twitter_icon" />
        </a>
        <a href="#">
          <Image src={assets.instagram_icon} alt="instagram_icon" />
        </a> */}
      </div>
    </div>
  );
};

export default Footer;
