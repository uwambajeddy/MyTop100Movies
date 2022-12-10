import axios from 'axios';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import movieModal from '../model/movie.js';

const movieExists = async (id) => {
    try {

        const movie = await axios.get(`${process.env.BASE_URL}movie/${id}?api_key=${process.env.API_KEY}`);
        if (movie.success == false) return false;
        return movie;
    } catch (err) {
        return false;
    }

}

export const getMovies = catchAsync(async (req, res, next) => {
    const { page } = req.query;
    const movies = await axios.get(`${process.env.API_URL}&page=${page}`);
    res.status(200).json({
        status: 'success',
        data: movies.data
    });
});
export const getMoviesFromList = catchAsync(async (req, res, next) => {
    const movies = await movieModal.find().sort({ rank: "ascending" }).select('-_id');
    res.status(200).json({
        status: 'success',
        results: movies.length,
        data: {
            movies
        }
    });
});

export const findMovieInList = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const movie = await movieModal.find({ movie_id: id }).select('-_id');
    if (!movie.length) {
        return next(new AppError('No Movie found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            movie
        }
    });
});

export const removeMovieFromList = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const movie = await movieModal.deleteOne({ movie_id: id });

    if (!movie) {
        return next(new AppError('No movie found with that ID', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
});

export const addMovieToList = catchAsync(async (req, res, next) => {
    let movie = await movieExists(req.body.movie_id);
    if (!movie) return next(new AppError('No Movie found with that ID', 404));
    if (req.body.rank && req.body.rank > 0 && req.body.rank <= 100) {
        movie.data.movie_id = req.body.movie_id;
        movie.data.rank = req.body.rank;

        const create_movie = await movieModal.create(movie.data);
        res.status(201).json({
            status: 'success',
            data: create_movie
        });
    } else {
        return next(new AppError('Rank range is 1 to 100', 422));
    }

});

export const updateMovie = catchAsync(async (req, res, next) => {

    let movie = await movieModal.findOneAndUpdate({ movie_id: req.params.id }, { rank: req.body.rank });

    if (!movie) return next(new AppError('No Movie found with that ID', 404));

    res.status(200).json({
        status: 'success',
        data: "Rank updated successfully",
    });




});