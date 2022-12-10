
import moongose from 'mongoose';
import { config } from 'dotenv';
import movieModel from '../model/movie.js';
import userModel from '../model/user.js';

config({ path: '.env' });

const DB_TEST = process.env.DATABASE_TEST.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

moongose.connect(DB_TEST).then(() => console.log('Test DB connected successful !'));

beforeEach(done => {
    userModel.deleteMany({}, function (err) { });
    movieModel.deleteMany({}, function (err) { });
    done();
});

afterEach(done => {
    userModel.deleteMany({}, function (err) { });
    movieModel.deleteMany({}, function (err) { });
    done();
});
