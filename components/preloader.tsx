'use client'

import { useEffect, useState } from 'react'

export default function Preloader() {
  const [show, setShow] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFadeOut(true)
    }, 100)

    const timer2 = setTimeout(() => {
      setShow(false)
    }, 500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  if (!show) return null

  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 bg-white z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      
      <div className="text-4xl font-bold text-teal-700 mt-[0px] mb-4 uppercase tracking-widest font-[Montserrat]">
        SARKARI BABU
      </div>

<div className="flex gap-2">
        <div className="w-4 h-4 bg-teal-600 rounded-full animate-bounce" />
        <div className="w-4 h-4 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]" />
        <div className="w-4 h-4 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]" />
      </div>
    </div>
  )
}
