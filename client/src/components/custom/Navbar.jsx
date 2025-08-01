import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "./ModeToggle";
import CartDrawer from "./CartDrawer";
import { User } from "lucide-react";
import LogoutToggle from "./LogoutToggle";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <nav className="flex justify-between items-center px-8 py-5 border-b dark:bg-zinc-900">
      {/* icons */}
      <div className="flex gap-2 justify-center items-center">
        <ModeToggle />
        <CartDrawer />

        {isAuthenticated ? (
          <LogoutToggle user={user} />
        ) : (
          <Link to="/login">
            <User
              size={28}
              strokeWidth={1.3}
              className="text-gray-800 dark:text-white hover:scale-105 transition-all ease-in-out cursor-pointer"
            />
          </Link>
        )}
      </div>
      <Link to={"/"} className="text-2xl font-bold">
        Kora
      </Link>
      <ul className="hidden sm:flex gap-2 text-xl">
        <Link to="/">About</Link>
        <Link to="/">Faqs</Link>
      </ul>
    </nav>
  );
};

export default Navbar;
