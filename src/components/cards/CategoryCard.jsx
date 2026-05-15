import PropTypes from "prop-types";
import { Title } from "../common/Design";
import { useNavigate } from "react-router-dom";

export const CategoryCard = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // convert title to URL format (lowercase + dash)
    const categoryName = item.title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/category/${categoryName}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center flex-col gap-2 py-8 rounded-lg bg-green_1000 shadow-s1 cursor-pointer hover:scale-105 transition"
    >
      <div className="h-24">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-contain"
        />
      </div>

      <Title className="uppercase">{item.title}</Title>
    </div>
  );
};

CategoryCard.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    image: PropTypes.string,
  }),
};
