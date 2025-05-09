let audioContext;
let isSoundEnabled = true;

document.addEventListener("click", initAudio, { once: true });

function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

function playKeySound() {
  if (!audioContext || !isSoundEnabled) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.frequency.value = 440 + Math.random() * 220;
  gain.gain.setValueAtTime(0.025, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.08
  );
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + 0.08);
}

function playEnterSound() {
  if (!audioContext || !isSoundEnabled) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.frequency.value = 330;
  gain.gain.setValueAtTime(0.04, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.15
  );
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + 0.15);
}

function playErrorSound() {
  if (!audioContext || !isSoundEnabled) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.frequency.value = 220;
  osc.type = "sawtooth";
  gain.gain.setValueAtTime(0.05, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + 0.3);
}

function createParticles() {
  const particleCount = 50;
  const body = document.body;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.style.position = "fixed";
    particle.style.width = Math.random() * 4 + "px";
    particle.style.height = particle.style.width;
    particle.style.backgroundColor =
      "rgba(0, 255, 0, " + (Math.random() * 0.4 + 0.1) + ")";
    particle.style.borderRadius = "50%";
    particle.style.pointerEvents = "none";
    particle.style.zIndex = "1";

    const posX = Math.random() * window.innerWidth;
    const posY = Math.random() * window.innerHeight;
    particle.style.left = posX + "px";
    particle.style.top = posY + "px";

    const duration = Math.random() * 50 + 20;
    const delay = Math.random() * 10;

    gsap.to(particle, {
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      opacity: Math.random() * 0.5 + 0.2,
      duration: duration,
      delay: delay,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    body.appendChild(particle);
  }
}

function createGlowingGrid() {
  const nodeCount = 10;
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.overflow = "hidden";
  container.style.pointerEvents = "none";
  container.style.zIndex = "0";

  const nodes = [];

  for (let i = 0; i < nodeCount; i++) {
    const node = document.createElement("div");
    node.style.position = "absolute";
    node.style.width = "4px";
    node.style.height = "4px";
    node.style.backgroundColor = "#0f0";
    node.style.borderRadius = "50%";
    node.style.boxShadow = "0 0 8px #0f0";

    const posX = Math.random() * window.innerWidth;
    const posY = Math.random() * window.innerHeight;
    node.style.left = posX + "px";
    node.style.top = posY + "px";

    container.appendChild(node);
    nodes.push({ element: node, x: posX, y: posY });

    gsap.to(node, {
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      duration: 20 + Math.random() * 40,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }

  document.body.appendChild(container);
}

createParticles();
createGlowingGrid();

const terminal = document.querySelector(".terminal");
const minimizeBtn = document.querySelector(".minimize-btn");
const closeBtn = document.querySelector(".close-btn");
const terminalInput = document.getElementById("terminal-input");
const output = document.getElementById("output");
const desktopIcon = document.getElementById("desktop-icon");

function setupAnimations() {
  gsap.from(".terminal", {
    duration: 0.8,
    scale: 0.9,
    opacity: 0,
    ease: "power3.out",
    onComplete: () => {
      terminalInput.focus();
    },
  });

  const welcomeText = document.querySelector(".welcome-text");
  gsap.from(welcomeText, {
    duration: 0.5,
    opacity: 0,
    y: 10,
    delay: 0.3,
    ease: "power2.out",
  });

  const helpPrompt = welcomeText.nextElementSibling;
  gsap.from(helpPrompt, {
    duration: 0.5,
    opacity: 0,
    y: 10,
    delay: 0.6,
    ease: "power2.out",
  });

  gsap.from(".terminal-input-line", {
    duration: 0.4,
    opacity: 0,
    y: 10,
    delay: 0.9,
    ease: "power2.out",
  });
}

setupAnimations();

function adjustLayout() {
  const isMobile = window.innerWidth <= 768;
  document.body.classList.toggle("mobile", isMobile);
}

adjustLayout();
window.addEventListener("resize", () => {
  adjustLayout();
});

minimizeBtn.addEventListener("click", () => {
  terminal.classList.toggle("minimized");
  if (terminal.classList.contains("minimized")) {
    minimizeBtn.textContent = "□";

    gsap.to(terminal, {
      height: "40px",
      duration: 0.3,
      ease: "power2.out",
    });
  } else {
    minimizeBtn.textContent = "_";

    gsap.to(terminal, {
      height:
        window.innerWidth <= 480
          ? "60%"
          : window.innerWidth <= 768
          ? "70%"
          : "75%",
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        terminalInput.focus();
      },
    });
  }
});

closeBtn.addEventListener("click", () => {
  gsap.to(terminal, {
    scale: 0.9,
    opacity: 0,
    duration: 0.4,
    ease: "power3.in",
    onComplete: () => {
      terminal.classList.add("closed");
      showDesktopIcon();
    },
  });
});

function showDesktopIcon() {
  desktopIcon.classList.add("visible");

  gsap.fromTo(
    desktopIcon,
    {
      scale: 0.5,
      opacity: 0,
    },
    {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.7)",
      onComplete: () => {
        gsap.to(desktopIcon, {
          boxShadow: "0 0 25px rgba(0, 255, 0, 1)",
          repeat: 2,
          yoyo: true,
          duration: 0.5,
        });
      },
    }
  );
}

desktopIcon.addEventListener("click", () => {
  gsap.to(desktopIcon, {
    scale: 0.8,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    onComplete: openTerminal,
  });
});

function openTerminal() {
  terminal.classList.remove("closed");
  desktopIcon.classList.remove("visible");

  gsap.fromTo(
    terminal,
    {
      scale: 0.9,
      opacity: 0,
    },
    {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: "power3.out",
      onComplete: () => {
        terminalInput.focus();
      },
    }
  );
}

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
        playErrorSound();
        validCommand = false;
      }
  }

  if (!audioContext && validCommand) {
    initAudio();
  }

  const newOutput = output.lastElementChild;
  if (newOutput) {
    gsap.from(newOutput, {
      duration: 0.3,
      opacity: 0,
      y: 10,
      ease: "power2.out",
    });
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

    const projectDetailsElement = output.querySelector(
      ".project-details:last-child"
    );
    gsap.from(projectDetailsElement, {
      duration: 0.5,
      opacity: 0,
      y: 15,
      ease: "power2.out",
    });
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
  gsap.to(output, {
    opacity: 0,
    duration: 0.2,
    onComplete: () => {
      output.innerHTML =
        '<p class="welcome-text">Welcome to Portfolio v1.0</p>';
      gsap.to(output, {
        opacity: 1,
        duration: 0.3,
      });
    },
  });
}

document.querySelector(".terminal-content").addEventListener("click", () => {
  terminalInput.focus();
});
