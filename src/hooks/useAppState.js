import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function useAppState () {
  const [inMemoryState, setInMemoryState] = useState({
    boards: {
      default: {
        id: 'default',
        name: 'Default',
        description: 'Default board',
        log: [
          { id: Date.now(), text: 'Welcome to the default board!' },
          { id: Date.now(), text: 'This is a log item' },
          { id: Date.now(), text: 'This is another log item' },
          { id: Date.now(), text: 'This is a third log item' }
        ]
      }
    }
  })

  const navigate = useNavigate()

  useEffect(() => {
    const appState = localStorage.getItem('appState')

    if (appState) {
      setInMemoryState(JSON.parse(appState))
    } else {
      navigate('/welcome')
    }
  }, [])

  const handlePersistState = () => {
    localStorage.setItem('appState', JSON.stringify(inMemoryState))
  }

  const addBoard = board => {
    setInMemoryState({
      ...inMemoryState,
      boards: {
        ...inMemoryState.boards,
        [board.id]: board
      }
    })
  }

  const updateBoard = board => {
    setInMemoryState({
      ...inMemoryState,
      boards: {
        ...inMemoryState.boards,
        [board.id]: board
      }
    })
  }

  const deleteBoard = boardId => {
    const updatedBoards = { ...inMemoryState.boards }
    delete updatedBoards[boardId]

    setInMemoryState({
      ...inMemoryState,
      boards: updatedBoards
    })
  }

  const appendToBoardLog = (boardId, logItem) => {
    const updatedBoard = { ...inMemoryState.boards[boardId] }
    updatedBoard.log.push(logItem)

    setInMemoryState({
      ...inMemoryState,
      boards: {
        ...inMemoryState.boards,
        [boardId]: updatedBoard
      }
    })
  }

  const deleteFromBoardLog = (boardId, timestamp) => {
    const updatedBoard = { ...inMemoryState.boards[boardId] }
    updatedBoard.log = updatedBoard.log.filter(
      logItem => logItem.id !== timestamp
    )

    setInMemoryState({
      ...inMemoryState,
      boards: {
        ...inMemoryState.boards,
        [boardId]: updatedBoard
      }
    })
  }

  const getLogRangeEvents = (
    boardId,
    start,
    end,
    includeStart = true,
    includeEnd = true
  ) => {
    // return elements <= start and <= end in log with binary search
    const board = inMemoryState.boards[boardId]
    const log = board.log
    let startIndex = 0
    let endIndex = log.length - 1

    while (startIndex < endIndex) {
      const mid = Math.floor((startIndex + endIndex) / 2)
      if (log[mid].timestamp < start) {
        startIndex = mid + 1
      } else {
        endIndex = mid
      }
    }

    const startIdx = includeStart ? startIndex : startIndex + 1

    startIndex = 0
    endIndex = log.length - 1
    while (startIndex < endIndex) {
      const mid = Math.floor((startIndex + endIndex) / 2)
      if (log[mid].timestamp < end) {
        startIndex = mid + 1
      } else {
        endIndex = mid
      }
    }

    const endIdx = includeEnd ? endIndex : endIndex - 1

    return log.slice(startIdx, endIdx + 1)
  }

  useEffect(() => {
    const appState = localStorage.getItem('appState')

    if (appState) {
      setInMemoryState(JSON.parse(appState))
    }
  }, [])

  return {
    inMemoryState,
    _setInMemoryState: setInMemoryState,
    addBoard,
    updateBoard,
    deleteBoard,
    appendToBoardLog,
    deleteFromBoardLog,
    getLogRangeEvents,
    handlePersistState
  }
}
