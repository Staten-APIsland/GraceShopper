import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {getAllProductsThunk} from '../store/products';

class DefaultHome extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getAllProducts();
  }

  render() {
    const products = this.props.products;

    return (
      <div id="home-bar">
        <div id="home-bg" />
        <div id="header">
          <h1 id="Home-Title">The Armory</h1>
          <p>Your one-stop shop for the finest blades money can buy.</p>
        </div>

        <div id="product-bar">
          {products.map(item => (
            <div
              id="product-bar-indiv"
              name={`${item.name}`}
              key={`${item.id}`}
            >
              <img src={`${item.imageUrl}`} width="150" height="170" />
            </div>
          ))}
          {products.length !== 0 ? (
            <Link to="/products">>>> More</Link>
          ) : (
            <Link />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.products
  };
};

const mapDispatch = dispatch => {
  return {
    getAllProducts: () => dispatch(getAllProductsThunk())
  };
};

export default connect(mapStateToProps, mapDispatch)(DefaultHome);
