import React from "react";
import { IoMdSunny } from "react-icons/io";
import { MdLocationOn, MdMyLocation } from "react-icons/md";
import SearchBox from "./SearchBox";

const Navbar = () => {
  return (
    <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
      <div className="flex h-[80px] w-full justify-between items-center max-w-7xl px-3 mx-auto">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-gray-500 text-3xl">Weather</h1>
          <IoMdSunny className="text-3xl mt-1 text-yellow-300 transition-colors cursor-pointer"/>
        </div>
        <section className="flex gap-2 items-center">
        <MdMyLocation className="text-2xl text-gray-400 hover:opacity-80 cursor-pointer"/>
        <MdLocationOn  className="text-2xl text-black"/>
        <p className="text-slate-900/80 text-sm">Bangladesh</p>
        <div>
           <SearchBox/>
        </div>
        </section>
      </div>
    </nav>
  );
};

export default Navbar;
