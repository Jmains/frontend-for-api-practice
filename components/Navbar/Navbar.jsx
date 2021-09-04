import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";

import s from "./Navbar.module.scss";

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogoutClick = () => {
    logout();
  };

  const navbar = user?.username ? (
    <nav className={s.nav}>
      <ul className={s.nav__list}>
        <li className={s.nav__item}>
          <button onClick={handleLogoutClick}>logout</button>
        </li>
        <li className={s.nav__item}>
          <Link href="/home">
            <a>Home</a>
          </Link>
        </li>
      </ul>
      <Link href={`/profiles/${user?.username}`}>
        <a>
          <img className={s.nav__avatar} src={user.avatar} alt="user image" />
        </a>
      </Link>

      <span>Welcome: {user.username}</span>
    </nav>
  ) : (
    <nav className={s.nav}>
      <ul className={s.nav__list}>
        <li className={s.nav__item}>
          <Link href="/login">
            <a>Login</a>
          </Link>
        </li>
        <li className={s.nav__item} style={{ marginLeft: "2rem" }}>
          <Link href="/register">
            <a>Register</a>
          </Link>
        </li>
      </ul>
    </nav>
  );

  return navbar;
}
