import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface AddMediaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (media: {
    title: string;
    type: 'book' | 'movie' | 'game';
    rating: number;
    status: 'want-to-consume' | 'consuming' | 'consumed';
    year: number;
  }) => void;
}

export function AddMediaDialog({ isOpen, onClose, onAdd }: AddMediaDialogProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'book' | 'movie' | 'game'>('book');
  const [rating, setRating] = useState(3);
  const [status, setStatus] = useState<'want-to-consume' | 'consuming' | 'consumed'>('want-to-consume');
  const [year, setYear] = useState(new Date().getFullYear());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({ title, type, rating, status, year });
      setTitle('');
      setType('book');
      setRating(3);
      setStatus('want-to-consume');
      setYear(new Date().getFullYear());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl">Add New Media</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Type</label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="book"
                  checked={type === 'book'}
                  onChange={(e) => setType(e.target.value as 'book' | 'movie' | 'game')}
                  className="mr-2"
                />
                Book
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="movie"
                  checked={type === 'movie'}
                  onChange={(e) => setType(e.target.value as 'book' | 'movie' | 'game')}
                  className="mr-2"
                />
                Movie
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="game"
                  checked={type === 'game'}
                  onChange={(e) => setType(e.target.value as 'book' | 'movie' | 'game')}
                  className="mr-2"
                />
                Game
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="want-to-consume">Want to Consume</option>
              <option value="consuming">Consuming</option>
              <option value="consumed">Consumed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Rating: {rating}/5</label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1900"
              max={new Date().getFullYear() + 5}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Media
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}