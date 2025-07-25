import React from 'react';
import news2 from "../assets/news2.png";

const ProductComponent = () => {
  return (
    <div className="blog_comp">
      <div className="blog_header">
        <h1>A full suite of products</h1>
        <div className="blog_filter">
          <button>Spot</button>
          <button className="bg_color">USD -Futures </button>
          <button className="bg_color">Savings</button>
          <button className="bg_color">Staking</button>
          <button className="bg_color">ChainSiren Launchpad</button>
        </div>
      </div>

      <div className="blog_grid">
        <div className="pro_grid_comp">
          <h1>Trade seamlessly with ChainSiren Spot</h1>
          <p>Trade more than 740 cryptocurrency and fiat pairs, including Bitcoin, Ethereum, and BNB with ChainSiren Spot. Experience seamless trading with the largest crypto exchange by trade volume. Our matching system is capable of processing up to 1.4 million orders per second.</p>
          <button>Trade Now </button>
        </div>
        <div className="pro_grid_comp">
          <img src={news2} alt="" />
        </div>
      </div>
    </div>
  );
};

export default ProductComponent;
