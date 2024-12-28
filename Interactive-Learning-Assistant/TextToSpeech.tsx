import React, { useState } from 'react'

export function TextToSpeech() {
  const [text, setText] = useState('')

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(utterance)
    } else {
      console.error('Text-to-speech not supported in this browser')
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-24 p-2 border rounded"
        placeholder="Enter text to speak"
      />
      <button 
        onClick={handleSpeak} 
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Speak
      </button>
    </div>
  )
}

