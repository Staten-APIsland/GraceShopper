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
      <div id="home">
        <div id="home-bg">
          <img src="images/sword.png" width="700px" />
        </div>
        <div id="header">
          <img src="images/logo.png" width="1000px" />
          <div id="subheader">
            <p>your one-stop shop for the finest blades money can buy.</p>
          </div>
        </div>

        <div id="product-bar">
          {products.map(item => (
            <div
              className="product-bar-div"
              name={`${item.name}`}
              key={`${item.id}`}
            >
              <img src={`${item.imageUrl}`} width="150" height="170" />
            </div>
          ))}
          {products.length !== 0 ? (
            <div id="product-bar-more">
              <Link to="/products">>>> more</Link>
            </div>
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
