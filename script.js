document.addEventListener('DOMContentLoaded', function () {
    const randomButton = document.getElementById('randomButton');
    const level1Button = document.getElementById('level1Button');
    const level2Button = document.getElementById('level2Button');
    const level3Button = document.getElementById('level3Button');
    const questionContainer = document.getElementById('questionContainer');

    // Function to fetch a random question based on the selected level
    const fetchRandomQuestion = (level) => {
        // Reset opacity to 0 before fetching new question
        questionContainer.style.opacity = 0;
        
        fetch(`level${level}qs.csv`)
            .then(response => response.text())
            .then(data => {
                const questions = data.split('\n').filter(q => q.trim() !== '');
                const randomIndex = Math.floor(Math.random() * questions.length);
                const randomQuestion = questions[randomIndex];
                questionContainer.innerHTML = randomQuestion;
           
                // Add fade-in class to trigger animation
                questionContainer.classList.add('fade-in');
            });
    };

    // Function to get question based on user input number
    function getQuestion() {
        var questionNumber = document.getElementById('questionNumber').value;

        // Validate if the entered value is within the range of 1-1000
        if (questionNumber < 1 || questionNumber > 1000) {
            alert("Please enter a number between 1 and 1000.");
            return;
        }

        var questionIndex;
        var csvFileName;

        // Determine which CSV file to pull the question from based on the submitted number
        if (questionNumber <= 333) {
            csvFileName = "level1qs.csv";
            questionIndex = questionNumber;
        } else if (questionNumber <= 666) {
            csvFileName = "level2qs.csv";
            questionIndex = questionNumber - 333;
        } else if (questionNumber <= 1000) {
            csvFileName = "level3qs.csv";
            questionIndex = questionNumber - 666;
        }
        
        // Reset opacity to 0 before fetching new question
        questionContainer.style.opacity = 0;

        // Fetch the CSV file using Fetch API
        fetch(csvFileName)
            .then(response => response.text())
            .then(data => {
                // Parse CSV data
                var rows = data.split('\n');
                // Extract the question at the specified index
                var question = rows[questionIndex - 1];
                // Display the question above the submit button
                questionContainer.innerHTML = "Question " + questionNumber + ": " + question;
                // Set opacity to 1 to trigger fade-in effect
                questionContainer.style.opacity = 1;
                // Add fade-in class to trigger animation
                questionContainer.classList.add('fade-in');
                // Reset zoom level to 1
                document.documentElement.style.zoom = 1;
                // Scroll to the top of the page
                window.scrollTo(0, 0);
            })
            .catch(error => {
                console.error('Error fetching CSV file:', error);
            });
    }

    // Event listener for random button click
    randomButton.addEventListener('click', () => {
        fetchRandomQuestion(3);
    });

    // Event listeners for level buttons
    level1Button.addEventListener('click', () => {
        fetchRandomQuestion(1);
    });

    level2Button.addEventListener('click', () => {
        fetchRandomQuestion(2);
    });

    level3Button.addEventListener('click', () => {
        fetchRandomQuestion(3);
    });

    // Event listener for enter key press on question number input
    document.getElementById('questionNumber').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            getQuestion();
        }
    });

    // Event listener for click on submit button
    document.getElementById('submit').addEventListener('click', getQuestion);
});
