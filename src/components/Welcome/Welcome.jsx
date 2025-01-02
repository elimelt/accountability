import { useNavigate } from 'react-router-dom'
import useAppState from '../../hooks/useAppState'
import './Welcome.css'

export default function Welcome() {
  const navigate = useNavigate()
  const { handlePersistState } = useAppState()

  const handleGetStarted = () => {
    handlePersistState()
    navigate('/')
  }

  return (
    <header className="home-header">
      <h1 className="home-title"><em>What do you really want?</em></h1>
      <p className="home-description">
        Keep an eye on your progress and consistency
      </p>
      <p className="home-description">
        Don&apos;t be a loser
      </p>
      <p className="home-description">
        Be a winner
      </p>
      <p className="home-description">
        Start now
      </p>
      <button
        className="button button-primary"
        onClick={() => handleGetStarted()}
      >
        Get Started
      </button>
    </header>
  )
}