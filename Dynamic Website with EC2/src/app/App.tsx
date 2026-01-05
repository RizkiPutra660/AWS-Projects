import { useState, useEffect } from 'react';
import { MediaCard } from './components/MediaCard';
import { AddMediaForm } from './components/AddMediaForm';
import { MediaDetail } from './components/MediaDetail';
import { Plus, Loader } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './components/ui/alert-dialog';

// API endpoint
const API_URL = 'http://localhost:5000/api/media';

interface Media {
  id: string;
  title: string;
  type: 'book' | 'movie' | 'game';
  cover: string;
  rating: number;
  status: 'want-to-read' | 'reading' | 'read' | 'want-to-watch' | 'watching' | 'watched' | 'want-to-play' | 'playing' | 'played';
  year: number;
  review?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function App() {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<Media | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch media from backend on component mount
  useEffect(() => {
    fetchMediaList();
  }, []);

  const fetchMediaList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch media');
      const data = await response.json();
      setMediaList(data.data || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load media';
      setError(errorMsg);
      console.error('Error fetching media:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMedia = async (newMedia: Omit<Media, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMedia)
      });
      if (!response.ok) throw new Error('Failed to create media');
      await fetchMediaList();
      setShowForm(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add media';
      setError(errorMsg);
      console.error('Error adding media:', err);
    }
  };

  const handleView = (id: string) => {
    const media = mediaList.find(m => m.id === id);
    if (media) {
      setSelectedMedia(media);
    }
  };

  const handleEdit = (id: string) => {
    const media = mediaList.find(m => m.id === id);
    if (media) {
      setEditingMedia(media);
      setShowForm(true);
    }
  };

  const handleUpdateMedia = async (updatedData: Omit<Media, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingMedia) return;
    try {
      setError(null);
      const response = await fetch(`${API_URL}/${editingMedia.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (!response.ok) throw new Error('Failed to update media');
      await fetchMediaList();
      setEditingMedia(null);
      setShowForm(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update media';
      setError(errorMsg);
      console.error('Error updating media:', err);
    }
  };

  const handleDelete = (id: string) => {
    const media = mediaList.find(m => m.id === id);
    if (media) {
      setMediaToDelete(media);
      setDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!mediaToDelete) return;
    try {
      setError(null);
      const response = await fetch(`${API_URL}/${mediaToDelete.id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete media');
      await fetchMediaList();
      setDeleteConfirmOpen(false);
      setMediaToDelete(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete media';
      setError(errorMsg);
      console.error('Error deleting media:', err);
    }
  };

  // Get category counts
  const getCategoryCount = (category: string) => {
    if (category === 'all') return mediaList.length;
    if (category === 'books') return mediaList.filter(m => m.type === 'book').length;
    if (category === 'movies') return mediaList.filter(m => m.type === 'movie').length;
    if (category === 'games') return mediaList.filter(m => m.type === 'game').length;
    return 0;
  };

  // Filter media based on selected category
  const getFilteredMedia = () => {
    if (selectedFilter === 'all') return mediaList;
    if (selectedFilter === 'books') return mediaList.filter(m => m.type === 'book');
    if (selectedFilter === 'movies') return mediaList.filter(m => m.type === 'movie');
    if (selectedFilter === 'games') return mediaList.filter(m => m.type === 'game');
    return mediaList;
  };

  // Show form page when adding new media or editing
  if (showForm) {
    return (
      <AddMediaForm
        onSubmit={editingMedia ? handleUpdateMedia : handleAddMedia}
        onCancel={() => {
          setShowForm(false);
          setEditingMedia(null);
        }}
        initialData={editingMedia || undefined}
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
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-gray-600">Loading media...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800"><strong>Error:</strong> {error}</p>
            <button
              onClick={fetchMediaList}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Category Filter */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h2>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'books', label: 'Books' },
                  { id: 'movies', label: 'Movies' },
                  { id: 'games', label: 'Games' }
                ].map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedFilter(category.id)}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                      selectedFilter === category.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {category.label}
                    <span className="ml-2 text-sm font-normal">
                      ({getCategoryCount(category.id)})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {getFilteredMedia().map((media) => (
                <MediaCard
                  key={media.id}
                  {...media}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {getFilteredMedia().length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No media found in this category. Click "Add New" to get started!</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold text-gray-900">"{mediaToDelete?.title}"</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}