import React from 'react';

const CartItem = props => {
  const price = props.price.toString();
  return (
    <tr className="cart-item">
      <td>{props.name}</td>
      <td>
        ${price.slice(0, price.length - 2)}.{price.slice(price.length - 2)}
      </td>
      <td>
        <img src={props.imageUrl} height="60px" />
      </td>
      <td>Quantity: {props.quantity}</td>
      <td>
        <button
          type="submit"
          name="add"
          id={props.id}
          onClick={props.handleAdd}
        >
          +
        </button>
        <button
          type="submit"
          name="subtract"
          id={props.id}
          onClick={props.handleRemove}
        >
          -
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
