import { Star, Clock, Eye, Edit, Trash2 } from 'lucide-react';

interface MediaCardProps {
  id: string;
  title: string;
  type: 'book' | 'movie' | 'game';
  cover: string;
  rating: number;
  status: 'want-to-read' | 'reading' | 'read' | 'want-to-watch' | 'watching' | 'watched' | 'want-to-play' | 'playing' | 'played';
  year?: number;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MediaCard({ id, title, type, cover, rating, status, year, onView, onEdit, onDelete }: MediaCardProps) {
  const getStatusColor = () => {
    if (status.includes('want-to')) return 'bg-gray-100 text-gray-700';
    if (status === 'read' || status === 'watched' || status === 'played') return 'bg-green-100 text-green-700';
    return 'bg-blue-100 text-blue-700'; // reading, watching, playing
  };

  const getStatusLabel = () => {
    const statusMap: Record<string, string> = {
      'want-to-read': 'Want to Read',
      'reading': 'Currently Reading',
      'read': 'Read',
      'want-to-watch': 'Want to Watch',
      'watching': 'Currently Watching',
      'watched': 'Watched',
      'want-to-play': 'Want to Play',
      'playing': 'Currently Playing',
      'played': 'Played'
    };
    return statusMap[status] || status;
  };

  const typeLabels = {
    book: 'Book',
    movie: 'Movie',
    game: 'Game'
  };

  const typeColors = {
    book: 'bg-purple-100 text-purple-700',
    movie: 'bg-orange-100 text-orange-700',
    game: 'bg-teal-100 text-teal-700'
  };

  // Render star rating
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col">
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
        <img 
          src={cover} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs ${typeColors[type]}`}>
            {typeLabels[type]}
          </span>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 className="line-clamp-2 mb-3 min-h-[3rem]">{title}</h3>
        
        <div className="space-y-3 mb-4">
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs ${getStatusColor()}`}>
              {getStatusLabel()}
            </span>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-1">
            {renderStars()}
          </div>

          {/* Year */}
          {year && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{year}</span>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onView(id)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={() => onEdit(id)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(id)}
            className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}