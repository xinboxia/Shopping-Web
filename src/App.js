import React, {useEffect} from 'react';
import './App.css';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Checkout from './Checkout';
import Payment from './Payment';
import { auth } from './firebase';
import { useStateValue } from './StateProvider';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const promise = loadStripe("pk_test_51Hm7imLMrYEbunsAhtpFcYyoczHnOWhuun4MK5AH7jon1yiSpj7KC8TUTXlFtEI1aASXOplDzM91r3a8xNJek65600QoYQywrO");

function App() {

  const [{}, dispatch] = useStateValue();
  // like a dynamic if statement
  
  useEffect(() => {
    // will only run once when the app component loads...

    auth.onAuthStateChanged((authUser) => {
      console.log("THE USER IS >>> ", authUser);

      if (authUser) {
        // the user just logged in / the user was logged in

        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        // the user is logged out
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);

  return (
    // BEM
    // make sure home page is at the bottom, important
    <Router>
      <div className="App">
        <Switch>
        <Route path="/login">
            <Login />
          </Route>
          
          <Route path="/checkout">
            <Header />
            <Checkout />
          </Route>

          <Route path="/payment">
            <Header />
            <Elements stripe={promise}>
              <Payment />
            </Elements>
          </Route>

          <Route path="/">
            <Header />
            <Home />
          </Route>

        </Switch>
      </div>
    </Router>
  );
}

export default App;
