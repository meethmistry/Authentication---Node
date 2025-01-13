const express = require("express");
const app = express();
const port = process.env.port || 3000;
const bodyParser = require("body-parser");
const connect = require("./connection");
const authRouter = require("./routes/route");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/auth", authRouter);

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server Connected At: http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("Server Connection Error: ", error);
  });
