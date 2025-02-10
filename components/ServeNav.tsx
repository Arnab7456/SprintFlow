import NavbarClient from './Header';
import { checkUser } from "@/lib/CheckUser";
import UserLoading from './user-loading';

const NavbarServer = async () => {
  await checkUser();
  return (
    <div>
      <NavbarClient />
      <UserLoading />
    </div>
  )
};

export default NavbarServer;