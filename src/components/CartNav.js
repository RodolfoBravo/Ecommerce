import React, { useState } from 'react';
import Cart from './Cart';

const CartNav = ({ cart, onRemoveFromCart, onUpdateCartQty, onEmptyCart }) => {
    const [isCartVisible, setCartVisible] = useState(false);

    const renderOpenButton = () => (
        <button className="nav__cart-btn--open">
            <i className="fa-solid fa-bag-shopping"></i>
            {cart !== null ? <span>{cart.total_items}</span> : ''}
        </button>
    );

    const renderCloseButton = () => (
        <button className="nav__cart-btn--close">
           <i className="fa-sharp fa-solid fa-circle-xmark"></i>
        </button>
    );

    return (
        <div className="nav">
            <div className="nav__cart" onClick={() => setCartVisible(!isCartVisible)}>
                {!isCartVisible ? renderOpenButton() : renderCloseButton()}
            </div>
            {isCartVisible &&
                <Cart
                    cart={cart}
                    onUpdateCartQty={onUpdateCartQty}
                    onRemoveFromCart={onRemoveFromCart}
                    onEmptyCart={onEmptyCart}
                />
            }
        </div>
    );
};

export default CartNav;