import moment from "moment";
import express from "express";

const axios = require("axios");
const BASE_URL = `https://localhost/`;

const app = express();
const port = 9001;

app.get("/available", (req, res) => {
  var date : any = moment().toISOString();
  var resourceId : any = req.query.resourceId;
    axios.get(`${BASE_URL}/reservations?date=${date}&resourceId=${resourceId}`)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    res.json({ "reservations": null });
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});