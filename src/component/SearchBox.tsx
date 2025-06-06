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
        "flex items-center justify-center relative h-10",
        props?.className
      )}
    >
      <input
        value={props.value}
        onChange={props.onChange}
        type="text"
        placeholder="Search location..."
        className="px-4 py-2 w-[230px] border border-gray-300 rounded-l-md focus:outline-hidden focus:border-blue-500 h-full placeholder:text-gray-500"
      />
      <button
        type="submit"
        className="px-4 py-[9px] bg-blue-500 text-white rounded-r-md focus:outline-none hover:bg-blue-600 whitespace-nowrap h-full"
      >
        <IoSearch />
      </button>
    </form>
  );
};

export default SearchBox;
