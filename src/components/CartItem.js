import React from 'react';
import PropTypes from 'prop-types';



const CartItem = ({ item, onUpdateCartQty, onRemoveFromCart }) => {

  const handleUpdateCartQty = (lineItemId, quantity) => {
    onUpdateCartQty(lineItemId, quantity);
  }
  const handleRemoveFromCart = () => {
    onRemoveFromCart(item.id);
  }

  return (
    <div className="cart-item">
      <div className="d-flex flex-row align-items-center justify-content-between">

        <img
          src={item.image.url}
          className="img-fluid rounded-3" alt={item.name} style={{ width: "85px" }} />

        <div>
          <h5>{item.name}</h5>
          <p className="mb-0">256GB, Navy Blue</p>
        </div>
        <div className="d-flex justify-content-center align-items-center" style={{ width: "20rem" }}>
          <button className='btn btn-outline-dark' type="button" onClick={() => item.quantity > 1 ? handleUpdateCartQty(item.id, item.quantity - 1) : handleRemoveFromCart()}>-</button>
          <h5 className="fw-normal mx-2">{item.quantity}</h5>
          <button className='btn btn-outline-dark' type="button" onClick={() => handleUpdateCartQty(item.id, item.quantity + 1)}>+</button>
        </div>
        <div className='d-flex flex-row align-items-center mx-2'>
          <h5 className='mx-1' >{item.line_total.formatted_with_symbol}</h5>
          <a className='btn btn-outline-dark' onClick={handleRemoveFromCart} style={{ color: "#cecece" }}><i className="fas fa-trash-alt"></i></a>
        </div>

      </div>
      <hr />
    </div>

  );
};

CartItem.propTypes = {
  item: PropTypes.object,
};

export default CartItem;

