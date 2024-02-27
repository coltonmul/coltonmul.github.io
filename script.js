document.addEventListener('DOMContentLoaded', function () {
    const randomButton = document.getElementById('randomButton');
    const level1Button = document.getElementById('level1Button');
    const level2Button = document.getElementById('level2Button');
    const level3Button = document.getElementById('level3Button');
    const questionContainer = document.getElementById('questionContainer');
    const questionNumberInput = document.getElementById('questionNumber');
    const submitButton = document.getElementById('submit');

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
            fetchQuestionByNumber();
        }
    });

    // Event listener for click on submit button
    submitButton.addEventListener('click', fetchQuestionByNumber);

    // Function to fetch question based on user input number
    const fetchQuestionByNumber = () => {
        const questionNumber = parseInt(questionNumberInput.value);
        if (questionNumber >= 1 && questionNumber <= 1000) {
            let level;
            if (questionNumber <= 333) {
                level = 1;
            } else if (questionNumber <= 666) {
                level = 2;
            } else {
                level = 3;
            }

            fetch(`level${level}qs.csv`)
                .then(response => response.text())
                .then(data => {
                    const questions = data.split('\n').filter(q => q.trim() !== '');
                    const questionIndex = determineQuestionIndex(level, questionNumber);
                    const questionText = questions[questionIndex];
                    fadeInQuestion(questionNumber, questionText);
                });
        } else {
            alert("Please enter a number between 1 and 1000.");
        }
    };

    // Function to determine question index based on level and question number
    const determineQuestionIndex = (level, questionNumber) => {
        if (level === 1) {
            return questionNumber - 1;
        } else if (level === 2) {
            return questionNumber - 334;
        } else {
            return questionNumber - 667;
        }
    };
});
