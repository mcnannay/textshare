import express from "express";
import xss from "xss";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// In-memory pad storage
const pads = {};
function newPad(title = "Pad 1") {
  const id = crypto.randomBytes(4).toString("hex");
  pads[id] = { id, title, text: "" };
  return pads[id];
}
if (Object.keys(pads).length === 0) newPad("Pad 1");

// REST API
app.get("/pads", (req, res) => {
  res.json(Object.values(pads));
});

app.get("/pad/:id", (req, res) => {
  const pad = pads[req.params.id];
  if (!pad) return res.status(404).send("Not found");
  res.json({ id: pad.id, text: pad.text });
});

app.post("/pad/:id", (req, res) => {
  const pad = pads[req.params.id];
  if (!pad) return res.status(404).send("Not found");
  pad.text = xss(String(req.body.text)).slice(0, 20000);
  res.sendStatus(200);
});

app.post("/pad", (req, res) => {
  const title = xss(String(req.body.title || "New Pad")).slice(0, 100);
  const pad = newPad(title);
  res.json({ id: pad.id });
});

app.post("/pad/:id/rename", (req, res) => {
  const pad = pads[req.params.id];
  if (!pad) return res.status(404).send("Not found");
  const title = xss(String(req.body.title || pad.title)).slice(0, 100);
  pad.title = title;
  res.sendStatus(200);
});

app.post("/pad/:id/clear", (req, res) => {
  const pad = pads[req.params.id];
  if (!pad) return res.status(404).send("Not found");
  pad.text = "";
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("TextShare polling server on http://0.0.0.0:" + PORT));
