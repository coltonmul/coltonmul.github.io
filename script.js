document.addEventListener('DOMContentLoaded', function () {
    const randomButton = document.getElementById('randomButton');
    const level1Button = document.getElementById('level1Button');
    const level2Button = document.getElementById('level2Button');
    const level3Button = document.getElementById('level3Button');
    const questionContainer = document.getElementById('questionContainer');
    const questionNumberInput = document.getElementById('questionNumber');

    // Function to fetch a random question based on the selected level
    const fetchRandomQuestion = (level) => {
        fetch(`level${level}qs.csv`)
            .then(response => response.text())
            .then(data => {
                const questions = data.split('\n').filter(q => q.trim() !== '');
                const randomIndex = Math.floor(Math.random() * questions.length);
                const randomQuestion = questions[randomIndex];
                const questionNumber = determineQuestionNumber(level, randomIndex + 1);
                fadeInQuestion(questionNumber, randomQuestion);
                window.scrollTo(0, 0); // Scroll to the top of the page
            });
    };

    // Function to determine the question number based on the selected level and index
    const determineQuestionNumber = (level, index) => {
        if (level === 1) {
            return index;
        } else if (level === 2) {
            return index + 333;
        } else {
            return index + 666;
        }
    };

    // Function to fade in the question container with the provided question number and text
    const fadeInQuestion = (questionNumber, questionText) => {
        questionContainer.style.opacity = 0; // Start with opacity 0
        questionContainer.innerHTML = `Question ${questionNumber}: ${questionText}`;
        let opacity = 0;
        const fadeInInterval = setInterval(() => {
            opacity += 0.05; // Increase opacity gradually
            questionContainer.style.opacity = opacity;
            if (opacity >= 1) {
                clearInterval(fadeInInterval); // Stop interval when opacity reaches 1
            }
        }, 20); // Adjust the interval for smoother animation
    };

    // Function to get question based on user input number
    const getQuestion = () => {
        var questionNumber = questionNumberInput.value;

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

        // Fetch the CSV file using Fetch API
        fetch(csvFileName)
            .then(response => response.text())
            .then(data => {
                // Parse CSV data
                var rows = data.split('\n');
                // Extract the question at the specified index
                var question = rows[questionIndex - 1];
                // Display the question above the submit button
                questionContainer.innerHTML = `Question ${questionNumber}: ${question}`;
                // Reset zoom level to 1
                document.documentElement.style.zoom = 1;
                // Scroll to the top of the page
                window.scrollTo(0, 0);
            })
            .catch(error => {
                console.error('Error fetching CSV file:', error);
            });
    };

    // Event listeners for buttons
    randomButton.addEventListener('click', () => {
        fetchRandomQuestion(3);
    });

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
    questionNumberInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            getQuestion();
        }
    });

    // Event listener for click on submit button
    document.getElementById('submit').addEventListener('click', getQuestion);
    
    // Function to append a digit to the input field
    const appendToInput = (digit) => {
        document.getElementById('questionNumber').value += digit;
    };
    
    // Function to clear the input field
    const clearInput = () => {
        document.getElementById('questionNumber').value = '';
    };
    
    // Event listeners for the number keypad buttons
    document.getElementById('keypad1').addEventListener('click', () => {
        appendToInput('1');
    });
    
    document.getElementById('keypad2').addEventListener('
