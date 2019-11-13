import React from 'react';
import {connect} from 'react-redux';
import ProductsWrapper from './products-wrapper';
import {getAllProductsThunk} from '../../store/products';

class Products extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getAllProducts();
  }

  render() {
    const products = this.props.products;
    return <ProductsWrapper products={products} />;
  }
}

const mapStateToProps = state => {
  return {
    products: state.products,
    cart: state.cart
  };
};

const mapDispatch = dispatch => {
  return {
    getAllProducts: () => dispatch(getAllProductsThunk())
  };
};

export default connect(mapStateToProps, mapDispatch)(Products);
