import s from "./Layout.module.scss";
import Navbar from "../Navbar/Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className={s.layout}>{children}</main>
    </>
  );
}
