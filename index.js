const express = require("express");
const app = express();
const port = process.env.port || 3000;
const bodyParser = require("body-parser");
const connect = require("./connection");
const authRouter = require("./routes/authRoute");
const chatRouter = require("./routes/chatRoute");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/auth", authRouter);
app.use("/chats", chatRouter);



connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server Connected At: http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("Server Connection Error: ", error);
  });
