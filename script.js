// Load questions from CSV file
const questions = [];

// Function to fetch questions from CSV
function fetchQuestions() {
    // Fetch CSV file
    fetch('questions.csv')
        .then(response => response.text())
        .then(text => {
            // Parse CSV
            const rows = text.split('\n');
            rows.forEach(row => {
                questions.push(row.trim());
            });
        });
}

// Generate random question
function generateQuestion() {
    const questionNumberInput = document.getElementById('questionNumber');
    const questionNumber = parseInt(questionNumberInput.value);
    if (questionNumber >= 1 && questionNumber <= 1000) {
        const question = questions[questionNumber - 1];
        document.getElementById('question').textContent = question;
    } else {
        alert('Please enter a number between 1 and 1000.');
    }
}

// Set question number from keypad
function setQuestionNumber(number) {
    document.getElementById('questionNumber').value = number;
}

// Load questions on page load
window.onload = fetchQuestions;
