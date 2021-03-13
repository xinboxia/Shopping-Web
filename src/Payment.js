import React, {useEffect, useState} from 'react'
import CheckoutProduct from './CheckoutProduct';
import './Payment.css'
import { useStateValue } from './StateProvider'
import {Link, useHistory} from 'react-router-dom'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './reducer';
import axios from './axios';


function Payment() {

    const [{basket, user}, dispatch] = useStateValue();

    const history = useHistory();
    const stripe = useStripe();
    const elements = useElements();

    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState(true);

    useEffect(() => {
        
        const getClientSecret = async () => {
            const response = await axios({
                method: 'post',
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`
            });
            setClientSecret(response.data.clientSecret)
        }

        getClientSecret();
    }, [basket])

    console.log('The secret is >>>>>', clientSecret)

    const handleSubmit = async (event) => {
        // do stripe stuff here
        event.preventDefault();
        setProcessing(true);
        
        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(({paymentIntent}) => {
            //payment intent = payment confirmation
            setSucceeded(true);
            setError(null)
            setProcessing(false)

            history.replace('/orders')
        })

    }

    const handleChange = event => {
        // handle error related to card 
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    }

    return (
        <div className="payment">
            <div className="payment_container">
                <h1>
                    Checkout (<Link to="/checkout">{basket?.length} items</Link>)
                </h1>

                {/* address */}
                <div className="payment_section">

                    <div className="payment_title">
                        <h3>delivery address</h3>
                    </div>

                    <div className="payment_address">
                        <p>{user?.email}</p>
                        <p>1201 S. Hope St.</p>
                        <p>Los Angeles, CA</p>
                    </div>

                </div>

                {/* review items */}
                <div className="payment_section">
                    
                    <div className="payment_title">
                        <h3>Review items for delivery</h3>
                    </div>

                    <div className="payment_items">
                        {basket.map(item => (
                            <CheckoutProduct 
                                id={item.id}
                                title={item.title}
                                image={item.image}
                                price={item.price}
                                rating={item.rating}
                            />
                        ))}
                    </div>

                </div>


                {/* actual payment */}
                <div className="payment_section">
                    <div className="payment_title">
                        <h3>Payment Method</h3>
                    </div>
                    <div className="payment_details">
                       
                            {/* stripe magic goes here */}
                            <form onSubmit={handleSubmit}>
                                <CardElement onChange={handleChange}/>

                                <div className="payment_priceContainer">
                                    <CurrencyFormat
                                        renderText={(value) => (
                                            <h3>Order Total: {value}</h3>   
                                        )}
                                        decimalScale={2}
                                        value={getBasketTotal(basket)}
                                        displayType={"text"}
                                        thousandSeperator={true}
                                        prefix={"$"}
                                    />
                                    <button disabled={processing || disabled || succeeded}>
                                        <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                                    </button>
                                </div>

                                        {error && <div>{error}</div>}
                            </form>
                    </div>
                </div>


            </div>
            
        </div>
    )
}

export default Payment
