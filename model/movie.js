import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const movieSchema = new Schema({
    movie_id: {
        type: Number,
        required: [true, 'Please! provide movie id.'],
        unique: true
    },
    rank: {
        type: Number,
        required: [true, 'Please! provide rank number'],
        unique: true,
    },
    title: {
        type: String
    },
    original_language: {
        type: String
    },
    overview: {
        type: String
    },
    status: {
        type: String
    },
    tagline: {
        type: String
    },
    popularity: {
        type: Number
    },
    release_date: {
        type: String
    },
    vote_average: {
        type: Number
    },
    vote_count: {
        type: Number
    },
    spoken_languages: {
        type: Array
    },
    production_countries: {
        type: Array
    },
    production_companies: {
        type: Array
    },
    imdb_id: {
        type: String
    },
    genres: {
        type: Array
    },

});

const Movie = model('Movie', movieSchema);

export default Movie;
