import { Star, ArrowLeft, Edit } from 'lucide-react';

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

interface MediaDetailProps {
  media: Media;
  onBack: () => void;
  onEdit: (id: number) => void;
}

export function MediaDetail({ media, onBack, onEdit }: MediaDetailProps) {
  const typeLabels = {
    book: 'Book',
    movie: 'Movie',
    'tv-show': 'TV Show',
    game: 'Game',
    album: 'Album'
  };

  const statusLabels = {
    'consumed': 'Consumed',
    'consuming': 'Currently Consuming',
    'want-to-consume': 'Want to Consume'
  };

  // Render star rating
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-6 h-6 ${
            i <= media.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <h1 className="text-2xl">Media Tracker</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header Section with Cover Image */}
          <div className="relative h-64 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <img 
                src={media.cover} 
                alt={media.title}
                className="w-full h-full object-cover blur-sm"
              />
            </div>
            <div className="relative h-full flex items-center px-8">
              <div className="w-40 h-56 rounded-lg overflow-hidden shadow-xl border-4 border-white">
                <img 
                  src={media.cover} 
                  alt={media.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-8 flex-1">
                <h1 className="text-4xl mb-2">{media.title}</h1>
                <p className="text-gray-600">Added in {media.year}</p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8">
            {/* Information Table */}
            <div className="mb-8">
              <h2 className="text-xl mb-4">Details</h2>
              <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                {/* Type Row */}
                <div className="grid grid-cols-3 border-b border-gray-200">
                  <div className="px-6 py-4 bg-gray-100">
                    <span className="text-sm text-gray-600">Type</span>
                  </div>
                  <div className="col-span-2 px-6 py-4 bg-white">
                    <span>{typeLabels[media.type]}</span>
                  </div>
                </div>

                {/* Status Row */}
                <div className="grid grid-cols-3 border-b border-gray-200">
                  <div className="px-6 py-4 bg-gray-100">
                    <span className="text-sm text-gray-600">Status</span>
                  </div>
                  <div className="col-span-2 px-6 py-4 bg-white">
                    <span>{statusLabels[media.status]}</span>
                  </div>
                </div>

                {/* Rating Row */}
                <div className="grid grid-cols-3">
                  <div className="px-6 py-4 bg-gray-100">
                    <span className="text-sm text-gray-600">Rating</span>
                  </div>
                  <div className="col-span-2 px-6 py-4 bg-white">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {renderStars()}
                      </div>
                      <span className="text-gray-600 ml-2">
                        ({media.rating} out of 5)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Section */}
            <div className="mb-8">
              <h2 className="text-xl mb-4">My Review</h2>
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 min-h-[200px]">
                {media.review ? (
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {media.review}
                  </p>
                ) : (
                  <p className="text-gray-400 italic">
                    No review written yet. Click the "Edit" button to add your thoughts about this {typeLabels[media.type].toLowerCase()}.
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={onBack}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to List
              </button>
              <button
                onClick={() => onEdit(media.id)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
              >
                <Edit className="w-5 h-5" />
                Edit
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
