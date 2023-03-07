const socket = io();
let userName;
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message_area");
let userArea = document.querySelector(".user_area");
do {
  userName = prompt("Please enter your name: ");
  newUser();
} while (!userName);

function newUser() {
  if (userName) {
    let notification = {
      user: userName,
      message: "joined!!",
    };
    appendNotification(notification, "user_notification");
    appendUser(userName);
    textarea.value = "";
    scrollToBottom();
    // Send to server
    socket.emit("user", notification);
  }
}
textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
  }
});

function sendMessage(message) {
  let msg = {
    user: userName,
    message: message.trim(),
  };
  // Append
  appendMessage(msg, "outgoing");
  textarea.value = "";
  scrollToBottom();

  // Send to server
  socket.emit("message", msg);
}

function appendUser(userName) {
  let div = document.createElement("div");
  let markup = `
        <h4>${userName}</h4>
    `;
  div.innerHTML = markup;
  userArea.appendChild(div);
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");

  let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `;
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

function appendNotification(notification, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className);

  let markup = `
          <p>${notification.user} ${notification.message}</p>
      `;
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
  //   let user= `
  //   <h4>${notification.user}</h4>
  // `;
  // let div = document.createElement("div");
  // div.innerHTML=div;
  // userArea.appendChild(div);
}
// Recieve messages
socket.on("message", (msg) => {
  appendMessage(msg, "incoming");
  scrollToBottom();
});

socket.on("user", (notification) => {
  appendNotification(notification, "user_notification");
  scrollToBottom();
});

socket.on("userDisconnect", () => {
  let notification = {
    user: userName,
    message: "left!!",
  };
  appendNotification(notification, "user_notification");
  scrollToBottom();
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}


