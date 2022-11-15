import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Confirmation extends Component {
    renderOrderSummary() {
        const { order, onBackToHome } = this.props;

        if (!order) {
            return null;
        }

        return (
            <div className="confirmation">
                <div className="confirmation__wrapper">
                    <div className="confirmation__wrapper-message">
                        <h4>Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}!</h4>
                        <p className="confirmation__wrapper-reference">
                            <span>Order ref:</span> {order.customer_reference}
                        </p>
                    </div>
                    <Link
                        className="confirmation__wrapper-back"
                        type="button"
                        to="/"
                        onClick={onBackToHome}
                    >
                        <span><i class="fa-solid fa-turn-down-left"></i>Back to home</span>
                    </Link>
                </div>
            </div>
        );
    }

    render() {
        return (
            <>
                {this.renderOrderSummary()}
            </>
        );
    };
}

export default Confirmation;

Confirmation.propTypes = {
    order: PropTypes.object,
    onBackToHome: PropTypes.func,
};