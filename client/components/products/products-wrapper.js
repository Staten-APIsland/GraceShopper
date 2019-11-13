import React from 'react';
import {connect} from 'react-redux';
import SingleProduct from './single-product';
import {getAllProductsThunk, addToCartThunk} from '../../store/products';

class ProductsWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const productId = Number(event.target.name);
    const productToAdd = this.props.products.find(
      item => item.id === productId
    );
    productToAdd.quantity = 1;
    this.props.addToCart(productToAdd);
  }

  componentDidMount() {
    this.props.getAllProducts();
  }

  render() {
    const products = this.props.products;
    return (
      <div className="products-list-all">
        <h1>Swords</h1>
        <hr />
        <div className="product-div-wrapper">
          {products.map((product, index) => (
            <div id="product-div" key={`${index}`}>
              <SingleProduct
                key={product.id}
                {...product}
                handleSubmit={this.handleSubmit}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapDispatch = dispatch => {
  return {
    getAllProducts: () => dispatch(getAllProductsThunk()),
    addToCart: product => dispatch(addToCartThunk(product))
  };
};

export default connect(null, mapDispatch)(ProductsWrapper);
