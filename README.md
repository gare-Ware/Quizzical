# Quizzical
A customizable quiz app built with React and [The Open Trivia Database API](https://opentdb.com/api_config.php).

**Link to project:** https://gk-quizzical.netlify.app/

<img width="100%" alt="quizzical" src="https://user-images.githubusercontent.com/92345400/162046267-107781df-99ce-47c1-b7bc-89037e27de71.png">

## How It's Made:

**Tech used:** HTML, CSS, JavaScript, React

The Open Trivia Database API provides encoded quiz data. Immediately after data is fetched, it is formatted with an imported package [html-entities](https://github.com/mdevils/html-entities.git). The data is then sorted into an array of quiz question objects. Each object includes an id, the question, the correct answer, and an array answerOptions, which is an array of answer option objects, each object including the answer, an id, and boolean variables that will be used to display which options are selected, which are correct, and which are incorrect. Imported package [nanoid](https://github.com/ai/nanoid.git) provides a unique key/id for all items.

Maintaining user-selections in state allow for flexibility for the user, ensuring they can change their selections or select options in any order they please. If the user has not made all required selections, a simple animation lets them know.

The Customize component allows the user to make selections which manipulate the API url, allowing them to customize the quiz. 

## Lessons Learned:

This project proved to be far more complex than it seems upfront. This is largely due to all of the nesting of arrays and objects which was necessary to implement a polished UI. The responsiveness and flexibility around making selections required each answer option to be an object with properties as opposed to them being simple strings. It was easy to get confused when writing the code until I started creating a visual map of the arrays and objects for myself. This helped tremendously and is now a strategy I keep in my aresenal when writing code.
