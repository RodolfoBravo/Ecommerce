import React, { Component } from 'react';
import PropTypes from 'prop-types';
import commerce from '../lib/Commerce';
import { Link } from 'react-router-dom';

class Checkout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checkoutToken: {},
            // Customer details
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'janedoe@email.com',
            // Shipping details
            shippingName: 'Jane Doe',
            shippingStreet: '123 Fake St',
            shippingCity: '',
            shippingStateProvince: '',
            shippingPostalZipCode: '',
            shippingCountry: '',
            // Payment details
            cardNum: '4242 4242 4242 4242',
            expMonth: '11',
            expYear: '2023',
            ccv: '123',
            billingPostalZipcode: '94107',
            // Shipping and fulfillment data
            shippingCountries: {},
            shippingSubdivisions: {},
            shippingOptions: [],
            shippingOption: '',
        }

        this.handleFormChanges = this.handleFormChanges.bind(this);
        this.handleShippingCountryChange = this.handleShippingCountryChange.bind(this);
        this.handleSubdivisionChange = this.handleSubdivisionChange.bind(this);
        this.handleCaptureCheckout = this.handleCaptureCheckout.bind(this);
    };

    componentDidMount() {
        this.generateCheckoutToken();
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.state.shippingCountry !== prevState.shippingCountry) {
            this.fetchShippingOptions(this.state.checkoutToken.id, this.state.shippingCountry);
        }
    };

    sanitizedLineItems(lineItems) {
        return lineItems.reduce((data, lineItem) => {
            const item = data;
            let variantData = null;
            if (lineItem.selected_options.length) {
                variantData = {
                    [lineItem.selected_options[0].group_id]: lineItem.selected_options[0].option_id,
                };
            }
            item[lineItem.id] = {
                quantity: lineItem.quantity,
                variants: variantData,
            };
            return item;
        }, {});
    }

    /**
     *  Generates a checkout token
     *  https://commercejs.com/docs/sdk/checkout#generate-token
     */
    generateCheckoutToken() {
        const { cart } = this.props;
        if (cart.line_items.length) {
            return commerce.checkout.generateToken(cart.id, { type: 'cart' })
                .then((checkout) => {
                    this.setState({
                        checkoutToken: checkout
                    })
                }).then(() => {
                    this.fetchShippingCountries(this.state.checkoutToken.id)
                }).catch((error) => {
                    console.log('There was an error in generating a token', error);
                });
        }
    };



    /**
     * Fetches a list of countries available to ship to checkout token
     * https://commercejs.com/docs/sdk/checkout#list-available-shipping-countries
     *
     * @param {string} checkoutTokenId
     */
    fetchShippingCountries(checkoutTokenId) {
        console.log(checkoutTokenId);
        console.log('rodofoloooo')
        commerce.services.localeListShippingCountries(checkoutTokenId)
            .then((countries) => {
                this.setState({
                    shippingCountries: countries.countries,
                })
            }).catch((error) => {
                console.log('There was an error fetching a list of shipping countries', error);
            });
    };

    /**
     * Fetches the subdivisions (provinces/states) for a country
     * https://commercejs.com/docs/sdk/checkout#list-all-subdivisions-for-a-country
     *
     * @param {string} countryCode
     */
    fetchSubdivisions(countryCode) {
        commerce.services.localeListSubdivisions(countryCode).then((subdivisions) => {
            this.setState({
                shippingSubdivisions: subdivisions.subdivisions,
            })
        }).catch((error) => {
            console.log('There was an error fetching the subdivisions', error);
        });
    };

    /**
     * Fetches the available shipping methods for the current checkout
     * https://commercejs.com/docs/sdk/checkout#get-shipping-methods
     *
     * @param {string} checkoutTokenId
     * @param {string} country
     * @param {string} stateProvince
     */
    fetchShippingOptions(checkoutTokenId, country, stateProvince = null) {
        commerce.checkout.getShippingOptions(checkoutTokenId,
            {
                country: country,
                region: stateProvince
            }).then((options) => {
                // Pre-select the first available method
                const shippingOption = options[0] || null;
                this.setState({
                    shippingOption: shippingOption,
                    shippingOptions: options
                })
            }).catch((error) => {
                console.log('There was an error fetching the shipping methods', error);
            });
    };

    handleFormChanges(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    handleShippingCountryChange(e) {
        console.log(e.target.value)
        const currentValue = e.target.value;
        this.fetchSubdivisions(currentValue);
    };

    handleSubdivisionChange(e) {
        const currentValue = e.target.value;
        this.fetchShippingOptions(this.state.checkoutToken.id, this.state.shippingCountry, currentValue)
    }

    handleCaptureCheckout(e) {
        const { cart } = this.props;
        e.preventDefault();
        const orderData = {
            line_items: this.sanitizedLineItems(cart.line_items),
            customer: {
                firstname: this.state.firstName,
                lastname: this.state.lastName,
                email: this.state.email
            },
            shipping: {
                name: this.state.shippingName,
                street: this.state.shippingStreet,
                town_city: this.state.shippingCity,
                county_state: this.state.shippingStateProvince,
                postal_zip_code: this.state.shippingPostalZipCode,
                country: this.state.shippingCountry,
            },
            fulfillment: {
                shipping_method: this.state.shippingOption.id
            },
            payment: {
                gateway: "test_gateway",
                card: {
                    number: this.state.cardNum,
                    expiry_month: this.state.expMonth,
                    expiry_year: this.state.expYear,
                    cvc: this.state.ccv,
                    postal_zip_code: this.state.shippingPostalZipCode
                }
            }
        };
        this.props.onCaptureCheckout(this.state.checkoutToken.id, orderData);
        this.props.history.push('/confirmation');
    };
    renderCheckoutForm() {
        const { shippingCountries, shippingSubdivisions, shippingOptions } = this.state;


        return (
            <div className='col-lg-10 col-xl-9 mx-auto mb-5'>
                <form className="checkout__form" onChange={this.handleFormChanges}>

                    <div className='row'>
                        <h4 className="checkout__subheading">Customer information</h4>
                        <div className="col-md-4 form-floating mb-3">
                            <input className="form-control" id="floatingInputUsername" type="text" onChange={this.handleFormChanges} value={this.state.firstName} name="firstName" placeholder="Enter your first name" required />
                            <label htmlFor="firstName">First name</label>
                        </div>
                        <div className="col-md-4 form-floating mb-3">
                            <input className="form-control" id="floatingInputUsername" type="text" onChange={this.handleFormChanges} value={this.state.lastName} name="lastName" placeholder="Enter your last name" required />
                            <label htmlFor="lastName">Last name</label>
                        </div>
                        <div className="col-md-4 form-floating mb-3">
                            <input className="form-control" id="floatingInputUsername" type="text" onChange={this.handleFormChanges} value={this.state.email} name="email" placeholder="Enter your email" required />
                            <label htmlFor="email">Email</label>
                        </div>
                    </div>
                    <div className='row'>
                        <h4 className="checkout__subheading">Shipping details</h4>
                        <div className="col-md-6 form-floating mb-3">
                            <input className="form-control" id="floatingInputUsername" type="text" onChange={this.handleFormChanges} value={this.state.shippingName} name="shippingName" placeholder="Enter your full name" required />
                            <label htmlFor="shippingName">Full name</label>
                        </div>
                        <div className="col-md-6 form-floating mb-3">
                            <input className="form-control" id="floatingInputUsername" type="text" onChange={this.handleFormChanges} value={this.state.shippingStreet} name="shippingStreet" placeholder="Enter your street address" required />
                            <label htmlFor="shippingStreet">Street address</label>
                        </div>
                        <div className="col-md-6 form-floating mb-3">
                            <input className="form-control" id="floatingInputUsername" type="text" onChange={this.handleFormChanges} value={this.state.shippingCity} name="shippingCity" placeholder="Enter your city" required />
                            <label htmlFor="shippingCity">City</label>
                        </div>
                        <div className="col-md-6 form-floating mb-3">
                            <input className="form-control" id="floatingInputUsername" type="text" onChange={this.handleFormChanges} value={this.state.shippingPostalZipCode} name="shippingPostalZipCode" placeholder="Enter your postal/zip code" required />
                            <label htmlFor="shippingPostalZipCode">Postal/Zip code</label>
                        </div>

                        <div className="col-md-6 form-floating mb-3">
                            <select
                                value={this.state.shippingCountry}
                                name="shippingCountry"
                                onChange={this.handleShippingCountryChange}
                                className="form-select"

                            >
                                <option disabled>Country</option>

                                {
                                    Object.keys(shippingCountries).map((index) => {
                                        return (
                                            <option value={index} key={index}>{shippingCountries[index]}</option>
                                        );
                                    })
                                };
                            </select>
                        </div>
                        <div className='col-md-6 form-floating mb-3'>
                            <select
                                value={this.state.shippingStateProvince}
                                name="shippingStateProvince"
                                onChange={this.handleSubdivisionChange}
                                className="form-select"
                                aria-label="Default select example"
                            >
                                <option className="checkout__option" value>State/province</option>
                                {
                                    Object.keys(shippingSubdivisions).map((index) => {
                                        return (
                                            <option value={index} key={index}>{shippingSubdivisions[index]}</option>
                                        );
                                    })
                                };

                            </select>
                        </div>
                        <div className='col-md-6 form-floating mb-3'>
                            <select
                                value={this.state.shippingOption.id}
                                name="shippingOption"
                                onChange={this.handleFormChanges}
                                className="form-select"
                            >
                                <option className="checkout__select-option" disabled>Select a shipping method</option>

                                {
                                    shippingOptions.map((method, index) => {
                                        return (
                                            <option className="checkout__select-option" value={method.id} key={index}>{`${method.description} - $${method.price.formatted_with_code}`}</option>
                                        );
                                    })
                                };
                            </select>
                        </div>
                    </div>
                    <div className='row'>
                        <h4 className="checkout__subheading">Payment information</h4>

                        <div className="col-md-6 form-floating mb-3">
                            <input className="form-control" id="floatingInputUsername" type="text" onChange={this.handleFormChanges} value={this.state.cardNum} name="cardNum" placeholder="Enter your card number" required />
                            <label htmlFor="cardNum">Credit card number</label>
                        </div>
                        <div className="col-md-6 form-floating mb-3">
                            <input className="form-control" id="floatingInputUsername" type="text" onChange={this.handleFormChanges} value={this.state.expMonth} name="expMonth" placeholder="Card expiry month" required />
                            <label htmlFor="expMonth">Expiry month</label>
                        </div>
                        <div className="col-md-6 form-floating mb-3">
                            <input className="form-control" id="floatingInputUsername" type="text" onChange={this.handleFormChanges} value={this.state.expYear} name="expYear" placeholder="Card expiry year" required />
                            <label htmlFor="expYear">Credit card number</label>
                        </div>
                        <div className="col-md-6 form-floating mb-3">
                            <input className="form-control" id="floatingInputUsername" type="text" onChange={this.handleFormChanges} value={this.state.ccv} name="ccv" placeholder="CCV (3 digits)" required />
                            <label htmlFor="ccv">Credit card number</label>
                        </div>
                    </div>
                    <div className='row d-flex justify-content-center mx-2'>
                        <Link
                            className="col-4 btn btn-outline-dark checkout__btn-confirm mx-1"
                            type="button"
                            to="/"
                        >
                            <span><i className="fa-solid fa-turn-down-left"></i>Back to home</span>
                        </Link>
                        <button onClick={this.handleCaptureCheckout} className="col-4 btn btn-outline-dark checkout__btn-confirm mx-1">Confirm order</button>
                    </div>
                </form>
            </div>
        );
    };

    renderCheckoutSummary() {
        const { cart } = this.props;

        return (
            <>
                <div className="checkout_list">
                    <h4 className='checkout__heading'>Order summary</h4>
                    {/*console.log(cart.line_items)*/}
                    {cart.line_items.map((lineItem) => (
                        <div key={lineItem.id} className="checkout-item d-flex flex-row align-items-center justify-content-between">
                            <img className="img-fluid rounded-3" src={lineItem.media.source} alt={lineItem.name} style={{ width: "8rem" }} />
                            <p className="checkout__summary-name">{lineItem.quantity} x {lineItem.name}</p>
                            <p className="checkout__summary-value">{lineItem.line_total.formatted_with_symbol}</p>

                        </div>

                    ))}
                    <div className="checkout__summary-total">
                        <p className="checkout__summary-price">
                            <span>Subtotal:</span>
                            {cart.subtotal.formatted_with_symbol}
                        </p>
                    </div>
                </div>
            </>
        )
    }

    render() {
        return (
            <div className="container-fluid checkout">
                <h2 className="checkout__heading">
                    Checkout
                </h2>
                <div className="row">
                    <div className='col-sm-4 col-md-6 col-lg-9'>
                        {this.renderCheckoutForm()}
                    </div>
                    <div className='col-sm-4 col-md-6 col-lg-3'>
                        {this.renderCheckoutSummary()}
                    </div>
                </div>
            </div>
        );
    };
};

export default Checkout;

Checkout.propTypes = {
    cart: PropTypes.object,
    history: PropTypes.object,
    onCaptureCheckout: () => { },
};
