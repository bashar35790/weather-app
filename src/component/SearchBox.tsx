import { cn } from "@/utils/cn";
import React from "react";
import { IoSearch } from "react-icons/io5";

interface Props {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
  className?: string;
}

const SearchBox = (props: Props) => {
  return (
    <form
      onSubmit={props.onSubmit}
      className={cn(
        "flex items-center justify-center relative h-11",
        props?.className
      )}
    >
      <input
        value={props.value}
        onChange={props.onChange}
        type="text"
        placeholder="Search location..."
        className="px-4 py-2 w-[230px] border border-white/60 bg-white/60 backdrop-blur-md rounded-l-full focus:outline-hidden focus:border-sky-400 h-full placeholder:text-gray-500 text-slate-800 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-gray-400"
      />
      <button
        type="submit"
        className="px-4 py-[9px] bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-r-full focus:outline-none hover:from-sky-600 hover:to-blue-700 whitespace-nowrap h-full shadow-sm transition-colors"
      >
        <IoSearch />
      </button>
    </form>
  );
};

export default SearchBox;
