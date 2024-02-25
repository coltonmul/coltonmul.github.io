// Function to fetch CSV file
async function fetchCSV() {
    const response = await fetch('questions.csv');
    const data = await response.text();
    return data;
}

// Function to parse CSV data and extract questions
function parseCSV(csvData) {
    const lines = csvData.split('\n');
    const questions = lines.map(line => line.trim()).filter(line => line !== '');
    return questions;
}

// Function to get a random question
function getRandomQuestion(questions) {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
}

// Function to update the question on button click
document.getElementById('newQuestionBtn').addEventListener('click', async function() {
    const questionElement = document.getElementById('question');
    const csvData = await fetchCSV();
    const questions = parseCSV(csvData);
    questionElement.textContent = getRandomQuestion(questions);
});
