import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// design
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import { Container, CustomNavLink, CustomNavLinkList, ProfileCard } from "../../router";
import { User1 } from "../hero/Hero";
import { menulists } from "../../utils/data";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenuOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeMenuOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", closeMenuOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Check if it's the home page
  const isHomePage = location.pathname === "/";

  const role = "buyer";
  return (
    <>
      <header className={`header py-3 transition-all duration-300 z-50 ${isHomePage && !isScrolled ? "bg-transparent absolute w-full top-0" : "bg-primary shadow-s1 fixed w-full top-0 scrolled"}`}>
        <Container>
          <nav className="p-4 flex justify-between items-center relative">
            <div className="flex items-center gap-14">
              <div>
                <img src="../images/common/header-logo.png" alt="LogoImg" className="h-11 drop-shadow-md" />
              </div>
              <div className="hidden lg:flex items-center justify-between gap-8">
                {menulists.map((list) => (
                  <li key={list.id} className="capitalize list-none">
                    <CustomNavLinkList href={list.path} isActive={location.pathname === list.path} className="text-white hover:text-green transition-colors">
                      {list.link}
                    </CustomNavLinkList>
                  </li>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-8 icons">
              <div className="hidden lg:flex lg:items-center lg:gap-8">
                <IoSearchOutline size={23} className="text-white hover:text-green transition-colors cursor-pointer" />
                {role === "buyer" && (
                  <CustomNavLink href="/seller/login" className="text-white hover:text-green transition-colors">
                    Become a Seller
                  </CustomNavLink>
                )}
                <CustomNavLink href="/login" className="text-white hover:text-green transition-colors">
                  Sign in
                </CustomNavLink>
                <CustomNavLink href="/register" className="bg-green hover:bg-green/90 px-8 py-2 rounded-full text-white shadow-md transition-transform hover:scale-105">
                  Join
                </CustomNavLink>
                <CustomNavLink href="/dashboard">
                  <ProfileCard className="hover:ring-2 hover:ring-green transition-all">
                    <img src={User1} alt="" className="w-full h-full object-cover" />
                  </ProfileCard>
                </CustomNavLink>
              </div>
              <div className="icon flex items-center justify-center gap-6 text-white">
                <button onClick={toggleMenu} className="lg:hidden w-10 h-10 flex justify-center items-center bg-gray-800 rounded-lg text-white focus:outline-none">
                  {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                </button>
              </div>
            </div>

            {/* Responsive Menu if below 768px */}
            <div ref={menuRef} className={`lg:flex lg:items-center lg:w-auto w-full p-5 absolute right-0 top-full menu-container ${isOpen ? "open" : "closed"}`}>
              {menulists.map((list) => (
                <li href={list.path} key={list.id} className="uppercase list-none my-3">
                  <CustomNavLink className="text-white hover:text-green transition-colors block">{list.link}</CustomNavLink>
                </li>
              ))}
            </div>
          </nav>
        </Container>
      </header>
    </>
  );
};
