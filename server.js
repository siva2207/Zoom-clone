const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");
// setting up owe express server, we are rendering owr views from 'ejs'
app.set("view engine", "ejs");
/* now we are going to setup our static folder,
So now inside public folder im going to put all our Javascript and Css.
*/
app.use(express.static("public"));
// Here we are going to get route here.
app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});
/* Here we are going to create a room and redirect the user to that room */
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});
// Declaring the custom server PORT number
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
