document.addEventListener('DOMContentLoaded', function () {
  const randomButton = document.getElementById('randomButton');
  const level1Button = document.getElementById('level1Button');
  const level2Button = document.getElementById('level2Button');
  const level3Button = document.getElementById('level3Button');
  const questionContainer = document.getElementById('questionContainer');
  const phrasesText = document.getElementById('phrasesText');

  const fetchRandomQuestion = (level) => {
    fetch(`level${level}qs.csv`)
      .then(response => response.text())
      .then(data => {
        const questions = data.split('\n').filter(q => q.trim() !== '');
        const randomIndex = Math.floor(Math.random() * questions.length);
        const randomQuestion = questions[randomIndex];
        questionContainer.innerHTML = randomQuestion;
        questionContainer.style.opacity = 1;
      });
  };

  const fetchPhrases = () => {
    fetch('phrases.csv')
      .then(response => response.text())
      .then(data => {
        const phrases = data.split('\n').filter(p => p.trim() !== '');
        const randomIndex = Math.floor(Math.random() * phrases.length);
        const randomPhrase = phrases[randomIndex];
        phrasesText.innerHTML = randomPhrase;
        phrasesText.style.opacity = 1;
      });
  };

  const fetchButtonNames = () => {
    fetch('buttonnames.csv')
      .then(response => response.text())
      .then(data => {
        const buttonNames = data.split('\n').filter(b => b.trim() !== '');
        const randomIndex = Math.floor(Math.random() * buttonNames.length);
        const [level1Name, level2Name, level3Name] = buttonNames[randomIndex].split(',');
        level1Button.innerHTML = level1Name;
        level2Button.innerHTML = level2Name;
        level3Button.innerHTML = level3Name;
      });
  };

  randomButton.addEventListener('click', () => {
    questionContainer.style.opacity = 0;
    fetchRandomQuestion(3);
    if (Math.random() < 0.2) {
      phrasesText.style.opacity = 0;
      fetchPhrases();
    }
  });

  level1Button.addEventListener('click', () => {
    questionContainer.style.opacity = 0;
    fetchRandomQuestion(1);
    if (Math.random() < 0.2) {
      phrasesText.style.opacity = 0;
      fetchPhrases();
    }
  });

  level2Button.addEventListener('click', () => {
    questionContainer.style.opacity = 0;
    fetchRandomQuestion(2);
    if (Math.random() < 0.2) {
      phrasesText.style.opacity = 0;
      fetchPhrases();
    }
  });

  level3Button.addEventListener('click', () => {
    questionContainer.style.opacity = 0;
    fetchRandomQuestion(3);
    if (Math.random() < 0.2) {
      phrasesText.style.opacity = 0;
      fetchPhrases();
    }
  });

  fetchButtonNames();
});
