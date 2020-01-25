import React from 'react';

const CartItem = props => {
  // ternary is necessary because the structure of the item objects that return from the USER backend routes is different to that of the GUEST object
  const item = props.item.product ? props.item.product : props.item;
  item.quantity = item.quantity ? item.quantity : props.item.quantity;
  const price = String(item.price);
  return (
    <tr className="cart-item">
      <td>{item.name}</td>
      <td>
        ${price.slice(0, price.length - 2)}.{price.slice(price.length - 2)}
      </td>
      <td>
        <img src={item.imageUrl} height="60px" />
      </td>
      <td>Quantity:{item.quantity}</td>
      <td>
        <button type="submit" name="add" id={item.id} onClick={props.handleAdd}>
          +
        </button>
        <button
          type="submit"
          name="subtract"
          id={item.id}
          onClick={props.handleRemove}
        >
          -
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
