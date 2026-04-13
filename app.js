const artists = [
  { id: "gweong", name: "궝" },
  { id: "guilty", name: "길티" },
  { id: "gomono", name: "구모노" },
  { id: "joy", name: "조이" },
  { id: "jowoo", name: "조우" },
];

if (window.location.search.includes("reset")) {
  localStorage.clear();
}

let currentCharacter = localStorage.getItem("currentCharacter") || "gweong";

const STORAGE_KEY = "dear-chat-store-v1";

function loadStore() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

const chatStore = loadStore();

function saveStore() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chatStore));
  localStorage.setItem("currentCharacter", currentCharacter);
}

function addMessageToStore(characterId, text, type) {
  if (!chatStore[characterId]) {
    chatStore[characterId] = [];
  }

  chatStore[characterId].push({ text, type });
  saveStore();
}

function renderMessages() {
  const chat = document.getElementById("chat");
  chat.innerHTML = "";

  const messages = chatStore[currentCharacter] || [];

  messages.forEach((msg) => {
    const bubble = document.createElement("div");
    bubble.className = msg.type;
    bubble.innerText = msg.text;
    chat.appendChild(bubble);
  });

  chat.scrollTop = chat.scrollHeight;
}

function renderArtistList() {
  const artistList = document.getElementById("artistList");
  artistList.innerHTML = "";

  artists.forEach((artist) => {
    const button = document.createElement("button");
    button.className = "artist-item";
    button.dataset.id = artist.id;
    button.innerText = artist.name;

    if (artist.id === currentCharacter) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      currentCharacter = artist.id;
      document.getElementById("currentArtistName").innerText = artist.name;

      document.querySelectorAll(".artist-item").forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");
      saveStore();
      renderMessages();
    });

    artistList.appendChild(button);
  });

  const current = artists.find((a) => a.id === currentCharacter);
  document.getElementById("currentArtistName").innerText = current?.name || "궝";
}

async function send() {
  const input = document.getElementById("msg");
  const text = input.value.trim();

  if (!text) return;

  addMessageToStore(currentCharacter, text, "me");
  renderMessages();
  input.value = "";

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: text,
        characterId: currentCharacter,
      }),
    });

    const data = await response.json();

    if (data.reply) {
      addMessageToStore(currentCharacter, data.reply, "bot");
      renderMessages();
    }
  } catch (error) {
    addMessageToStore(currentCharacter, "네트워크 오류가 났어.", "bot");
    renderMessages();
  }
}

document.getElementById("sendBtn").addEventListener("click", send);
document.getElementById("msg").addEventListener("keydown", (e) => {
  if (e.key === "Enter") send();
});

renderArtistList();
renderMessages();
