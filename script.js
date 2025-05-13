let countdownInterval;

function calculateAge() {
  const dateInput = document.getElementById("date").value;
  const output = document.getElementById("age");
  output.innerText = "";

  if (!dateInput) {
    output.innerText = "Please enter a valid date.";
    return;
  }

  const birthDate = new Date(dateInput);
  const currentDate = new Date();

  if (birthDate > currentDate) {
    output.innerText = "Date of birth cannot be in the future.";
    return;
  }

  let years = currentDate.getFullYear() - birthDate.getFullYear();
  let months = currentDate.getMonth() - birthDate.getMonth();
  let days = currentDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    months += 12;
    years--;
  }

  if (countdownInterval) clearInterval(countdownInterval);

  function updateCountdown() {
    const now = new Date();
    let nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());

    if (nextBirthday < now) {
      nextBirthday.setFullYear(now.getFullYear() + 1);
    }

    const timeDiff = nextBirthday - now;

    if (timeDiff <= 0) {
      output.innerHTML = `<strong>🎉 Happy Birthday! 🎂</strong><br>You are now <strong>${years + 1}</strong> years old!`;
      runConfetti();
      clearInterval(countdownInterval);
      return;
    }

    const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutesLeft = Math.floor((timeDiff / (1000 * 60)) % 60);
    const secondsLeft = Math.floor((timeDiff / 1000) % 60);

    let message = `Your age is: <strong>${years}</strong> year(s), <strong>${months}</strong> month(s), and <strong>${days}</strong> day(s).`;

    message += `<br><br>⏳ <strong>${daysLeft}</strong> days, <strong>${hoursLeft}</strong> hours, <strong>${minutesLeft}</strong> minutes, <strong>${secondsLeft}</strong> seconds until your next birthday.`;

    if (daysLeft <= 30) {
      message += `<br><br>🎉 You're almost <strong>${years + 1}</strong>!`;
    }

    output.innerHTML = message;
  }

  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

function runConfetti() {
  const duration = 5 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

const toggleBtn = document.getElementById("themeToggle");
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "dark") {
  document.body.classList.add("dark-mode");
  toggleBtn.innerText = "☀️ Toggle Theme";
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");
  toggleBtn.innerText = isDark ? "☀️ Toggle Theme" : "🌙 Toggle Theme";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});
