const socket = io("/");
// Getting the reference to the videoGrid.
const videoGrid = document.getElementById("video-grid");
//Here we are assigning the peer server port.

const myPeer = new Peer(undefined, {
  host: "/",
  port: "8001",
  
});
const myVideo = document.createElement("video");
myVideo.muted = true;
const peers = {};
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);

    // We are able to receive calls using this function
    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    // Here we are telling that when the new user joins this room show the existing participants video.
    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

socket.on("user-disconnected", (userId) => {
  if (peers[userId]) peers[userId].close();
});

// After assigning the peer with get us a unique ID for each User. so we are getting that id going to use it.
myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

// We are able to make calls using this function
function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });
  peer[userId] = call;
}

// function declaration for that stream string.
function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
//  const PORT = process.env.PORT || 8001;
//  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

