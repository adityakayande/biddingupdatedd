import { useParams } from "react-router-dom";

const allProducts = [
  // WATCHES (12)
  {
    id: 1,
    category: "watches",
    title: "Rolex GMT-Master II",
    price: 8500,
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314",
  },
  {
    id: 2,
    category: "watches",
    title: "Zenea_ula silver",
    price: 100000,
    location: "Mumbai",
    image:
      "https://assets.thehourmarkers.com/public/image_Zenea_Ula_Diver_Watch_d2b5b22253.jpg",
  },
  {
    id: 3,
    category: "watches",
    title: "Audemars Piguet Royal Oak",
    price: 15000,
    location: "Hydrabad",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa",
  },
  {
    id: 4,
    category: "watches",
    title: "Patek Philippe Nautilus",
    price: 25000,
    location: "Bengluru",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49",
  },
  {
    id: 5,
    category: "watches",
    title: "Tissot",
    price: 70000,
    location: "Hyderabad",
    image:
      "https://www.kapoorwatch.com/blogs/wp-content/uploads/B-102-Top-10-Watches-for-Men-Under-1-Lakh-Internal-1.webp",
  },
  {
    id: 6,
    category: "watches",
    title: "Orient",
    price: 48000,
    location: "Pune",
    image:
      "https://images.squarespace-cdn.com/content/v1/5c78138211f784469d4817df/00fec5e8-7ee6-4591-a399-16fcf8befa80/Orient+RA-TX0203s10b.jpg?format=1500w",
  },
  {
    id: 7,
    category: "watches",
    title: "IWC Big Pilot",
    price: 9200,
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8",
  },
  {
    id: 8,
    category: "watches",
    title: "Titan Stellar Analog Black Dial Watch",
    price: 22356,
    location: "Gurgaon",
    image: "https://m.media-amazon.com/images/I/71kPtNdLsxL._SX342_.jpg",
  },
  {
    id: 9,
    category: "watches",
    title: "Titan Golden Heart Skeletal Automatic Analog with Silver Dial Dual",
    price: 21495,
    location: "Delhi",
    image: "https://m.media-amazon.com/images/I/71ORWk7XpsL._SL1500_.jpg",
  },
  {
    id: 10,
    category: "watches",
    title: "Casio G-Shock GST-B100-1ADR Metal Ip Black Analog Dial Black",
    price: 24995,
    location: "Goa",
    image: "https://m.media-amazon.com/images/I/61P9Ywas3NL._SX679_.jpg",
  },
  {
    id: 11,
    category: "watches",
    title:
      "KENNETH COLE Automatic Drop 2 Automatic Analog with Black Dial Silver Stainless Steel",
    price: 25995,
    location: "Mumbai",
    image: "https://m.media-amazon.com/images/I/81-VPoTQRtL._SL1500_.jpg",
  },
  {
    id: 12,
    category: "watches",
    title:
      "Atowak Stainless Steel Connected Wrist Watch with Leather Strap Water Resistant, Black Case Material 316L Stainless Steel Lens",
    price: 330000,
    location: "Bengluru",
    image: "https://m.media-amazon.com/images/I/71Bgf-WIDxL._SX679_.jpg",
  },

  // ELECTRONICS
  {
    id: 13,
    category: "electronics",
    title: "iPhone 13",
    price: 60000,
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
  },
  {
    id: 14,
    category: "electronics",
    title: "MacBook Pro",
    price: 120000,
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
  },

  {
    id: 15,
    category: "electronics",
    title: "Canon EOS R50 with RF-S",
    price: 60000,
    location: "Mumbai",
    image:
      "https://i1.adis.ws/i/canon/5811C031_EOS-R50_01_01?w=940&bg=rgb(245,246,246)&fmt=webp&qlt=100&sm=aspect&aspect=1:1",
  },
  {
    id: 16,
    category: "electronics",
    title: "Sony SA-D40M2 4.1ch Home Theatre Speaker",
    price: 8992,
    location: "Hydrabad",
    image:
      "https://mahajanelectronics.com/cdn/shop/files/Sony_SA-D40M2_4.1ch_Home_Theatre_Speaker.png?v=1762429229",
  },
  {
    id: 17,
    category: "electronics",
    title: "Sony SA-D40M2 4.1ch Home Theatre Speaker",
    price: 8992,
    location: "Hydrabad",
    image:
      "https://mahajanelectronics.com/cdn/shop/files/Sony_SA-D40M2_4.1ch_Home_Theatre_Speaker.png?v=1762429229",
  },
  {
    id: 18,
    category: "electronics",
    title:
      "Bluetooth Headphones, Premium Active Noise Cancelling Wireless Headphones Over Ear, 50H Playtime, Hi-Res Audio, Deep Bass, Memory Foam Ear Cups for Travel, Home Office",
    price: 7302,
    location: "Hydrabad",
    image:
      "https://m.media-amazon.com/images/I/61RahTQtAqL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    id: 19,
    category: "electronics",
    title: "LG25MS500-B 25 IPS Full HD monitor | LG India",
    price: 15220,
    location: "Noida",
    image:
      "https://www.lg.com/content/dam/channel/wcms/in/images/monitors/25ms500-b-atr-eail-in-c/gallery/fhd-25ms550-gallery-01-2010.jpg/jcr:content/renditions/thum-1600x1062.jpeg?w=800",
  },
  {
    id: 20,
    category: "electronics",
    title:
      " Assembled Desktop Computer CPU, i3 Processor 3Ghz, H55 Motherboard, SSD 120GB, 4GB RAM, Windows 10 Pro Trial Version with Web Camera Mic Speaker (Hard Disk, 250GB)",
    price: 12229,
    location: "Pune",
    image:
      "https://m.media-amazon.com/images/I/71ekwRbwrbL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    id: 21,
    category: "electronics",
    title: "TCL NXTPAPER 14",
    price: 9760,
    location: "gurgaon",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.051ee0Jn6gUyuuOAAs3KPwHaEm?pid=Api&P=0&h=180",
  },
  // SPORTS
  {
    id: 22,
    category: "sports",
    title: "NIVIA Storm Football Size 5 - Orange Blue",
    price: 463,
    location: "Pune",
    image:
      "https://cdn.fcglcdn.com/brainbees/images/products/583x720/10454111a.webp",
  },
  {
    id: 23,
    category: "sports",
    title:
      "SG RSD Spark Kashmir Willow Cricket Bat Short Handle - Color May Vary",
    price: 2998,
    location: "patna",
    image:
      "https://cdn.fcglcdn.com/brainbees/images/products/583x720/13401539a.webp",
  },
  {
    id: 24,
    category: "sports",
    title: "Wilson Hyper Hammer 5.3 Tennis Racquet Racket 110 16x20 Unisex",
    price: 11422,
    location: "Delhi",
    image:
      "https://cdn10.bigcommerce.com/s-q61y4tb2/products/24901/images/68820/wrt58610__1__45844.1667489932.600.600.jpg?c=2",
  },
  {
    id: 25,
    category: "sports",
    title:
      "SG R.P.M. Sports Economy Kashmir Willow Cricket Kit Size 6 - Color May Vary",
    price: 7340,
    location: "Delhi",
    image:
      "https://cdn.fcglcdn.com/brainbees/images/products/583x720/13401530a.webp",
  },
  {
    id: 26,
    category: "sports",
    title: "Hockey Kit",
    price: 5430,
    location: "Pune",
    image:
      "https://2.imimg.com/data2/JX/LQ/MY-3626744/hockey-kit-1000x1000.jpg",
  },
  {
    id: 27,
    category: "sports",
    title: "Howzat Spike 20 Shoes",
    price: 6019,
    location: "Pune",
    image:
      "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/9cf1f54b88db417b87d551995b6fbcdc_9366/Howzat_Spike_20_Shoes_White_IH8167_04_standard.jpg",
  },
  {
    id: 28,
    category: "sports",
    title: "COSCO Cosco Serve Volleyball Size 4 (Color May vary)",
    price: 715,
    location: "Nanded",
    image:
      "https://cdn.fcglcdn.com/brainbees/images/products/583x720/15510201a.webp",
  },
  {
    id: 29,
    category: "sports",
    title:
      "YAMAMA Super Archery Bow And Arrow Set With Colourful Dart Target Board With 3 Suction Cup Tip Arrows - Blue",
    price: 392,
    location: "Kolhapur",
    image:
      "https://cdn.fcglcdn.com/brainbees/images/products/zoom/15439515a.webp",
  },
  //REAL-ESTATE

  {
    id: 30,
    category: "real-estate",
    title: "Shapoorji Pallonji The Odyssey 1",
    price: 32500000,
    location: "Mumbai",
    image:
      "https://newprojects.99acres.com/projects/floreat_investments/floreat_shapoorji_pallonji_the_odyssey_1/images/phkox8d_1733745008_536630225_large.jpg",
  },
  {
    id: 31,
    category: "real-estate",
    title: "Atlas Royal",
    price: 25000000,
    location: "Girgaon",
    image:
      "https://imagecdn.99acres.com/media1/37430/1/748601918O-1777013407210.jpg",
  },
  {
    id: 32,
    category: "real-estate",
    title: "Ethics oliver",
    price: 33500000,
    location: "South Mumbai",
    image:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1614453847557905410/original/ef687f61-0b93-404f-a7da-d344a901e291.png?im_w=960",
  },
  {
    id: 33,
    category: "real-estate",
    title: "Aura The Magical Highway | 1BHK LodhaBelmondo Pune",
    price: 28700000,
    location: "Pune",
    image:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTQyOTE3MjExMzE5MDA2NzkyNw==/original/1bacba25-b503-4b12-a81c-daf93db03b8e.jpeg?im_w=720&_swrbgfetch=1777540397116",
  },

  // VEHICLE
  {
    id: 34,
    category: "vehicle",
    title: "Renault Captur - Zen E-Tech Plug in 160Hp - 2022",
    price: 300000,
    location: "Bangalore",
    image:
      "https://caroutlet.es/wp-content/uploads/thememakers/cardealer/8/5017/main/6962a43ff0584.jpg",
  },
  {
    id: 35,
    category: "vehicle",
    title: "Dacia Sandero - COMFORT BLUE DCI 90HP - 2016",
    price: 475000,
    location: "Hyderabad",
    image:
      "https://caroutlet.es/wp-content/uploads/thememakers/cardealer/1/5152/main/69f05f16f1afa.jpg",
  },
  {
    id: 36,
    category: "vehicle",
    title: "2017 Toyota Fortuner 2.8 4x2 AT [2016-2020]",
    price: 2100000,
    location: "Hyderabad",
    image:
      "https://imgd-ct.aeplcdn.com/1024x768/vimages/202603/4418921_8258_5_1772439129527.jpg?q=80",
  },
  {
    id: 38,
    category: "vehicle",
    title: "2023 KTM Duke Standard [2022]",
    price: 210000,
    location: "Nagpur",
    image:
      "https://imgd.aeplcdn.com/640X480/n/bw/used/s769895/769895_1769785983093.jpg?q=80",
  },
  {
    id: 39,
    category: "vehicle",
    title: "2024 Royal Enfield Meteor Stellar",
    price: 213000,
    location: "Nagpur",
    image:
      "https://imgd.aeplcdn.com/640X480/n/bw/used/s770149/770149_1769842976438.jpg?q=80",
  },
  {
    id: 40,
    category: "vehicle",
    title: "2025 Yamaha YZF M - Carbon Fibre",
    price: 330000,
    location: "Nagpur",
    image:
      "https://imgd.aeplcdn.com/640X480/n/bw/used/s768925/768925_1769670760374.jpeg?q=80",
  },
  {
    id: 41,
    category: "vehicle",
    title: "2022 Kawasaki Ninja Standard",
    price: 220700,
    location: "Nagpur",
    image:
      "https://imgd.aeplcdn.com/640X480/n/bw/used/s814006/814006_1775728066560.jpeg?q=80",
  },
  {
    id: 42,
    category: "vehicle",
    title: "2016 Audi Q3 35 TDI Technology",
    price: 1400000,
    location: "Mumbai",
    image:
      "https://imgd.aeplcdn.com/400x300/vimages/202604/4498917_2427_1776077315742.jpg?qp=80&fit=true",
  },

  // JEWELRY
  {
    id: 43,
    category: "jewelry",
    title: "Gold Necklace",
    price: 70000,
    location: "Jaipur",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338",
  },

  // CLOTHES
  {
    id: 44,
    category: "clothes",
    title: "Leather Jacket",
    price: 3000,
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1520975922213-3c7c4b3c3c1e",
  },
  {
    id: 45,
    category: "clothes",
    title: "Shirt",
    price: 1200,
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd53",
  },
];

const CategoryPage = () => {
  const { name } = useParams();

  const filteredProducts = allProducts
    .filter((item) => item.category === name)
    .slice(0, 12);

  const handleBid = (item) => {
    alert(`Bid placed on ${item.title} for ₹${item.price}`);
  };

  return (
    <div className="p-6">
      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-6">{name.toUpperCase()}</h1>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition flex flex-col"
          >
            {/* IMAGE */}
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-56 object-cover"
            />

            {/* CONTENT */}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-semibold mb-2">{item.title}</h3>

              {/* LOCATION */}
              <p className="text-sm text-gray-500 mb-2">📍 {item.location}</p>

              {/* PRICE */}
              <p className="text-lg font-bold text-green-600 mb-4">
                ₹ {item.price.toLocaleString()}
              </p>

              {/* BUTTON */}
              <button
                className="mt-auto bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                onClick={() => handleBid(item)}
              >
                Place Bid
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
