import React from "react"

export default function Intro({ startQuiz }) {
    return (
        <div className="intro">
            <h1 className="intro__title">Quizzical</h1>
            <p className="intro__subhead">How much do you know?</p>
            <button className="intro__start-btn" onClick={startQuiz} >Start</button>
        </div>
    )
}