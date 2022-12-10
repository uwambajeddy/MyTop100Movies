import express from 'express';
import { addMovieToList, findMovieInList, getMovies, getMoviesFromList, removeMovieFromList, updateMovie } from '../controller/moviesController.js';
import { protect } from '../controller/authController.js';

const router = express.Router();

router
    .route('/mylist/')
    .get(protect, getMoviesFromList);
router
    .route('/mylist/:id')
    .get(protect, findMovieInList)
    .patch(protect, updateMovie)
    .delete(protect, removeMovieFromList);

router
    .route('/')
    .get(protect, getMovies)
    .post(protect, addMovieToList);

export default router;
