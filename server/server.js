const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const app = express();
app.use(cors());
app.use(bodyParser.json());

const ARTISTS = [
  {
    id: 1,
    companyName: "Cooperativa de Quesos 'Las Cabras'",
    contactName: "Antonio del Valle Saavedra",
    contactTitle: "Antonio del Valle Saavedra",
  },
  {
    id: 2,
    companyName: "Mayumi's",
    contactName: "Mayumi Ohno",
    contactTitle: "Marketing Representative",
  },
  {
    id: 3,
    companyName: "Pavlova Ltd.",
    contactName: "Ian Devling",
    contactTitle: "Marketing Manager",
  },
];
app.get("/api", (req, res) => {
  res.send("welcome to out API!");
});

//GET ALL ARTISTS
app.get("/api/suppliers", (req, res) => {
  const { companyName } = req.query;
  if (!companyName) {
    res.status(200).send(ARTISTS);
  } else {
    res
      .status(200)
      .send(
        ARTISTS.filter((x) =>
          x.companyName
            .toLowerCase()
            .trim()
            .includes(companyName.toLowerCase().trim())
        )
      );
  }
});
//GET ARTIST BY ID
app.get("/api/suppliers/:id", (req, res) => {
  const { id } = req.params;
  res.status(200).send(ARTISTS.find((x) => x.id == id));
});
//DELETE ARTIST
app.delete("/api/suppliers/:id", (req, res) => {
  const id = req.params.id;
  //delete
  const deleteArtist = ARTISTS.find((x) => x.id == id);
  const idx = ARTISTS.indexOf(deleteArtist);
  ARTISTS.splice(idx, 1);
  res.status(203).send({
    message: `${deleteArtist.companyName} deleted successfully!`,
  });
});
//POST ARTIST
app.post("/api/suppliers", (req, res) => {
  const { companyName, contactName, contactTitle } = req.body;
  const newArtist = {
    id: crypto.randomUUID(),
    companyName: companyName,
    contactName: contactName,
    contactTitle: contactTitle,
  };
  ARTISTS.push(newArtist);

  res.status(201).send({
    message: `${newArtist.companyName} posted successfully`,
    payload: newArtist,
  });
});
//EDIT ARTIST
app.put("/api/suppliers/:id", (req, res) => {
  const id = req.params.id;
  const updatingArtist = ARTISTS.find((x) => x.id == id);
  const { companyName, contactName, contactTitle } = req.body;
  if (companyName) {
    updatingArtist.companyName = companyName;
  }
  if (contactName) {
    updatingArtist.contactName = contactName;
  }
  if (contactTitle) {
    updatingArtist.contactTitle = contactTitle;
  }
  res.status(200).send(`${updatingArtist.companyName} updated successfully!`);
});

app.listen(8080, () => {
  console.log(`App running on PORT: 8080`);
});
