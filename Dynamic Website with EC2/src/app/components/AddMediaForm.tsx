import { useState } from 'react';
import { Star, X } from 'lucide-react';

interface AddMediaFormProps {
  onSubmit: (media: {
    title: string;
    type: 'book' | 'movie' | 'tv-show' | 'game' | 'album';
    status: 'want-to-consume' | 'consuming' | 'consumed';
    rating: number;
    review: string;
    year: number;
  }) => void;
  onCancel: () => void;
}

export function AddMediaForm({ onSubmit, onCancel }: AddMediaFormProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'book' | 'movie' | 'tv-show' | 'game' | 'album'>('book');
  const [status, setStatus] = useState<'want-to-consume' | 'consuming' | 'consumed'>('want-to-consume');
  const [rating, setRating] = useState(3);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        type,
        status,
        rating,
        review: review.trim(),
        year
      });
    }
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl">Add New Media</h1>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600">Fill in the details below to add a new item to your media tracker.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Enter the title..."
              required
            />
          </div>

          {/* Type Dropdown */}
          <div>
            <label htmlFor="type" className="block mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
              required
            >
              <option value="book">Book</option>
              <option value="movie">Movie</option>
              <option value="tv-show">TV Show</option>
              <option value="game">Game</option>
              <option value="album">Album</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label htmlFor="status" className="block mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
              required
            >
              <option value="want-to-consume">Want to Consume</option>
              <option value="consuming">Currently Consuming</option>
              <option value="consumed">Consumed</option>
            </select>
          </div>

          {/* Rating - Star Selector */}
          <div>
            <label className="block mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {/* Interactive Star Rating */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-gray-600">
                  {rating} / 5
                </span>
              </div>

              {/* Alternative: Slider */}
              <div className="pt-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Year Field */}
          <div>
            <label htmlFor="year" className="block mb-2">
              Year
            </label>
            <input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              min="1900"
              max={new Date().getFullYear() + 5}
            />
          </div>

          {/* Review Text Area */}
          <div>
            <label htmlFor="review" className="block mb-2">
              Review
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-vertical"
              placeholder="Share your thoughts about this media..."
              rows={6}
            />
            <p className="text-sm text-gray-500 mt-2">
              {review.length} characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Helper Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          <span className="text-red-500">*</span> Required fields
        </p>
      </div>
    </div>
  );
}
