import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import colors from "colors";

// app initialize
const app = express();
// environment variable
dotenv.config({ path: "./env/dotenv.env" });

// apply common middleware
app.use(cors());
app.use(express.json());
if (process.env.ENV === "development") {
    app.use(morgan("combined"));
}

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`.rainbow);
});
