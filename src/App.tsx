import { useState } from 'react'
import type { Mode, RoundResult, Screen, Subject, TopicMeta } from './types'
import { useProgress } from './hooks/useProgress'
import HomeScreen from './screens/HomeScreen'
import SubjectPickerScreen from './screens/SubjectPickerScreen'
import TopicPickerScreen from './screens/TopicPickerScreen'
import RoundConfigScreen from './screens/RoundConfigScreen'
import QuizRoundScreen from './screens/QuizRoundScreen'
import RoundSummaryScreen from './screens/RoundSummaryScreen'

export default function App() {
  const { progress, updateProgress } = useProgress()
  const [screen, setScreen] = useState<Screen>({ name: 'home' })

  function toggleSound() {
    updateProgress((prev) => ({ ...prev, soundOn: !prev.soundOn }))
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-300">
      <div className="relative mx-auto min-h-screen w-full max-w-3xl">
        {screen.name === 'home' && (
          <HomeScreen progress={progress} onStart={() => setScreen({ name: 'subject' })} onToggleSound={toggleSound} />
        )}

        {screen.name === 'subject' && (
          <SubjectPickerScreen
            onPick={(subject: Subject) => setScreen({ name: 'topic', subject })}
            onBack={() => setScreen({ name: 'home' })}
          />
        )}

        {screen.name === 'topic' && (
          <TopicPickerScreen
            subject={screen.subject}
            progress={progress}
            onPick={(topic: TopicMeta) => setScreen({ name: 'config', subject: screen.subject, topic })}
            onBack={() => setScreen({ name: 'subject' })}
          />
        )}

        {screen.name === 'config' && (
          <RoundConfigScreen
            topic={screen.topic}
            onStart={(length: number, mode: Mode) =>
              setScreen({ name: 'quiz', subject: screen.subject, topic: screen.topic, length, mode })
            }
            onBack={() => setScreen({ name: 'topic', subject: screen.subject })}
          />
        )}

        {screen.name === 'quiz' && (
          <QuizRoundScreen
            subject={screen.subject}
            topic={screen.topic}
            length={screen.length}
            mode={screen.mode}
            progress={progress}
            updateProgress={updateProgress}
            onFinish={(result: RoundResult) => setScreen({ name: 'summary', result })}
            onExit={() => setScreen({ name: 'home' })}
          />
        )}

        {screen.name === 'summary' && (
          <RoundSummaryScreen
            result={screen.result}
            soundOn={progress.soundOn}
            onPlayAgain={() => {
              const meta: TopicMeta = { key: screen.result.topic, label: screen.result.topicLabel, icon: '', available: true }
              setScreen({ name: 'config', subject: screen.result.subject, topic: meta })
            }}
            onNewTopic={() => setScreen({ name: 'topic', subject: screen.result.subject })}
            onHome={() => setScreen({ name: 'home' })}
          />
        )}
      </div>
    </div>
  )
}
