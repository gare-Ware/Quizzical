import { useState, useEffect } from 'react';
import Intro from './Intro'
import Customize from './Customize';
import { nanoid } from 'nanoid'
import { decode } from 'html-entities'

function App() {
  const [quizQuestions, setQuizQuestions] = useState([])
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [initialStart, setInitialStart] = useState(true)
  const [customizingQuiz, setCustomizingQuiz] = useState(false)
  const [quizEnded, setQuizEnded] = useState(false)
  const [numCorrect, setNumCorrect] = useState(0)
  const [apiUrl, setApiUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [buttonStyle, setButtonStyle] = useState({})

  /* Function passed to Intro component, set to onClick on start button press. Only utilized on first load. */
  function startQuiz() {
    setInitialStart(false)
    setCustomizingQuiz(true)
  }

  /* Decode html entities to characters. */
  function formatData(data) {
    return decode(data)
  }

  /* Pass function to Customize component to generate url for fetch */
  function generateApiUrl(data){
    if(data.difficulty){
      let url = `https://opentdb.com/api.php?amount=5&category=${data.category}&difficulty=${data.difficulty}`
      setApiUrl(url)
      setButtonStyle({})
      setCustomizingQuiz(false)
    } else {
      setButtonStyle({ /* Wiggle start quiz button if clicked before all selections made */
        animation: "wiggle 500ms"
      })
      setTimeout(() => setButtonStyle({}), 500)
    }
  }

  useEffect(() => {
    setLoading(true) /* Implement loading screen until data is fetched */
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const formattedData = data.results.map(item => {
          const formattedCorrectAnswer = formatData(item.correct_answer)
          const incorrect = item.incorrect_answers.map(answer => formatData(answer))
          let answerOptionsArr = []
          for(let i of incorrect){
              answerOptionsArr.push(i)
          }
          /* Insert correct answer into answer options at random index */
          const randomNum = Math.floor(Math.random() * 4)
          answerOptionsArr.splice(randomNum, 0, formattedCorrectAnswer)
          /** Return an array of quiz question objects. Each object includes an id, the question, the
              correct answer, and an array answerOptions, which is an array of answer
              option objects, each object including the answer, an id, and boolean variables that
              will be used to display which options are selected, which are correct, and which
              are incorrect. */
          return {
            id: nanoid(),
            question: formatData(item.question),
            correct_answer: formattedCorrectAnswer,
            answerOptions: answerOptionsArr.map(answer => (
              {
                answer: answer,
                isSelected: false,
                isCorrect: false,
                isIncorrect: false,
                id: nanoid()
              }
            ))
          }
        })
        setQuizQuestions(formattedData)
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }, [apiUrl]) /* Fetch is run and new questions are generated whenever apiUrl is changed 
                  via customize screen */

  /* function set as the onClick function for every answer option */
  function selectAnswer(id, num, answer) {
    if(!quizEnded) {
      /* Reset selectedAnswers array. Check if question was already answered, if so replace answer. Otherwise add to the array with a new answer. */
      setSelectedAnswers(prevAnswers => { 
        for(let i of prevAnswers){
          if(i.questionIndex === num){
            return prevAnswers.map(item => {
              return item.questionIndex === num ?
                    {...item, answer: answer} :
                    item
            })
          }
        }
        return [...prevAnswers, { answer: answer, questionIndex: num }]
      })
      /* Reset quizQuestions array to show which answers should be highlighted. Unselect answers by default to allow changing of answers by user. Check for id of clicked item and make it selected.  */
      setQuizQuestions(prevQuestions => prevQuestions.map((question, index) => { 
        if(index === num){
          const newAnswerOptions = question.answerOptions.map(option => {
            let newOption = option
            if(option.isSelected){
              newOption = {...option, isSelected: false}
            }
            if(option.id === id){
              newOption = {...option, isSelected: true}
            }
            return newOption
          })
          return {...question, answerOptions: newAnswerOptions}
        } else return question
      }))
    }
  }

  /* If all questions answered, compare selectedAnswers array to corresponding question correc_answer in quizQuestions array. If answer is correct increase numCorrect for score display */
  function checkAnswers() {
    if(selectedAnswers.length === 5){
      for(let i of selectedAnswers){
        if(i.answer === quizQuestions[i.questionIndex].correct_answer) {
          setNumCorrect(prev => prev + 1)
        }
      }
      /* Map through quizQuestions array to change boolean values which will highlight correct and incorrect values based on styling conditionals that are applied when the JSX elements are rendered */
      setQuizQuestions(prevQuestions => prevQuestions.map((question, index) => {
        const newAnswerOptions = question.answerOptions.map(option => {
          let newOption = option
          if(option.answer === question.correct_answer){
            newOption = {...option, isCorrect: true}
          }
          if(option.isSelected && option.answer !== question.correct_answer){
            newOption = {...option, isIncorrect: true}
          }
          return newOption
        })
        return {...question, answerOptions: newAnswerOptions}
      }))
      setButtonStyle({})
      setQuizEnded(true)
    } else {
      setButtonStyle({ /* Wiggle check answers button if clicked before all selections made */
        animation: "wiggle 500ms"
      })
      setTimeout(() => setButtonStyle({}), 500)
    }
  }

  /* Reset for new quiz. Since this is not the initial start, skip intro screen and display customize screen */
  function playAgain() {
    setSelectedAnswers([])
    setNumCorrect(0)
    setQuizEnded(false)
    setApiUrl({})
    setCustomizingQuiz(true)
  }

  /* Render JSX elements. Styling applied based on boolean values. */
  const questionElements = quizQuestions.map((quizQuestion, questionIndex) => {
    const answerOptionElements = quizQuestion.answerOptions.map(option => {
      let styles
      if(option.isSelected){
        styles = {
          backgroundColor: "#333333",
          color: "#F5F7FB",
          border: "1px solid #333333"
        }
      }
      if(option.isCorrect){
        styles = {
          backgroundColor: "#7ee695",
          border: "1px solid #7ee695"
        }
      }
      if(option.isIncorrect){
        styles = {
          backgroundColor: "#fa8e8e",
          color: "#545e94",
          border: "1px solid #fa8e8e"
        }
      }
      if(quizEnded && !option.isCorrect &&!option.isIncorrect){
        styles = {
          color: "#8f96bd",
          border: "1px solid #8f96bd"
        }
      }
      return (<li 
                className='option' style={styles} onClick={() => selectAnswer(option.id, questionIndex, option.answer)} key={option.id}
              >
                {option.answer}
              </li>)
    })
    return (
      <div className='quiz-question' key={quizQuestion.id}>
          <h3 className='quiz-question__question'>{quizQuestion.question}</h3>
          <ul className='quiz-question__options'>
              {answerOptionElements}
          </ul>
      </div>
    )
  })

  /* Show loading animation while waiting for data from fetch */
  if (loading) {
    return (<div className='app'>
              <div className='loading-spinner'></div>
            </div>)
  }

  return (
    <div className="app">
      {initialStart ?
      <Intro startQuiz={startQuiz} /> :
      customizingQuiz && <Customize generateApiUrl={generateApiUrl} buttonStyle={buttonStyle}/>}
      {!initialStart && !customizingQuiz &&
      <div className='quiz-container'>
        {questionElements}
        {!quizEnded ? 
        <button className='check-answers-btn' onClick={checkAnswers} style={buttonStyle}>Check answers</button> :
        <div className='quiz-ended-container'>
          <p className='score'>You scored {numCorrect}/5 correct answers</p>
          <button className='play-again-btn' onClick={playAgain}>Play again</button>
        </div>}
      </div>}
    </div>
  )
}

export default App;
