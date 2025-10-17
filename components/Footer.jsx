import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <Image className="w-8 md:w-24" src={assets.logo} alt="logo" />
          <div className="pt-2">
            <Link
              className="mt-6 text-sm hover:text-sky-600"
              target="_blank"
              href="https://maps.app.goo.gl/idpG6mg6bquApVZv6"
            >
              ร้านซ่อนกลิ่น Sonklin Bar&Restaurant, Kantharalak, Thailand,
              Sisaket
            </Link>
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="#">
                  Home
                </a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">
                  About us
                </a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">
                  Contact us
                </a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">ติดต่อเรา</h2>
            <div className="text-sm space-y-2">
              <p>0803235682</p>
              <p>nutmontree29@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
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
    </footer>
  );
};

export default Footer;
