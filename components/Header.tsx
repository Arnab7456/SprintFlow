"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChartNoAxesGantt, Menu } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"; // Added imports

const Navbar = () => {

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 shadow-md bg-inherit backdrop-blur-lg border">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        SprintFlow
      </Link>
      <div className="hidden md:flex gap-6">
      <SignedOut>
        <Link href="/" className="text-gray-100 hover:text-blue-600">
          Home
        </Link>
       
        <Link href="/about" className="text-gray-100 hover:text-blue-600">
          About Us
        </Link>
       
        <Link href="/Pricing" className="text-gray-100 hover:text-blue-600">
          Pricing
        </Link>
      
        <Link href="/contact" className="text-gray-100 hover:text-blue-600">
          Contact
        </Link>
        </SignedOut>
      </div>

      <div className="hidden md:flex gap-4">
        <SignedIn>
          <Button className="bg-red-200 hover:bg-red-600">
            <Link href="/dashboard">Create Project</Link>
          </Button>
          <UserButton > 
            <UserButton.MenuItems>
              <UserButton.Link 
              label="My Organization"
              labelIcon = {<ChartNoAxesGantt size={24} />}
              href="/onboarding" />
            </UserButton.MenuItems>
          </UserButton>
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
          <UserButton > 
            <UserButton.MenuItems>
              <UserButton.Link 
              label="My Organization"
              labelIcon = {<ChartNoAxesGantt size={24} />}
              href="/onboarding" />
            </UserButton.MenuItems>
          </UserButton>
          </SignedIn>
          <SignedOut>
          <Link
            href="/about"
            className="text-lg font-medium text-gray-100 block"
          >
            About Us
          </Link>
          <Link
            href="/pricing"
            className="text-lg font-medium text-gray-100 block"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            className="text-lg font-medium text-gray-100 block"
          >
            Contact
          </Link>
          </SignedOut>
          <SignedIn>
            <Button asChild className="w-full gap-4 hover:bg-red-600 ">
              <Link href="/dashboard">Create Project</Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <Button asChild className="w-full gap-4">
              <Link href="/sign-in">Login</Link>
            </Button>
            <Button asChild className="w-full gap-4">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </SignedOut>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;
