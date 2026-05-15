import React, { useState, useEffect } from "react";
import { Container, Heading } from "../../router";
import { ProductCard } from "../cards/ProductCard";
import api from "../../utils/api";

export const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <section className="product-home">
        <Container>
          <Heading
            title="Live Auction"
            subtitle="Explore on the world's best & largest Bidding marketplace with our beautiful Bidding products. We want to be a part of your smile, success and future growth."
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 my-8">
            {products?.slice(0, 12)?.map((item, index) => {
              // Map backend data to what ProductCard expects
              const mappedItem = {
                ...item,
                _id: item.id,
                image: item.image_url,
                biddingPrice: item.bids?.length > 0 ? Math.max(...item.bids.map(b => b.amount)) : item.base_price,
                price: item.base_price,
                totalBids: item.bids?.length || 0,
                isSoldout: !item.is_active
              };
              return <ProductCard item={mappedItem} key={index + 1} />;
            })}
          </div>
        </Container>
      </section>
    </>
  );
};
