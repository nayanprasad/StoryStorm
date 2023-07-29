const express = require("express");
const connectMongo = require("./db");
const cors = require("cors")

const app = express();

connectMongo();

app.use(cors());
app.use(express.json()); // to use req.body

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/post", require("./routes/post"));


const PORT = 5000;
app.listen(PORT, () => {
  console.log("server started in " + PORT);
});
