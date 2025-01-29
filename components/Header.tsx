import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className=" sticky top-0 z-50 flex items-center justify-between px-6 py-4 shadow-md bg-inherit backdrop-blur-lg border">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        SprintFlow
      </Link>
      

      <div className="hidden md:flex gap-6">
        <Link href="/" className="text-gray-100 hover:text-blue-600">Home</Link>
        <Link href="/about" className="text-gray-100 hover:text-blue-600">About Us</Link>
        <Link href="/pricing" className="text-gray-100 hover:text-blue-600">Pricing</Link>
        <Link href="/contact" className="text-gray-100 hover:text-blue-600">Contact</Link>
      </div>
      
      <div className="hidden md:flex">
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden">
            <Menu size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-6 space-y-6">
          <Link href="/" className="text-lg font-medium text-gray-100 block">Home</Link>
          <Link href="/about" className="text-lg font-medium text-gray-100 block">About Us</Link>
          <Link href="/pricing" className="text-lg font-medium text-gray-100 block">Pricing</Link>
          <Link href="/contact" className="text-lg font-medium text-gray-100 block">Contact</Link>
          <Button asChild className="w-full">
            <Link href="/login">Login</Link>
          </Button>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;
