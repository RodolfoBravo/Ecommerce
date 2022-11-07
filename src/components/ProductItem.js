import React, { Component } from "react";
import PropTypes from 'prop-types';

const { stripHtml } = require("string-strip-html");

const ProductItem = ({ product, onAddToCart }) => {

    const { result } = stripHtml(product.description);

    const handleAddToCart = () => {
        onAddToCart(product.id, 1);
      }

    return (
        <div className="col-sm-6 col-md-3">
            <div className="thumb-wrapper">
                <span className="wish-icon" ><i className={"fa fa-heart"}></i></span>
                <div className="img-box">
                    <img className="img-fluid" src={product.image?.url} alt={product.name} />
                </div>
                <div className="thumb-content">
                    <h4>{product.name}</h4>
                    <div className="star-rating">
                        <ul className="list-inline">
                            <li className="list-inline-item"><i className="fa fa-star"></i></li>
                            <li className="list-inline-item"><i className="fa fa-star"></i></li>
                            <li className="list-inline-item"><i className="fa fa-star"></i></li>
                            <li className="list-inline-item"><i className="fa fa-star"></i></li>
                            <li className="list-inline-item"><i className="fa fa-star"></i></li>
                        </ul>
                    </div>
                    <p>{result}</p>
                    <p className="item-price"><strike>{product.price.formatted_with_symbol}</strike> <b> {product.price.formatted_with_symbol}</b></p>
                    <a href="#" className="btn btn-primary product__btn"
                     name="Add to cart"
                     onClick={handleAddToCart}>Add to Cart</a>
                </div>
            </div>
        </div>
    );

};

ProductItem.propTypes = {
    product: PropTypes.object,
};

export default ProductItem; 


{/*
const ProductItem = ({ product }) => {

    const { result } = stripHtml(product.description);

    return (
        <div className="product__card">
            <img className="product__image" src={product.image?.url} alt={product.name} />
            <div className="product__info">
                <h4 className="product__name">{product.name}</h4>
                <p className="product__description">
                    {result}
                </p>
                <div className="product__details">
                    <p className="product__price">
                        {product.price.formatted_with_symbol}
                    </p>
                </div>
            </div>
        </div>
    );
};

ProductItem.propTypes = {
    product: PropTypes.object,
};

export default ProductItem; 

*/}

