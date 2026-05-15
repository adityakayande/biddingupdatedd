import PropTypes from "prop-types";
import { RiAuctionFill } from "react-icons/ri";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdOutlineFavorite } from "react-icons/md";
import { Caption, PrimaryButton, ProfileCard, Title } from "../common/Design";
import { NavLink } from "react-router-dom";

export const ProductCard = ({ item }) => {
  return (
    <>
      <div className="bg-white shadow-s1 rounded-xl p-3 transition-all duration-300 hover:-translate-y-2 hover:shadow-s3 border border-gray-100">
        <div className="h-56 relative overflow-hidden rounded-xl">
          <NavLink to={`/details/${item?._id}`}>
            <img src={item?.image} alt={item?.image} className="w-full h-full object-cover rounded-xl hover:scale-110 hover:cursor-pointer transition-transform duration-500 ease-in-out" />
          </NavLink>
          <ProfileCard className="shadow-s1 absolute right-3 bottom-3 bg-white/90 backdrop-blur-sm">
            <RiAuctionFill size={22} className="text-green" />
          </ProfileCard>

          <div className="absolute top-0 left-0 p-2 w-full">
            <div className="flex items-center justify-between">
              {item?.isSoldout ? (
                <Caption className="text-red-500 bg-white/90 backdrop-blur-sm shadow-sm px-3 py-1 text-sm rounded-full font-semibold">Sold Out</Caption>
              ) : (
                <Caption className="text-green bg-green_100/90 backdrop-blur-sm shadow-sm px-3 py-1 text-sm rounded-full font-semibold">In Stock</Caption>
              )}
              <Caption className="text-green bg-green_100/90 backdrop-blur-sm shadow-sm px-3 py-1 text-sm rounded-full font-semibold">{item?.totalBids} Bids</Caption>
            </div>
          </div>
        </div>
        <div className="details mt-4">
          <Title className="uppercase text-primary font-bold">{item?.title}</Title>
          <hr className="mt-3 border-gray-200" />
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center justify-between gap-5">
              <div className="bg-green_100 p-2 rounded-lg">
                <RiAuctionFill size={28} className="text-green" />
              </div>
              <div>
                <Caption className="text-gray-500 font-medium">Current Bid</Caption>
                <Title className="text-primary font-bold">${item?.biddingPrice}.00</Title>
              </div>
            </div>
            <div className="w-[1px] h-10 bg-gray-200"> </div>
            <div className="flex items-center justify-between gap-5">
              <div className="bg-red-50 p-2 rounded-lg">
                <GiTakeMyMoney size={28} className="text-red-500" />
              </div>
              <div>
                <Caption className="text-gray-500 font-medium">Buy Now</Caption>
                <Title className="text-primary font-bold">${item?.price}.00</Title>
              </div>
            </div>
          </div>
          <hr className="mb-3 border-gray-200" />

          <div className="flex items-center justify-between mt-4">
            <PrimaryButton className="rounded-lg text-sm w-full mr-3 hover:scale-[1.02] transition-transform bg-green hover:bg-green/90 shadow-md">Place Bid</PrimaryButton>
            <PrimaryButton className="rounded-lg px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
              <MdOutlineFavorite size={20} className="hover:text-red-500 transition-colors" />
            </PrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
};

ProductCard.propTypes = {
  item: PropTypes.any,
};
