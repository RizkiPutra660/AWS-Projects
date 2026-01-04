import { useState } from 'react';
import { MediaCard } from './components/MediaCard';
import { AddMediaForm } from './components/AddMediaForm';
import { MediaDetail } from './components/MediaDetail';
import { Plus } from 'lucide-react';

interface Media {
  id: number;
  title: string;
  type: 'book' | 'movie' | 'game' | 'tv-show' | 'album';
  cover: string;
  rating: number;
  status: 'want-to-consume' | 'consuming' | 'consumed';
  year: number;
  review?: string;
}

const initialMedia: Media[] = [
  {
    id: 1,
    title: 'The Great Gatsby',
    type: 'book',
    cover: 'https://images.unsplash.com/photo-1673733275314-a1679f007bc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjByZWFkaW5nfGVufDF8fHx8MTc2NzU2MTYxNHww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 5,
    status: 'consumed',
    year: 2024,
    review: 'A masterpiece of American literature. Fitzgerald\'s prose is absolutely beautiful, and the critique of the American Dream remains relevant today. The symbolism throughout the book adds layers of meaning that reveal themselves on repeated readings.'
  },
  {
    id: 2,
    title: 'Inception',
    type: 'movie',
    cover: 'https://images.unsplash.com/photo-1659497379075-a807be116f74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMGNpbmVtYSUyMGZpbG18ZW58MXx8fHwxNzY3NTYxNjE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 5,
    status: 'consumed',
    year: 2024,
    review: 'Christopher Nolan at his best. The concept is mind-bending and executed perfectly. The practical effects are incredible, and Hans Zimmer\'s score elevates every scene. One of those movies that demands multiple viewings.'
  },
  {
    id: 3,
    title: 'The Legend of Zelda',
    type: 'game',
    cover: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBjb250cm9sbGVyfGVufDF8fHx8MTc2NzQ4NDY0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 5,
    status: 'consuming',
    year: 2024
  },
  {
    id: 4,
    title: '1984',
    type: 'book',
    cover: 'https://images.unsplash.com/photo-1633099158362-17b8ba5b27db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYm9va3MlMjBzdGFja3xlbnwxfHx8fDE3Njc1MjQzNDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4,
    status: 'consuming',
    year: 2025
  },
  {
    id: 5,
    title: 'Breaking Bad',
    type: 'tv-show',
    cover: 'https://images.unsplash.com/photo-1659497379075-a807be116f74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMGNpbmVtYSUyMGZpbG18ZW58MXx8fHwxNzY3NTYxNjE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 5,
    status: 'consumed',
    year: 2024,
    review: 'Simply the best television series ever made. The character development of Walter White is phenomenal. Every season builds perfectly on the last, and the final season is absolutely gripping. Bryan Cranston\'s performance is unforgettable.'
  },
  {
    id: 6,
    title: 'Red Dead Redemption 2',
    type: 'game',
    cover: 'https://images.unsplash.com/photo-1604846887565-640d2f52d564?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb25zb2xlfGVufDF8fHx8MTc2NzQ2ODE4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 5,
    status: 'want-to-consume',
    year: 2025
  },
  {
    id: 7,
    title: 'Dark Side of the Moon',
    type: 'album',
    cover: 'https://images.unsplash.com/photo-1572091574819-ea8bb5394b1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwbm92ZWxzfGVufDF8fHx8MTc2NzU2MTYxNnww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 5,
    status: 'consumed',
    year: 2024
  },
  {
    id: 8,
    title: 'Interstellar',
    type: 'movie',
    cover: 'https://images.unsplash.com/photo-1697238724718-29cc8b1a2340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtJTIwY2FtZXJhJTIwdmludGFnZXxlbnwxfHx8fDE3Njc1NDUyNTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 5,
    status: 'consuming',
    year: 2025
  },
  {
    id: 9,
    title: 'Cyberpunk 2077',
    type: 'game',
    cover: 'https://images.unsplash.com/photo-1636914011676-039d36b73765?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYyUyMGdhbWluZyUyMHNldHVwfGVufDF8fHx8MTc2NzUwMzY3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4,
    status: 'consumed',
    year: 2024
  },
  {
    id: 10,
    title: 'The Hobbit',
    type: 'book',
    cover: 'https://images.unsplash.com/photo-1633099158362-17b8ba5b27db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYm9va3MlMjBzdGFja3xlbnwxfHx8fDE3Njc1MjQzNDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 5,
    status: 'want-to-consume',
    year: 2025
  },
  {
    id: 11,
    title: 'The Dark Knight',
    type: 'movie',
    cover: 'https://images.unsplash.com/photo-1659497379075-a807be116f74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjByZWVsfGVufDF8fHx8MTc2NzU2MTYxNnww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 5,
    status: 'consumed',
    year: 2024
  },
  {
    id: 12,
    title: 'Elden Ring',
    type: 'game',
    cover: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBjb250cm9sbGVyfGVufDF8fHx8MTc2NzQ4NDY0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4,
    status: 'consuming',
    year: 2025
  }
];

export default function App() {
  const [mediaList, setMediaList] = useState<Media[]>(initialMedia);
  const [showForm, setShowForm] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  const handleAddMedia = (newMedia: Omit<Media, 'id' | 'cover'>) => {
    const placeholderCovers = {
      book: 'https://images.unsplash.com/photo-1633099158362-17b8ba5b27db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYm9va3MlMjBzdGFja3xlbnwxfHx8fDE3Njc1MjQzNDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      movie: 'https://images.unsplash.com/photo-1659497379075-a807be116f74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjByZWVsfGVufDF8fHx8MTc2NzU2MTYxNnww&ixlib=rb-4.1.0&q=80&w=1080',
      'tv-show': 'https://images.unsplash.com/photo-1659497379075-a807be116f74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMGNpbmVtYSUyMGZpbG18ZW58MXx8fHwxNzY3NTYxNjE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      game: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBjb250cm9sbGVyfGVufDF8fHx8MTc2NzQ4NDY0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      album: 'https://images.unsplash.com/photo-1572091574819-ea8bb5394b1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwbm92ZWxzfGVufDF8fHx8MTc2NzU2MTYxNnww&ixlib=rb-4.1.0&q=80&w=1080'
    };

    const media: Media = {
      ...newMedia,
      id: Math.max(...mediaList.map(m => m.id), 0) + 1,
      cover: placeholderCovers[newMedia.type]
    };

    setMediaList([media, ...mediaList]);
    setShowForm(false);
  };

  const handleView = (id: number) => {
    const media = mediaList.find(m => m.id === id);
    if (media) {
      setSelectedMedia(media);
    }
  };

  const handleEdit = (id: number) => {
    const media = mediaList.find(m => m.id === id);
    if (media) {
      alert(`Edit functionality for "${media.title}" would open here.`);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setMediaList(mediaList.filter(m => m.id !== id));
    }
  };

  // Show form page when adding new media
  if (showForm) {
    return (
      <AddMediaForm
        onSubmit={handleAddMedia}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  // Show detail page when viewing media
  if (selectedMedia) {
    return (
      <MediaDetail
        media={selectedMedia}
        onBack={() => setSelectedMedia(null)}
        onEdit={handleEdit}
      />
    );
  }

  // Main dashboard view
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl">Media Tracker</h1>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add New
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mediaList.map((media) => (
            <MediaCard
              key={media.id}
              {...media}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {mediaList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No media found. Click "Add New" to get started!</p>
          </div>
        )}
      </main>
    </div>
  );
}