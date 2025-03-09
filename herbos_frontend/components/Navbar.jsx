"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cart from "./Cart";
import { CircleUser } from "lucide-react";
import { Truck } from 'lucide-react';
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <nav className="border-gray-200 bg-black w-full z-20 top-0 start-0 fixed">
      <div className="w-full flex flex-wrap items-center justify-between mx-auto p-4">
        <span className="self-center text-2xl font-semibold text-white">
          เฮิร์บโอเอส
        </span>
        <button 
          onClick={toggleMenu}
          type="button" 
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" 
          aria-controls="navbar-solid-bg" 
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>
        <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-solid-bg">
          <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
            <li>
              <Link
                href="/"
                className={`block py-2 px-3 md:p-0 rounded md:bg-transparent ${
                  isActive('/') 
                    ? 'text-lime-200 md:text-lime-700 bg-lime-700 md:bg-transparent' 
                    : 'text-black md:text-white hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-lime-700 dark:text-white md:dark:hover:text-lime-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/viewproduct"
                className={`block py-2 px-3 md:p-0 rounded md:bg-transparent ${
                  isActive('/viewproduct') 
                    ? 'text-lime-200 md:text-lime-700 bg-lime-700 md:bg-transparent' 
                    : 'text-black md:text-white hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-lime-700 dark:text-white md:dark:hover:text-lime-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
                }`}
              >
                ดูสินค้า
              </Link>
            </li>
            <li>
              <Cart />
            </li>
            <li>
              <Truck className="text-white"/>
            </li>
            <li>
              <Link 
                href="/profile/editprofile"
                className={`block py-2 px-3 md:p-0 rounded md:bg-transparent ${
                  isActive('/profile') 
                    ? 'text-lime-200 md:text-lime-700' 
                    : 'text-black md:text-white md:dark:hover:text-lime-500'
                }`}
              >
                <CircleUser />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;