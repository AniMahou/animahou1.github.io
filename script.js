document.addEventListener('DOMContentLoaded', () => {
    let timeLeft = 300; // 5 minutes in seconds
    const timerElement = document.getElementById('time');
    const leaderboardElement = document.getElementById('leaderboard');
    let correctAnswers = {
        answer1: "attack on titan",
        answer2: "one piece",
        answer3: "naruto",
        // Add more answers as needed
    };

    loadLeaderboard();

    document.getElementById('startButton').addEventListener('click', () => {
        document.getElementById('quizForm').style.display = 'block';
        startTimer();
    });

    function startTimer() {
        // Update the timer every second
        const timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                alert('Time is up! Submitting your answers.');
                autoSubmit();
            } else {
                timeLeft--;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }
        }, 1000);
    }

    // Handle form submission
    document.getElementById('quizForm').addEventListener('submit', (e) => {
        e.preventDefault();
        submitForm();
    });

    function submitForm() {
        const formData = new FormData(document.getElementById('quizForm'));
        const name = formData.get('name').trim();
        const phone = formData.get('phone').trim();
    
        if (!name || !phone) {
            alert('Please enter your name and phone number.');
            return;
        }
    
        const userAnswers = {};
        formData.forEach((value, key) => {
            if (key.startsWith('answer')) {
                userAnswers[key] = value;
            }
        });
    
        const score = calculateScore(userAnswers, correctAnswers);
        const user = {
            name: name,
            phone: phone,
            score: score,
            time: formatTime(300 - timeLeft)
        };
    
        updateLeaderboard(user);
        saveLeaderboard();
    
        // End the quiz and redirect to a new page
        endQuiz();
    }
    
    function endQuiz() {
        // Redirect to a new page
        window.location.href = 'thank_you.html'; // Replace 'thank_you.html' with the URL of your thank you page
    }

    function calculateScore(userAnswers, correctAnswers) {
        let score = 0;
        for (const [key, value] of Object.entries(userAnswers)) {
            if (value.trim() === "") {
                // Blank answer, no score change
                continue;
            }
            if (correctAnswers[key] && correctAnswers[key].toLowerCase() === value.trim().toLowerCase()) {
                score += 1; // Correct answer
            } else {
                score -= 0.25; // Incorrect answer
            }
        }
        return score;
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function updateLeaderboard(user) {
        const leaderboardData = getLeaderboardData();
        leaderboardData.push(user);

        leaderboardData.sort((a, b) => {
            if (b.score === a.score) {
                return a.name.localeCompare(b.name);
            }
            return b.score - a.score;
        });

        localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
        renderLeaderboard(leaderboardData);
    }

    function getLeaderboardData() {
        const data = JSON.parse(localStorage.getItem('leaderboard')) || [];
        return data.filter(entry => entry.name && entry.phone); // Filter out undefined/null entries
    }

    function renderLeaderboard(leaderboardData) {
        leaderboardElement.innerHTML = '';
        leaderboardData.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.phone}</td>
                <td>${user.score}</td>
                <td>${user.time}</td>
            `;
            leaderboardElement.appendChild(row);
        });
    }

    function loadLeaderboard() {
        const leaderboardData = getLeaderboardData();
        renderLeaderboard(leaderboardData);
    }

    function saveLeaderboard() {
        const leaderboardData = getLeaderboardData();
        localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
    }

    function autoSubmit() {
        const formData = new FormData(document.getElementById('quizForm'));
        const userAnswers = {};
        formData.forEach((value, key) => {
            if (key.startsWith('answer')) {
                userAnswers[key] = value;
            }
        });

        const score = calculateScore(userAnswers, correctAnswers);
        const user = {
            name: formData.get('name') || "Anonymous",
            phone: formData.get('phone') || "N/A",
            score: score,
            time: formatTime(300 - timeLeft)
        };

        updateLeaderboard(user);
        saveLeaderboard();
        endQuiz();
    }
});






