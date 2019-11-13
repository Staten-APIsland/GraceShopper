import React from 'react';
import StripeCheckout from 'react-stripe-checkout';

export default class CheckoutStripe extends React.Component {
  onToken = (token, addresses) => {
    console.log('processing payment!');
  };

  render() {
    return (
      <StripeCheckout
        stripeKey="pk_test_uHnEMWMhgx8IqFXlQuJXKpuY00ll20C53t"
        token={this.props.handleCheckout}
      />
    );
  }
}
