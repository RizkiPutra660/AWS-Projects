import { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';

interface AddMediaFormProps {
  onSubmit: (media: {
    title: string;
    type: 'book' | 'movie' | 'game';
    status: 'want-to-read' | 'reading' | 'read' | 'want-to-watch' | 'watching' | 'watched' | 'want-to-play' | 'playing' | 'played';
    rating: number;
    review: string;
    year: number;
    cover: string;
  }) => void;
  onCancel: () => void;
  initialData?: {
    title: string;
    type: 'book' | 'movie' | 'game';
    status: 'want-to-read' | 'reading' | 'read' | 'want-to-watch' | 'watching' | 'watched' | 'want-to-play' | 'playing' | 'played';
    rating: number;
    review?: string;
    year: number;
    cover?: string;
  };
}

export function AddMediaForm({ onSubmit, onCancel, initialData }: AddMediaFormProps) {
  const DEFAULT_COVER_IMAGE = 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=300&h=450&fit=crop';
  
  const [title, setTitle] = useState(initialData?.title || '');
  const [type, setType] = useState<'book' | 'movie' | 'game'>(initialData?.type || 'book');
  const [status, setStatus] = useState<'want-to-read' | 'reading' | 'read' | 'want-to-watch' | 'watching' | 'watched' | 'want-to-play' | 'playing' | 'played'>(initialData?.status || 'want-to-read');
  const [rating, setRating] = useState(initialData?.rating || 3);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState(initialData?.review || '');
  const [year, setYear] = useState(initialData?.year || new Date().getFullYear());
  const [cover, setCover] = useState(initialData?.cover || '');
  const isEditing = !!initialData;

  // Update form fields when initialData changes (for editing)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setType(initialData.type);
      setStatus(initialData.status);
      setRating(initialData.rating);
      setReview(initialData.review || '');
      setYear(initialData.year);
      setCover(initialData.cover || '');
    }
  }, [initialData]);

  // Get status options based on media type
  const getStatusOptions = () => {
    switch (type) {
      case 'book':
        return [
          { value: 'want-to-read', label: 'Want to Read' },
          { value: 'reading', label: 'Currently Reading' },
          { value: 'read', label: 'Read' }
        ];
      case 'movie':
        return [
          { value: 'want-to-watch', label: 'Want to Watch' },
          { value: 'watching', label: 'Currently Watching' },
          { value: 'watched', label: 'Watched' }
        ];
      case 'game':
        return [
          { value: 'want-to-play', label: 'Want to Play' },
          { value: 'playing', label: 'Currently Playing' },
          { value: 'played', label: 'Played' }
        ];
      default:
        return [];
    }
  };

  // Reset status when type changes
  const handleTypeChange = (newType: 'book' | 'movie' | 'game') => {
    setType(newType);
    if (newType === 'book') setStatus('want-to-read');
    else if (newType === 'movie') setStatus('want-to-watch');
    else if (newType === 'game') setStatus('want-to-play');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        type,
        status,
        rating,
        review: review.trim(),
        year,
        cover: cover.trim() || DEFAULT_COVER_IMAGE
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
            <h1 className="text-3xl">{isEditing ? 'Edit Media' : 'Add New Media'}</h1>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600">{isEditing ? 'Update the details below to edit this media.' : 'Fill in the details below to add a new item to your media tracker.'}</p>
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
              onChange={(e) => handleTypeChange(e.target.value as 'book' | 'movie' | 'game')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
              required
            >
              <option value="book">Book</option>
              <option value="movie">Movie</option>
              <option value="game">Game</option>
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
              {getStatusOptions().map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Rating - Star Selector */}
          <div>
            <label className="block mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
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

          {/* Cover URL Field */}
          <div>
            <label htmlFor="cover" className="block mb-2">
              Cover Image URL <span className="text-gray-500 text-sm">(optional)</span>
            </label>
            <input
              id="cover"
              type="url"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="https://example.com/cover.jpg"
            />
            {/* Cover Preview */}
            <div className="mt-3 w-32 h-48 rounded-lg overflow-hidden border border-gray-300">
              <img 
                src={cover || DEFAULT_COVER_IMAGE} 
                alt="Cover preview" 
                className="w-full h-full object-cover" 
              />
            </div>
            {!cover && <p className="text-xs text-gray-500 mt-2">Using default placeholder image</p>}
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
              {isEditing ? 'Update' : 'Submit'}
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
