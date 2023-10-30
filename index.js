import * as dotenv from 'dotenv' 
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

//routes
import userRoutes from './routes/userRoutes.js'
import blogRoutes from './routes/blogRoutes.js'

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("./uploads"));  //upload folder should in the root directory
app.use(function (err, req, res, next) {

  console.log(err);

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //logger.error(err);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Authorization,X-ACCESS_TOKEN,Access-Control-Allow-Headers, Origin,Accept,X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");


  res.status(err.status || 500);
  res.send('Invalid API Request ');
});
const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));

// Connect to MongoDB
main().catch((err) => console.error(err));

async function main() {
  try {
    await mongoose.connect(process.env.MONGOOSE_CONNECTION_LINK, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

//routes
app.get('/',(req,res)=>res.send('Hello World from my blogs backend. ' ))
app.use("/user",userRoutes);
app.use("/blog",blogRoutes);

//listening port
app.listen(3009, () => {
    console.log("server started on port :3009");
  });