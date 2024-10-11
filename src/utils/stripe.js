import Stripe from "stripe";

// Set up Stripe
export const stripe = new Stripe("sk_test_51Q84YlP8jy5IF5EyoiX2NmDyjME92ONkplIjPwVh6drocn360EnfSw5jrxcfQ1KPRZhmiJuZRGaQtJ0VFIPGgkUI00L7Depe6G")

// // Example usage: Create a payment intent
// // const paymentIntent = await stripe.paymentIntents.create({
// // //   amount: 1099,
// // //   currency: "usd",
// // //   automatic_payment_methods: {
// // //     enabled: true,
// // //   },
// // // });
// import Stripe from 'stripe';

// // const stripeApiKey =process.env.STRIPE_SECRET_KEY;
// // export const stripe = new Stripe(stripeApiKey, {
// //   apiVersion: '2022-11-15',
// // });

// // Now you can use the Stripe object to make API requests
// // stripe.customers.list().then((customers) => {
// //   console.log(customers);
// // }).catch((err) => {
// //   console.error(err);
// // });
// import { loadStripe } from '@stripe/stripe-js';

// const stripeApiKey =process.env.STRIPE_SECRET_KEY;
// export  const stripe = await loadStripe(stripeApiKey);
