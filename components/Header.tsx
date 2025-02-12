'use client'
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import UserMenu from "./user-menu";

const NavbarClient =  () => {
  const {theme , setTheme} = useTheme()
  const buttonVariants = {
    hover: { scale: 1.1, transition: { type: "spring", stiffness: 300 } },
    tap: { scale: 0.95 },
  };
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 shadow-md bg-inherit backdrop-blur-lg border ">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        SprintFlow
      </Link>
      <div className="hidden md:flex items-center space-x-4">
        <SignedOut>
          <Link href="/" className=" hover:text-blue-600">
            Home
          </Link>
          <Link href="/about" className=" hover:text-blue-600">
            About Us
          </Link>
          <Link href="/pricing" className=" hover:text-blue-600">
            Pricing
          </Link>
          <Link href="/contact" className=" hover:text-blue-600">
            Contact
          </Link>
          <motion.li
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {theme === "dark" ? (
              <Sun className="text-yellow-500 w-5 h-5" />
            ) : (
              <Moon className="text-gray-800 w-5 h-5" />
            )}
          </motion.li>
        </SignedOut>
       
      </div>

      <div className="hidden md:flex gap-4">
        <SignedIn>
          <Button >
            <Link href="/project/create">Create Project</Link>
          </Button>
          <motion.li
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {theme === "dark" ? (
              <Sun className="text-yellow-500 w-5 h-5" />
            ) : (
              <Moon className="text-gray-800 w-5 h-5" />
            )}
          </motion.li>
          <UserMenu />
        </SignedIn>
        <SignedOut>
          <Button asChild>
            <Link href="/sign-in">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </SignedOut>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-6 space-y-6">
          <SignedIn>
            <UserMenu/>
          </SignedIn>
          <SignedOut>
            <Link href="/about" className="text-lg font-medium  block">
              About Us
            </Link>
            <Link href="/pricing" className="text-lg font-medium  block">
              Pricing
            </Link>
            <Link href="/contact" className="text-lg font-medium  block">
              Contact
            </Link>
          </SignedOut>
          <SignedIn>
          <motion.li
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {theme === "dark" ? (
              <Sun className="text-yellow-500 w-5 h-5" />
            ) : (
              <Moon className="text-gray-800 w-5 h-5" />
            )}
          </motion.li>
            <Button asChild className="w-full gap-4">
              <Link href="/project/create">Create Project</Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <Button asChild className="w-full gap-4">
              <Link href="/sign-in">Login</Link>
            </Button>
            <Button asChild className="w-full gap-4">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
            <motion.li
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {theme === "dark" ? (
              <Sun className="text-yellow-500 w-5 h-5" />
            ) : (
              <Moon className="text-gray-800 w-5 h-5" />
            )}
          </motion.li>
          </SignedOut>
          
        </SheetContent>
      </Sheet>
     
    </nav>
  );
};

export default NavbarClient;