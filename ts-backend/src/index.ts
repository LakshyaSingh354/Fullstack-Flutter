import express, { Express } from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes/routes';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const app: Express = express();
const server  = http.createServer(app);

// Express configuration
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('PORT', 3000);
app.set("BASE_URL", "localhost");

dotenv.config();

// Define the Routes

app.use('/api/v1', router);

// MongoDB Connection

const mongoURI = process.env.MONGO_DB_URI;
if (!mongoURI) {
    console.error("MongoDB URI is not defined");
    process.exit(1);
}
mongoose.connect(mongoURI, {}).then(() => {
    console.log("MongoDB is connected");
})
.catch((error) => {
    console.error("MongoDB connection failed", error);
});

// Start the server

try {
    const port: Number = app.get('PORT');
    const baseUrl: String = app.get('BASE_URL');
    server.listen(port, () => {
        console.log(`Server is running at ${baseUrl}:${port}`);
    });
} catch (error) {
    console.error(error);
}

export default server;