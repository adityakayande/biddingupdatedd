import {
  Body,
  Caption,
  Container,
  PrimaryButton,
  ProfileCard,
  Title,
} from "../../router";
import { IoIosSearch } from "react-icons/io";
import { AiOutlinePropertySafety } from "react-icons/ai";
import PropTypes from "prop-types";
import { CiCirclePlus } from "react-icons/ci";
export const User1 = "https://cdn-icons-png.flaticon.com/128/6997/6997662.png";
export const User2 = "https://cdn-icons-png.flaticon.com/128/236/236832.png";
export const User3 = "https://cdn-icons-png.flaticon.com/128/236/236831.png";
export const User4 = "https://cdn-icons-png.flaticon.com/128/1154/1154448.png";

export const Hero = () => {
  return (
    <>
      <section className="hero bg-gradient-to-br from-primary via-slate-800 to-primary py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <Container className="flex items-center justify-between md:flex-row flex-col relative z-10">
          <div className="w-full md:w-1/2 text-white pr-12">
            <Title level={3} className="text-white drop-shadow-lg">
              BiddingWeb Academic Project
            </Title>
            <Body className="leading-7 text-gray-200 my-8 opacity-90">
              Welcome to our demonstration of a real-time bidding application. This platform showcases essential e-commerce functionalities, including user authentication, dynamic product listings, and an interactive auction mechanism. Built for educational purposes to demonstrate full-stack web development.
            </Body>
            <SearchBox />
          </div>
          <div className="w-full md:w-1/2 my-16 relative py-16">
            <img src="../images/home/hero.webp" alt="" className="drop-shadow-2xl" />
            <div className="horiz-move absolute md:top-28 top-8 left-0">
              <Box title="Proof of quality" />
            </div>
            <div className="horiz-move absolute bottom-72 right-0">
              <Box title="Safe and secure" />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

const SearchBox = () => {
  return (
    <>
      <form className="">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-800 sr-only"
        >
          Search
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 start-2 flex items-center ps-3 pointer-events-none">
            <IoIosSearch color="gray" size={25} />
          </div>
          <input
            type="search"
            id="default-search"
            className="block shadow-glass w-full p-6 ps-16 text-sm text-white rounded-full glass outline-none focus:ring-2 focus:ring-green transition-all"
            placeholder="Search product..."
          />
          <PrimaryButton className="absolute end-2.5 bottom-2.5 bg-green hover:bg-green/80 hover:scale-105 transition-all">
            Search
          </PrimaryButton>
        </div>
      </form>
    </>
  );
};

const Box = ({ title, desc }) => {
  return (
    <>
      <div className="px-5 py-4 glass shadow-glass flex items-center gap-5 rounded-xl w-auto transition-transform hover:scale-105">
        <div className="w-14 h-14 bg-green/20 flex items-center justify-center rounded-full backdrop-blur-sm">
          <AiOutlinePropertySafety size={27} className="text-green" />
        </div>
        <div>
          <Title className="text-white text-lg">{title}</Title>
          <Caption className="text-gray-300">{desc}</Caption>
        </div>
      </div>
    </>
  );
};

Box.propTypes = {
  title: PropTypes.any,
  desc: PropTypes.any,
};
