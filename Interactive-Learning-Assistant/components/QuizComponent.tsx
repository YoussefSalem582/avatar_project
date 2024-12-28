'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'

interface QuizComponentProps {
  onScoreChange: (score: number) => void
}

const questions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Mars", "Venus", "Jupiter", "Saturn"],
    correctAnswer: "Mars"
  },
  {
    question: "What is the largest mammal?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: "Blue Whale"
  }
]

export function QuizComponent({ onScoreChange }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [score, setScore] = useState(0)

  const handleAnswer = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer("")
    } else {
      onScoreChange(score + 1)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer("")
    setScore(0)
    onScoreChange(0)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="mb-4" />
        <p className="mb-4">{questions[currentQuestion].question}</p>
        <RadioGroup onValueChange={setSelectedAnswer} value={selectedAnswer}>
          {questions[currentQuestion].options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
        <Button 
          onClick={handleAnswer} 
          className="mt-4 w-full" 
          disabled={!selectedAnswer}
          aria-label={currentQuestion < questions.length - 1 ? "Next question" : "Finish quiz"}
        >
          {currentQuestion < questions.length - 1 ? "Next" : "Finish"}
        </Button>
        {currentQuestion === questions.length - 1 && (
          <Button 
            onClick={resetQuiz} 
            className="mt-4 w-full"
            aria-label="Retake quiz"
          >
            Retake Quiz
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

