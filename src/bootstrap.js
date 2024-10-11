import { AppError } from '../src/utils/classError.js'
import { globalErrorHandler } from '../src/utils/globalErrorHandling.js'
import * as RR from "../src/modules/index.routes.js"
import connectiondb from "../db/connectiondb.js"
import cors from "cors"
// Init app function to create Express server and connect to MongoDB database 

export const initApp = (app, express) => {
  app.use(cors())
  app.use(express.json());

  //routes
  app.get("/", (req, res, next) => {
    res.status(200).json({ message: "Welcome to our E-commerce " });
  });

  app.use("/users", RR.userRouter);
  app.use("/products", RR.productRouter);
  app.use("/coupon", RR.couponRouter);
  app.use("/cart", RR.cartRouter);
  app.use("/payment", RR.paymentRouter);
  app.use("/analytics", RR.analyticsRouter);

  connectiondb();




  //handle invalid urls
  app.use("*", (req, res, next) => {
    return next(new AppError(`invalid url ${req.originalUrl}`, 404));
  });

  // global error handling
  app.use(globalErrorHandler);


};
