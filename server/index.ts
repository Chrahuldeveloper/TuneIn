const express = require("express");
const {db} = require("./dbconfig/connectDb");
const app = express();
const PORT = 3001;
const cors = require("cors");

app.use(cors());
app.use(express.json());

const getusers = async () => {
  try {
    const res = await db.query("SELECT NOW()");
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};


app.listen(PORT, () => {
  console.log("server connected");
  getusers();
});
