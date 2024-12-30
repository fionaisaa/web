import express from "express";
import cors from "cors";
import "dotenv/config";
import songRouter from "./src/routes/songRoute.js";
import connectDB from "./src/config/mongodb.js";
import connectCloudinary from "./src/config/cloudinary.js";
import albumRouter from "./src/routes/albumRoute.js";
import userRoute from "./src/routes/userRoute.js";
import loginRouter from "./src/routes/login.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path"
//import authRoutes from "./src/routes/authRoutes.js"; //prejvideos

// Correct the path to swagger.json by using path.resolve
const swaggerPath = path.resolve("../swagger.json"); 
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));

//app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//middlewares
app.use(express.json());
app.use(cors());

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//initializing routes
app.use("/api/song", songRouter);
app.use("/api/album", albumRouter);
app.use("/api/users", userRoute); // Mount the routes with '/api' prefix
app.use("/auth", loginRouter);
//app.use("/api/auth",authRoutes); // prej vidoes

app.get("/", (req, res) => res.send("API working"));

app.listen(port, () => console.log(`Server started on ${port}`));
