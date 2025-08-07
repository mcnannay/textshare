import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import xss from "xss";
import crypto from "crypto";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(express.static("public"));

// In-memory pads: { id: { id, title, text } }
const pads = {};
function newPad(title = "Pad 1") {
  const id = crypto.randomBytes(4).toString("hex");
  pads[id] = { id, title, text: "" };
  return pads[id];
}
if (Object.keys(pads).length === 0) newPad("Pad 1");

io.on("connection", (socket) => {
  // initial state
  socket.emit("init", { pads: Object.values(pads) });

  socket.on("requestState", () => {
    socket.emit("init", { pads: Object.values(pads) });
  });

  socket.on("updateText", ({ id, text }) => {
    if (!pads[id]) return;
    const safe = xss(String(text)).slice(0, 20000);
    pads[id].text = safe;
    socket.broadcast.emit("textUpdated", { id, text: safe });
  });

  socket.on("createPad", (title) => {
    const safeTitle = xss(String(title || "New Pad")).slice(0, 100);
    const pad = newPad(safeTitle || "New Pad");
    io.emit("padsChanged", { pads: Object.values(pads), created: pad.id });
  });

  socket.on("renamePad", ({ id, title }) => {
    if (!pads[id]) return;
    const safeTitle = xss(String(title)).slice(0, 100);
    pads[id].title = safeTitle || pads[id].title;
    io.emit("padsChanged", { pads: Object.values(pads) });
  });

  socket.on("clearPad", (id) => {
    if (!pads[id]) return;
    pads[id].text = "";
    io.emit("textUpdated", { id, text: "" });
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`TextShare running on http://0.0.0.0:${PORT}`);
});
