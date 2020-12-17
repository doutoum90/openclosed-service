import moment from "moment";
import express from "express";

const axios = require("axios");
const BASE_URL = `http://localhost:8080/`;

const app = express();
const port = 9001;

app.get("/available", async (req, res) => {
  try {
    var startDate: any = req.query.startDate;
    var endDate: any = req.query.endDate;
    var resourceId: any = req.query.resourceId;
    if (
      !moment(startDate, "YYYY-MM-DD HH:mm", true).isValid() ||
      !moment(endDate, "YYYY-MM-DD HH:mm", true).isValid()
    ) {
      res
        .status(400)
        .json({ error: "wrong format for param startDate or endDate" });
      return;
    }
    if (resourceId != 1337) {
      res.status(404).json({ error: "resource not found" });
      return;
    }
    const reservations = await axios.get(
      `${BASE_URL}reservations?date=${moment(startDate).format(
        "YYYY-MM-DD"
      )}&resourceId=${resourceId}`
    );

    const timetables = await axios.get(
      `${BASE_URL}timetables?date=${moment(startDate).format(
        "YYYY-MM-DD"
      )}&resourceId=${resourceId}`
    );
    // check
    // if open
    // AND In timetable
    // AND not in reservation
    if (
      timetables["data"]["open"] &&
      checkIfInTimeTable(
        timetables["data"]["timetables"],
        startDate,
        endDate
      ) &&
      checkIfNotInReservation(
        reservations["data"]["reservations"],
        startDate,
        endDate
      )
    ) {
      res.json({ available: true });
    } else {
      res.json({ available: false });
    }
  } catch (error) {
    console.log("test1");
    res.status(400).json({ error: "unknown error occured" });
  }
});
/**
 * check if an interval of time is not in reservation array
 * @param reservations
 * @param startDate
 * @param endDate
 */
function checkIfNotInReservation(
  reservations: any[],
  startDate: any,
  endDate: any
) {
  return (
    reservations.filter((el: any) =>
      checkIfNotInInterval(
        startDate,
        endDate,
        el.reservationStart,
        el.reservationEnd
      )
    ).length > 0
  );
}

/**
 * check if an interval of time is outside another one
 * @param startDate
 * @param endDate
 * @param rsStart
 * @param rsEnd
 */
function checkIfNotInInterval(
  startDate: any,
  endDate: any,
  rsStart: any,
  rsEnd: any
) {
  return (
    (moment(startDate).isBefore(rsStart) && moment(endDate).isBefore(rsEnd)) ||
    (moment(startDate).isAfter(rsStart) && moment(endDate).isAfter(rsEnd))
  );
}

/**
 * check if interval is in timetable
 * @param timeTable
 * @param start
 * @param end
 */
function checkIfInTimeTable(timeTable: any[], start: any, end: any) {
  return (
    timeTable.find((el: any) => {
      return (
        moment(start).isBetween(el.opening, el.closing) &&
        moment(end).isBetween(el.opening, el.closing)
      );
    }) != null
  );
}

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
