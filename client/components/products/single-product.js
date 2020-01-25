import React from 'react';

const SingleProduct = props => {
  const price = props.price.toString();
  return (
    <div className="product-div">
      <div className="products-top">
        <h2>{props.name}</h2>
        <h4>
          ${price.slice(0, price.length - 2)}.{price.slice(price.length - 2)}
        </h4>
        <div className="product-img"><img src={props.imageUrl} height="50%" width="50%" /></div>
      </div>
      <div className="product-buy-btn">

        <form>
          <button type="submit" name={props.id} onClick={props.handleSubmit}>
            Add to cart
          </button>
        </form>
      </div>
    </div>
  );
};

export default SingleProduct;
