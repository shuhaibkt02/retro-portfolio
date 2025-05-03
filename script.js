const terminal = document.querySelector(".terminal");
const minimizeBtn = document.querySelector(".minimize-btn");
const closeBtn = document.querySelector(".close-btn");
const terminalInput = document.getElementById("terminal-input");
const output = document.getElementById("output");

function adjustLayout() {
  const isMobile = window.innerWidth <= 768;
  document.body.classList.toggle("mobile", isMobile);
}

adjustLayout();
window.addEventListener("resize", adjustLayout);

const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const katakana =
  "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nums = "0123456789";
const binary = "01";

const alphabet = katakana + latin + nums + binary;

const fontSize = 16;
const columns = canvas.width / fontSize;

const rainDrops = [];

for (let x = 0; x < columns; x++) {
  rainDrops[x] = 1;
}

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0F0";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < rainDrops.length; i++) {
    const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

    if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      rainDrops[i] = 0;
    }
    rainDrops[i]++;
  }
}

setInterval(drawMatrix, 50);

minimizeBtn.addEventListener("click", () => {
  terminal.classList.toggle("minimized");
  if (terminal.classList.contains("minimized")) {
    minimizeBtn.textContent = "□";
  } else {
    minimizeBtn.textContent = "_";
  }
});

closeBtn.addEventListener("click", () => {
  terminal.classList.add("closed");
});

// Re-open terminal if closed
document.addEventListener("click", (e) => {
  if (
    terminal.classList.contains("closed") &&
    e.target.tagName.toLowerCase() !== "input"
  ) {
    terminal.classList.remove("closed");
  }
});

let commandHistory = [];
let historyIndex = -1;

terminalInput.addEventListener("keydown", (e) => {
  if (
    ![
      "Shift",
      "Control",
      "Alt",
      "CapsLock",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
      "PageUp",
      "PageDown",
    ].includes(e.key)
  ) {
    playKeySound();
  }

  if (e.key === "ArrowUp" && commandHistory.length > 0) {
    e.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      terminalInput.value =
        commandHistory[commandHistory.length - 1 - historyIndex];
    }
  } else if (e.key === "ArrowDown" && historyIndex > -1) {
    e.preventDefault();
    historyIndex--;
    if (historyIndex === -1) {
      terminalInput.value = "";
    } else {
      terminalInput.value =
        commandHistory[commandHistory.length - 1 - historyIndex];
    }
  } else if (e.key === "Enter") {
    const command = terminalInput.value.trim().toLowerCase();

    if (
      command &&
      (commandHistory.length === 0 ||
        command !== commandHistory[commandHistory.length - 1])
    ) {
      commandHistory.push(command);
      if (commandHistory.length > 50) {
        commandHistory.shift();
      }
    }

    historyIndex = -1;
    handleCommand(command);
    terminalInput.value = "";

    playEnterSound();
  }
});

function handleCommand(command) {
  appendOutput(`<span class="prompt">guest@matrix:~$</span> ${command}`);
  let validCommand = true;

  switch (command) {
    case "help":
      appendOutput(`
                        <p>Available commands:</p>
                        <ul>
                            <li><span class="command">about</span> - Display information about me</li>
                            <li><span class="command">skills</span> - List my technical skills</li>
                            <li><span class="command">projects</span> - Show my portfolio projects</li>
                            <li><span class="command">contact</span> - Display contact information</li>
                            <li><span class="command">clear</span> - Clear the terminal</li>
                            <li><span class="command">sound</span> - Toggle terminal sounds</li>
                        </ul>
                    `);
      break;
    case "about":
      appendOutput(`
                        <p>Hello, I'm a flutter developer with a passion for creating interactive, 
                        responsive, and visually appealing websites. With expertise in frontend and 
                        backend technologies, I strive to build efficient and user-friendly applications.</p>
                    `);
      break;
    case "skills":
      appendOutput(`
                        <p>Technical Skills:</p>
                        <ul>
                            <li>Languages: C, Kotlin, Dart, HTML, CSS, JavaScript, TypeScript, Python</li>
                            <li>Frameworks: React, Flutter, Node.js, Express</li>
                            <li>Tools: Git, Docker, Figma</li>
                            <li>Databases: MySQL, MongoDB, PostgreSQL</li>
                        </ul>
                    `);
      break;
    case "projects":
      appendOutput(`
                        <p>Featured Projects:</p>
                        <ul>
                            <li><span class="project">Location Tracker</span> – A plugin that tracks daily routes and distance for activity insights.</li>
                            <li><span class="project">YouTube Music Redesign</span> – A modern UI/UX overhaul of the existing YouTube Music app for better usability.</li>
                            <li><span class="project">Movie Explorer</span> – A movie app with search, list, and detailed view features built for browsing and discovery.</li>
                            <li><span class="project">LiveMap Tracker</span> – Visualizes user locations on Google Maps with live updates, markers, and polylines.</li>
                        </ul>
                        <p>Type <span class="command">project [name]</span> for more details.</p>
                    `);
      break;
    case "contact":
      appendOutput(`
    <p>Get in touch:</p>
    <ul>
      <li>Email: <a href="mailto:mail@shuhaibkt.xyz">mail@shuhaibkt.xyz</a></li>
      <li>GitHub: <a href="https://github.com/shuhaibkt02" target="_blank" rel="noopener noreferrer">github.com/shuhaibkt02</a></li>
      <li>LinkedIn: <a href="https://linkedin.com/in/shuhaibkt" target="_blank" rel="noopener noreferrer">linkedin.com/in/shuhaibkt</a></li>
      <li>Twitter: <a href="https://twitter.com/shuhaibkt5" target="_blank" rel="noopener noreferrer">@shuhaibkt5</a></li>
    </ul>
  `);
      break;

    case "clear":
      clearOutput();
      break;
    case "sound":
      isSoundEnabled = !isSoundEnabled;
      appendOutput(
        `<p>Terminal sounds ${isSoundEnabled ? "enabled" : "disabled"}.</p>`
      );
      break;
    default:
      if (command.startsWith("project ")) {
        const projectName = command.substring(8).trim().toLowerCase();
        showProjectDetails(projectName);
      } else if (command !== "") {
        appendOutput(
          `<p class="error">Command not found: ${command}. Type <span class="command">help</span> for available commands.</p>`
        );
        // Play error sound
        playErrorSound();
        validCommand = false;
      }
  }

  if (!audioContext && validCommand) {
    initAudio();
  }
}
function showProjectDetails(projectName) {
  const projects = {
    location: {
      title: "Location Tracker",
      description:
        "A plugin that tracks user location to show daily routes and distance traveled, providing activity insights.",
      tech: "Flutter, Dart, Riverpod, Geolocator",
      link: "https://github.com/shuhaibkt02/location_tracker",
    },
    youtube: {
      title: "YouTube Music Redesign",
      description:
        "A modern UI/UX redesign of the existing YouTube Music app for improved usability and cleaner design.",
      tech: "Flutter, Dart, Custom UI",
      link: "https://github.com/shuhaibkt02/Youtube_Music_Redesign",
    },
    movie: {
      title: "Movie Explorer",
      description:
        "A movie app with search, listing, and detail views for browsing and discovering movies.",
      tech: "Flutter, Dart, TMDB API",
      link: "https://github.com/shuhaibkt02/Movie_Explorer",
    },
    livemap: {
      title: "LiveMap Tracker",
      description:
        "A real-time location viewer showing user positions on Google Maps using markers, polylines, and live updates.",
      tech: "Flutter, Google Maps API, Stream, Riverpod",
      link: "https://github.com/shuhaibkt02/location_service",
    },
  };

  const project = Object.entries(projects).find(
    ([key]) => key.includes(projectName) || projectName.includes(key)
  );

  if (project) {
    const [_, details] = project;
    appendOutput(`
      <div class="project-details">
        <h3>${details.title}</h3>
        <p>${details.description}</p>
        <p><strong>Technologies:</strong> ${details.tech}</p>
        <p><strong>Link:</strong> <a href="${details.link}" target="_blank">${details.link}</a></p>
      </div>
    `);
  } else {
    appendOutput(
      `<p class="error">Project not found. Type <span class="command">projects</span> to see available projects.</p>`
    );
  }
}

function appendOutput(html) {
  output.innerHTML += `<div class="output-line">${html}</div>`;
  output.scrollTop = output.scrollHeight;
}

function clearOutput() {
  output.innerHTML = '<p class="welcome-text">Welcome to Portfolio v1.0</p>';
}

document.querySelector(".terminal-content").addEventListener("click", () => {
  terminalInput.focus();
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
