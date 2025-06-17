import React, { useState, useEffect } from 'react'

const QUIZ_DATA = [
  {
    type: '주소형',
    prompt: '3초 동안 이 주소를 기억하세요',
    answer: '서울 강남구 대치동 999-28',
    options: [
      '서울 여의마루길 976-28',
      '서울 강남구 대치동 999-28',
      '서울 강남구 대치동 996-28',
      '서울 강남구 한남동 197-28',
      '서울 은평구 녹번동 22-19',
      '서울 관악구 봉천동 101-44',
    ],
  },
  {
    type: '주문번호형',
    prompt: '3초 동안 이 주문번호를 기억하세요',
    answer: 'AB3457890',
    options: [
      'XY100<mark>3847</mark>',
      'AB345<mark>7890</mark>',
      'SD890<mark>9234</mark>',
      'AB300<mark>2345</mark>',
      'TR777<mark>8890</mark>',
      'DL456<mark>9999</mark>',
    ],
  },
  {
    type: '시각인증코드형',
    prompt: '3초 동안 이 시각코드를 기억하세요',
    answer: '★-3-가-나',
    options: [
      '♥-2-다-라',
      '▲-9-하-거',
      '★-3-가-나',
      '●-4-라-바',
      '☂-7-마-사',
      '★-3-가-다',
    ],
  },
]

function App() {
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState('intro') // intro | show | quiz
  const [startTime, setStartTime] = useState(null)
  const [answers, setAnswers] = useState([])

  useEffect(() => {
    if (phase === 'show') {
      const timer = setTimeout(() => {
        setPhase('quiz')
        setStartTime(Date.now())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [phase])

  const handleAnswer = (selected) => {
    const endTime = Date.now()
    const timeTaken = endTime - startTime
    const current = QUIZ_DATA[step]
    const isCorrect = selected === current.answer
    const newAnswer = {
      question: current.type,
      isCorrect,
      timeTaken,
    }

    fetch('https://script.google.com/macros/s/AKfycbxhdmSZNXkWjEiei5ewjpxDThyrpS0KhzQV1SYLXuM90p8NwST0NUb3uRiyop9x2WJG/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAnswer),
    })

    setAnswers([...answers, newAnswer])
    setStartTime(null)
    setPhase('show')
    setStep(step + 1)
  }

  if (step >= QUIZ_DATA.length) {
    const correctCount = answers.filter((a) => a.isCorrect).length
    return (
      <div style={{ padding: '2rem' }}>
        <h2>테스트 결과</h2>
        <p>{correctCount} / {QUIZ_DATA.length} 정답</p>
        <ul>
          {answers.map((a, i) => (
            <li key={i}>
              [{a.question}] {a.isCorrect ? '⭕' : '❌'} - {a.timeTaken}ms
            </li>
          ))}
        </ul>
        <button onClick={() => location.reload()}>다시하기</button>
      </div>
    )
  }

  const current = QUIZ_DATA[step]

  return (
    <div style={{ padding: '2rem' }}>
      {phase === 'intro' ? (
        <div style={{ textAlign: 'center' }}>
          <h2>기억력 테스트 안내</h2>
          <p>
            앞으로 제시되는 글자를 <strong>3초간 기억</strong>하고,<br />
            <strong>6개의 선택지</strong> 중에서 같은 글자를 찾아 클릭하세요.<br />
            총 <strong>3문제</strong>가 출제됩니다.
          </p>
          <button onClick={() => setPhase('show')} style={{
            marginTop: '2rem',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            borderRadius: '0.5rem',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}>
            시작하기
          </button>
        </div>
      ) : (
        <>
          <h2>[{current.type}] 문제</h2>
          {phase === 'show' ? (
            <div style={{
              background: '#eee',
              padding: '2rem',
              borderRadius: '1rem',
              textAlign: 'center',
              fontSize: '1.2rem',
              animation: 'pulse 1s infinite alternate'
            }}>
              {current.answer.replace(/<mark>(.*?)<\/mark>/g, '$1')}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              {current.options.map((opt, idx) => (
                <div
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  style={{
                    background: '#f9f9f9',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    border: '1px solid #ccc'
                  }}
                  dangerouslySetInnerHTML={{ __html: opt }}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default App
