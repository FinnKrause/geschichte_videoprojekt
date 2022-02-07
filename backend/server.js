const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser")

app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST"]
}));
app.use(bodyParser.json({limit: '950mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '950mb', extended: true}));
app.use(bodyParser.text({limit: '950mb', extended: true}));

const getPerson = (req) => req.params.person ? req.params.person.replace(":", "") : "No Person received!";

app.use(express.static("public"));

const path = "/NAS/Finn/Schule/10C/Geschichte/Film/DokumenteForDownload/"
const allowed = ["alena" , "arda" , "carla" , "christian" , "christoph" , "dulce" , "elena" , "finn" , "marthinus" , "hendrik" , "leopold" , "lucas" , "marleen" , "marlene" , "moritz" , "sanna" , "sophia", "florian", "app"]

const g = (dateiname) => path+dateiname
const l = (filename, person) => {
  console.log("File accessed: " + filename + " by " + person);
}

app.get("/getTableData/:person", (req, res) => {
  if (allowed.includes(req.params.person.toLowerCase().replace(":", ""))) {
    const person = getPerson(req);
    console.log("Got the table data by: " + person)
    res.json(JSON.parse(fs.readFileSync("./table.json", "utf-8")))
  }
  else res.json({error: true})
})

app.post("/createblogpost/:person", (req, res) => {
  const person = getPerson(req);
  if (!allowed.includes(req.params.person.toLowerCase().replace(":", ""))) return;
  const oldData = JSON.parse(fs.readFileSync("./blogposts.json", "utf-8"))
  console.log("Added new Blog Post by "+person)

  oldData.push(req.body);
  fs.writeFileSync("./blogposts.json", JSON.stringify(oldData));
  res.send("DONE")
})

app.post("/setTableData/:person", (req, res) => {
  const person = getPerson(req);
  if (allowed.includes(req.params.person.replace(":", ""))) {
    fs.writeFileSync("./table.json", JSON.stringify(req.body, null, 2));
    console.log("["+person+"] updated the table!")
    res.send("DONE")
    return;
  }
})

app.get("/getblogposts/:joke", (req, res) => {
  if (req.params.joke === "true") res.json(JSON.parse(fs.readFileSync("./blogposts_byChristoph.json", "utf-8")));
  else res.json(JSON.parse(fs.readFileSync("./blogposts.json", "utf-8")));
})

app.get("/:fileName/:person/:DiggaIchWill", (req, res) => {
  const fileName = req.params.fileName.replace(":", "") || "No filename given!";
  const person = getPerson(req);
  switch(fileName) {
    case "abhaken": res.sendFile(g("Abhaken.pdf")); break;
    case "eltern": res.sendFile(g("Einverstaendnis_Mitwirkung_Foto_Film_Umbruchszeiten.pdf")); l(fileName,person); break;
    case "lehrer": res.sendFile(g("Einverständniserklärung-der-Eltern_gesetzlichen-Vertretung.pdf"));l(fileName,person); break;
    case "brd": res.sendFile(g("Fragenkatalog - BRD.pdf"));l(fileName,person); break;
    case "ddr": res.sendFile(g("Fragenkatalog - DDR.pdf"));l(fileName,person); break;
    case "full": res.sendFile(g("Fragenkatalog.pdf"));l(fileName,person); break;
    case "tipps": res.sendFile(g("Tipps_Zeitzeugengespräche_Umbruchszeiten.pdf"));l(fileName,person); break;
    case "checkliste": res.sendFile(g("Interview Checkliste.pdf"));l(fileName,person); break;
    default: res.send("Digga du Huan versuch ned meine Seite zu hacken! Piss dich!");l("Hacker",person); break;
  }
})

app.listen(5009, console.log("Geschichte Running"));
  