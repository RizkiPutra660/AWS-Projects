import express, { Request, Response } from 'express';
import { 
  createMedia, 
  getAllMedia, 
  getMediaById, 
  updateMedia, 
  deleteMedia 
} from './mediaService.js';

const router = express.Router();

// POST /api/media - Create new media
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, type, status, rating, year, review, cover } = req.body;

    // Validation
    if (!title || !type || !status || !rating || !cover) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, type, status, rating, cover' 
      });
    }

    const media = await createMedia({
      title,
      type,
      status,
      rating,
      year,
      review,
      cover
    });

    res.status(201).json({
      message: 'Media created successfully',
      data: media
    });
  } catch (error) {
    console.error('Error in POST /api/media:', error);
    res.status(500).json({ 
      error: 'Failed to create media',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/media - Get all media
router.get('/', async (req: Request, res: Response) => {
  try {
    const media = await getAllMedia();
    res.json({
      message: 'Media retrieved successfully',
      count: media.length,
      data: media
    });
  } catch (error) {
    console.error('Error in GET /api/media:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve media',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/media/:id - Get media by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Media ID is required' });
    }

    const media = await getMediaById(id);

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    res.json({
      message: 'Media retrieved successfully',
      data: media
    });
  } catch (error) {
    console.error('Error in GET /api/media/:id:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve media',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/media/:id - Update media
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Media ID is required' });
    }

    const media = await updateMedia(id, updates);

    res.json({
      message: 'Media updated successfully',
      data: media
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Media not found') {
      return res.status(404).json({ error: 'Media not found' });
    }
    console.error('Error in PUT /api/media/:id:', error);
    res.status(500).json({ 
      error: 'Failed to update media',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/media/:id - Delete media
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Media ID is required' });
    }

    await deleteMedia(id);

    res.json({
      message: 'Media deleted successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Media not found') {
      return res.status(404).json({ error: 'Media not found' });
    }
    console.error('Error in DELETE /api/media/:id:', error);
    res.status(500).json({ 
      error: 'Failed to delete media',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
