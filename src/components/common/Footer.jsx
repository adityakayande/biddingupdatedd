import { Container, Title } from "./Design";
import { useLocation } from "react-router-dom";

export const Footer = () => {
  return (
    <>
      <footer className="relative bg-primary/80 backdrop-blur-md border-t border-white/10 py-10 mt-16 text-center">
        <Container>
          <Title level={5} className="font-normal text-gray-100">
            BiddingWeb - College Project © 2026
          </Title>
          <p className="text-gray-400 mt-2 text-sm max-w-xl mx-auto">Created for educational purposes. All functionality revolves around adding and bidding on items.</p>
        </Container>
      </footer>
    </>
  );
};
