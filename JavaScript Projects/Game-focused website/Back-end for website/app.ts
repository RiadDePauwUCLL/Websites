import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { gameRouter } from './routes/games-router';

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API for The Games Library app',
            version: '1.0.0',
        },
    },
    apis: ['./routes/*.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOpts);

app.use(cors());
app.use(bodyParser.json());
app.use('/games', gameRouter);

app.get('/status', (req, res) => {
    res.json({ message: 'The Games Library is running...' });
});

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port || 3000, () => {
    console.log(`Server is running on port ${port}.`);
});
