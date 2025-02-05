import NavbarClient from './Header';
import { checkUser } from "@/lib/CheckUser";

const Navbar = async () => {
  await checkUser();
  return <NavbarClient />;
};

export default Navbar;