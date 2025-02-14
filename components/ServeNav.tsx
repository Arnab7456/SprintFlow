import NavbarClient from './Header';
import { checkUser } from "@/lib/CheckUser";
import UserLoading from './user-loading';

const NavbarServer = async () => {
  await checkUser();
  return (
    <div className="sticky top-0 z-50 ">
      <NavbarClient />
      <UserLoading />
    </div>
  )
};

export default NavbarServer;