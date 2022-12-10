import moongose from 'mongoose';
import "dotenv/config";

import app from './app.js';

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message, err.stack);
    process.exit(1);
});

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

moongose.connect(DB).then(() => console.log('DB connected successful !!'));

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
