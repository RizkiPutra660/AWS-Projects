import { getDatabase } from './db.js';
import { v4 as uuidv4 } from 'uuid';

export interface Media {
  id: string;
  title: string;
  type: 'book' | 'movie' | 'game' | 'tv-show' | 'album';
  cover: string;
  rating: number;
  status: 'want-to-consume' | 'consuming' | 'consumed';
  year: number;
  review?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Create a new media item
export const createMedia = (media: Omit<Media, 'id' | 'createdAt' | 'updatedAt'>): Promise<Media> => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const id = uuidv4();
    const now = new Date().toISOString();

    const query = `
      INSERT INTO media (id, title, type, status, rating, year, review, cover, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
      query,
      [
        id,
        media.title,
        media.type,
        media.status,
        media.rating,
        media.year || new Date().getFullYear(),
        media.review || '',
        media.cover,
        now,
        now
      ],
      (err: Error | null) => {
        if (err) {
          console.error('Error creating media:', err);
          reject(err);
        } else {
          resolve({
            ...media,
            id,
            createdAt: now,
            updatedAt: now
          });
        }
      }
    );
  });
};

// Get all media items
export const getAllMedia = (): Promise<Media[]> => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const query = `SELECT * FROM media ORDER BY createdAt DESC`;

    db.all(query, [], (err: Error | null, rows: Media[] | undefined) => {
      if (err) {
        console.error('Error fetching media:', err);
        reject(err);
      } else {
        resolve((rows as Media[]) || []);
      }
    });
  });
};

// Get media by ID
export const getMediaById = (id: string): Promise<Media | null> => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const query = `SELECT * FROM media WHERE id = ?`;

    db.get(query, [id], (err: Error | null, row: Media | undefined) => {
      if (err) {
        console.error('Error fetching media by ID:', err);
        reject(err);
      } else {
        resolve((row as Media | undefined) || null);
      }
    });
  });
};

// Update media
export const updateMedia = (id: string, updates: Partial<Omit<Media, 'id' | 'createdAt'>>): Promise<Media> => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const now = new Date().toISOString();
    const updateFields = { ...updates, updatedAt: now };

    // Build dynamic query
    const keys = Object.keys(updateFields);
    const values = Object.values(updateFields);
    values.push(id);

    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const query = `UPDATE media SET ${setClause} WHERE id = ?`;

    db.run(query, values, function(err: Error | null) {
      if (err) {
        console.error('Error updating media:', err);
        reject(err);
      } else if (this.changes === 0) {
        reject(new Error('Media not found'));
      } else {
        // Fetch and return updated item
        getMediaById(id)
          .then(media => {
            if (media) {
              resolve(media);
            } else {
              reject(new Error('Failed to fetch updated media'));
            }
          })
          .catch(reject);
      }
    });
  });
};

// Delete media
export const deleteMedia = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const query = `DELETE FROM media WHERE id = ?`;

    db.run(query, [id], function(err: Error | null) {
      if (err) {
        console.error('Error deleting media:', err);
        reject(err);
      } else if (this.changes === 0) {
        reject(new Error('Media not found'));
      } else {
        resolve();
      }
    });
  });
};
