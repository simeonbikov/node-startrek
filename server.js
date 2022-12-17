

// Using the startrek.json data file:

// I want an API with endpoints that:

// --- list all character information.
//     Using query strings, I want to be able to:

//     - filter by name, rank, series and ship
//     - \*\* (slightly harder task) filter by a minimum rank (rank order: Ensign < Lieutenant < Lieutenant Commander < Commander < Captain)

// --- show single character details

// --- list all ships

// --- show single ship details: all crew who serve on that ship

// --- list all series

// --- show single series details: all crew who featured on that series.



const express = require("express");
const app = express();
const port = 3000;
const data = require("./startrek.js");

app.get("/characters", (req, res) => {
  let rankOrder = [
    "Ensign",
    "Lieutenant",
    "Lieutenant Commander",
    "Commander",
    "Captain",
  ];
  let characters = data;
  if (req.query.name) {
    characters = characters.filter((char) => char.name === req.query.name);
  }
  if (req.query.rank) {
    characters = characters.filter((char) => char.rank === req.query.rank);
  }
  if (req.query.ship) {
    characters = characters.filter((char) => char.ship === req.query.ship);
  }
  if (req.query.series) {
    characters = characters.filter((char) => char.series === req.query.series);
  }

  if (req.query.minrank) {
    if (rankOrder.indexOf(req.query.minrank) < 0) {
      characters = [];
    } else {
      characters = characters.filter(
        (char) =>
          rankOrder.indexOf(char.rank) >= rankOrder.indexOf(req.query.minrank)
      );
    }
  }
  res.send(characters);
});

app.get("/characters/:name", (req, res) => {
  let charName = req.params.name;
  let charDetails = data.find((char) => char.name === charName);
  res.send(charDetails);
});

app.get("/ships", (req, res) => {
  let ships = data.map((char) => char.ship);
  let uniqueShips = [...new Set(ships)];
  res.send(uniqueShips);
});

app.get("/ships/:ship", (req, res) => {
  let shipName = req.params.ship;
  let ships = data
    .filter((char) => char.ship === shipName)
    .map((char) => char.name);

  res.send(ships);
});

app.get("/series", (req, res) => {
  let series = data.map((char) => char.series);
  let uniqueSeries = [...new Set(series)];
  res.send(uniqueSeries);
});

app.get("/series/:series", (req, res) => {
  let seriesName = req.params.series;
  let series = data
    .filter((char) => char.series === seriesName)
    .map((char) => char.name);
  res.send(series);
});

app.listen(port, () => {
  console.log(`listening on port : ${port}`);
});