import NavbarClient from './Header';
import { checkUser } from "@/lib/CheckUser";

const NavbarServer = async () => {
  await checkUser();
  return <NavbarClient />;
};

export default NavbarServer;