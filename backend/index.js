const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const userRoutes = require("./routes/userRoutes")

const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors({ origin: true }));

app.use("/api/auth", userRoutes)


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Database was connected successfully")
}).catch((err) => {
    console.log(err.message);
})


app.post("/authenticate", async (req, res) => {
    const { username } = req.body;
    return res.json({ username: username, secret: "sha256..." });
});

app.listen(() => {
    console.log(`server listening at port ${process.env.PORT}`)
});