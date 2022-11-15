import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';


const Cart = ({ cart, onRemoveFromCart, onEmptyCart, onUpdateCartQty }) => {

  const handleEmptyCart = () => {
    onEmptyCart();
  }

  const renderEmptyMessage = () => {
    if (cart.total_unique_items > 0) {
      return;
    }

    return (
      <p className="cart__none">
        You have no items in your shopping cart, start adding some!
      </p>
    );
  }

  const renderItems = () => (
    cart.line_items.map((lineItem) => (
      <CartItem
        item={lineItem}
        key={lineItem.id}
        className="cart__inner"
        onUpdateCartQty={onUpdateCartQty}
        onRemoveFromCart={onRemoveFromCart}
      />
    ))
  );

  const renderTotal = () => (
    <div className="cart__total">
      <p className="cart__total-title">Subtotal:</p>
      <p className="cart__total-price">{cart.subtotal.formatted_with_symbol}</p>
    </div>
  );

  return (
    <div className="cart">
      <h4 className="cart__heading">Your Shopping Cart</h4>
      <hr />
      {renderEmptyMessage()}
      {renderItems()}
      {renderTotal()}
      <div className="cart__footer d-flex justify-content-center my-2">
        <button className="cart__btn-empty btn btn-outline-dark mx-2" onClick={handleEmptyCart}>Empty cart</button>
        <Link
          className="cart__btn-checkout btn btn-outline-dark mx-2"
          to="/checkout"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
};

Cart.propTypes = {
  cart: PropTypes.object,
  onEmptyCart: () => { },
};

export default Cart;