import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./Database/Config.js"
import userRouter from "./Router/userRouter.js"
import songRouter from "./Router/songRouter.js"
import adminRouter from './Router/adminRouter.js'


dotenv.config()

const app = express()

app.use(cors(
    {
        origin: "*",
        credentials: true,
      }
))

app.use(express.json())

connectDB();

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });

  app.get("/", (req, res) => {
    res.send("server is Working");
  });

  app.use('/api',userRouter);
  app.use('/api/songs',songRouter)
  app.use('/api/admin',adminRouter)
  
  const PORT = process.env.PORT || 5000;

  app.listen(process.env.PORT, () => {
 
    console.log(`Server is running on port ${PORT}`);
  });
  