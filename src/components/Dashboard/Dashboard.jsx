import { useState } from 'react';
import { PencilIcon, TrashIcon, XIcon, CalendarIcon } from 'lucide-react';
import useAppState from '../../hooks/useAppState';
import Heatmap from '../Heatmap/Heatmap';
import './Dashboard.css';

const Dashboard = () => {
  const { inMemoryState, _setInMemoryState, handlePersistState } = useAppState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentBoard, setCurrentBoard] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eventName: 'Event',
    confirmRequired: true
  });
  const [eventData, setEventData] = useState({ note: '' });

  const handleOpenModal = (mode, board = null) => {
    setModalMode(mode);
    setCurrentBoard(board);
    setFormData(board ? {
      ...board,
      eventName: board.eventName || 'Event',
      confirmRequired: board.confirmRequired !== false
    } : {
      name: '',
      description: '',
      eventName: 'Event',
      confirmRequired: true
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentBoard(null);
    setFormData({ name: '', description: '', eventName: 'Event', confirmRequired: true });
  };

  const handleOpenEventModal = (board) => {
    setCurrentBoard(board);
    setEventData({ note: '' });
    setIsEventModalOpen(true);
  };

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
    setCurrentBoard(null);
    setEventData({ note: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const board = {
      id: currentBoard?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      eventName: formData.eventName,
      confirmRequired: formData.confirmRequired,
      log: currentBoard?.log || []
    };

    const updatedBoards = {
      ...inMemoryState.boards,
      [board.id]: board
    };

    _setInMemoryState({
      ...inMemoryState,
      boards: updatedBoards
    });

    handlePersistState();
    handleCloseModal();
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();

    const board = inMemoryState.boards[currentBoard.id];
    const updatedBoard = {
      ...board,
      log: [...board.log, {
        timestamp: Date.now(),
        note: eventData.note.trim() || `${board.eventName} recorded`
      }]
    };

    _setInMemoryState({
      ...inMemoryState,
      boards: {
        ...inMemoryState.boards,
        [board.id]: updatedBoard
      }
    });

    handlePersistState();
    handleCloseEventModal();
  };

  const handleQuickAdd = (board) => {
    if (board.confirmRequired) {
      handleOpenEventModal(board);
    } else {
      const updatedBoard = {
        ...board,
        log: [...board.log, {
          timestamp: Date.now(),
          note: `${board.eventName} recorded`
        }]
      };

      _setInMemoryState({
        ...inMemoryState,
        boards: {
          ...inMemoryState.boards,
          [board.id]: updatedBoard
        }
      });

      handlePersistState();
    }
  };

  const handleDeleteBoard = (boardId) => {
    if (window.confirm('Are you sure you want to delete this tracker? This action cannot be undone.')) {
      const updatedBoards = { ...inMemoryState.boards };
      delete updatedBoards[boardId];

      _setInMemoryState({
        ...inMemoryState,
        boards: updatedBoards
      });

      handlePersistState();
    }
  };

  return (
    <div className="home-container">
      <div className="boards-grid">
        {Object.values(inMemoryState.boards).map((board) => (
          <div key={board.id} className="board-card">
            <div className="board-header">
              <div className="board-header-info">
                <h2 className="board-title">{board.name}</h2>
                {board.description && (
                  <p className="board-description">{board.description}</p>
                )}
              </div>
              <div className="board-actions">
                <button
                  className="icon-button"
                  onClick={() => handleOpenModal('edit', board)}
                  title="Edit tracker"
                >
                  <PencilIcon size={16} />
                </button>
                <button
                  className="icon-button icon-button-danger"
                  onClick={() => handleDeleteBoard(board.id)}
                  title="Delete tracker"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>

            <Heatmap boardId={board.id} inMemoryState={inMemoryState} />

            <div className="quick-add">
              <button
                className="button button-primary flex-1"
                onClick={() => handleQuickAdd(board)}
              >
                <CalendarIcon size={16} className="button-icon" />
                Record {board.eventName}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {modalMode === 'create' ? 'Create New Tracker' : 'Edit Tracker'}
              </h2>
              <button
                className="icon-button"
                onClick={handleCloseModal}
              >
                <XIcon size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Morning Run"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What are you tracking?"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Event Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                  placeholder="e.g., Run"
                  required
                />
                <small className="form-help">
                  This will be used in the &quot;Record [Event]&quot; button
                </small>
              </div>

              <div className="form-group">
                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.confirmRequired}
                    onChange={(e) => setFormData({ ...formData, confirmRequired: e.target.checked })}
                  />
                  <span>Require confirmation when recording events</span>
                </label>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button button-primary"
                >
                  {modalMode === 'create' ? 'Create Tracker' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {isEventModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Record {currentBoard.eventName}</h2>
              <button
                className="icon-button"
                onClick={handleCloseEventModal}
              >
                <XIcon size={16} />
              </button>
            </div>

            <form onSubmit={handleEventSubmit}>
              <div className="form-group">
                <label className="form-label">Note (optional)</label>
                <textarea
                  className="form-input"
                  value={eventData.note}
                  onChange={(e) => setEventData({ ...eventData, note: e.target.value })}
                  placeholder="Add details about this event..."
                  rows={3}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleCloseEventModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button button-primary"
                >
                  Record Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;