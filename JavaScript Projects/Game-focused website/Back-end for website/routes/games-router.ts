/**
 * @swagger
 *   components:
 *    schemas:
 *      Game:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *              description: Game name.
 *            type:
 *              type: string
 *              description: Game type.
 *            rating:
 *              type: number
 *              description: Game rating.
 *            isFavourite:
 *              type: boolean
 *              description: Flag showing whether game is favourited or not. 
 *
 */
import express, { Request, Response } from 'express';
import { handle } from '../helpers/response-helper';
import { CustomError } from '../model/custom-error';
import * as gameModel from '../model/game';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "SomeSuperSecretPassword554433!";
const gameRouter = express.Router();

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Get a list of all games
 *     responses:
 *       200:
 *         description: A list of games.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 */
gameRouter.get('/', (req: Request, res: Response) => {
    handle(() => {
        const { query } = req.query;
        return gameModel.getAllGames(query as string);
    }, res);
});

/**
 * @swagger
 * /games:
 *   get:
 *      summary: Get a game by it's name
 *      responses:
 *         200:
 *            description: The ID of the game
 *            content:
 *              application/json:
 *                schema:
 *                  type: string
 *                  description: ID of the found game
 */
gameRouter.get('/name/:name', (req: Request, res: Response) => {
    handle(
        async () => {
            const { name } = req.params;
            const game = await gameModel.getGameByName(name)
            if (game) {
                return { id: game.id }
            } else {
                return null
            }
        },
        res
    );
});

/**
 * @swagger
 * /games:
 *   post:
 *      summary: Add a game 
 *      responses:
 *         200:
 *            description: The Name of the added game
 *            content:
 *              application/json:
 *                schema:
 *                  type: string
 *                  description: Name of the new game
 */
gameRouter.post('/', (req: Request, res: Response) => {
    handle(
        async () => {
            const game = gameModel.Game.create(req.body);
            const result = await gameModel.add(game);
            return { name: result.name };
        },
        res
    )
});

/**
 * @swagger
 * /games/:uuid/favourite:
 *   post:
 *      summary: Toggle the isFavourite flag of the game
 *      responses:
 *         200:
 *            description: The name of the favourited game
 *            content:
 *              application/json:
 *                schema:
 *                  type: string
 *                  description: Name of the favourited game 
 */
gameRouter.post('/:uuid/favourite', (req: Request, res: Response) => {
    handle(
        async () => {
            const uuid = req.params.uuid;
            console.log(`Favouriting game with ID '${uuid}'.`)
            const favouritedGame = await gameModel.favourite(uuid);
            return { name: favouritedGame.name };
        },
        res
    )
});

/**
 * @swagger
 * /games/:uuid/rating:
 *   post:
 *      summary: Set the rating of the game
 *      responses:
 *         200:
 *            description: The name of the updated game
 *            content:
 *              application/json:
 *                schema:
 *                  type: string
 *                  description: Name of the updated game 
 */
gameRouter.post('/:uuid/rating', (req: Request, res: Response) => {
    handle(
        async () => {
            const { uuid } = req.params;
            const { rating } = req.body;
            console.log(`Updating rating of game with ID '${uuid}'.`);
            const updatedGame = await gameModel.setRating(uuid, rating);
            return { name: updatedGame.name };
        },
        res
    );
});

/**
 * @swagger
 * /games/:uuid:
 *   delete:
 *      summary: Delete a game
 *      responses:
 *         200:
 *            description: The name of the deleted game
 *            content:
 *              application/json:
 *                schema:
 *                  type: string
 *                  description: Name of the deleted game 
 */
gameRouter.delete('/:uuid', (req: Request, res: Response) => {
    handle(
        async () => {
            const { uuid } = req.params;
            const deletedGame = await gameModel.deleteGame(uuid);
            return { name: deletedGame.name }
        },
        res
    )
});

gameRouter.delete('/', (req: Request, res: Response) => {
    handle(
        async () => {
            if (req.header("Authorization") === ADMIN_PASSWORD) {
                await gameModel.deleteAllGames();
                return { status: "ok" };
            } else {
                throw new CustomError(403, "Unauthorized");
            }
        },
        res
    )
})

/**
 * @swagger
 * /games/filter:
 *   get:
 *      summary: Filter the list of games
 *      responses:
 *         200:
 *            description: The list of filtered games
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Game'
 */
gameRouter.get('/filter', (req, res) => {
    handle(
        async () => {
            const { query } = req.query;
            return gameModel.getAllGames(query as string);
        },
        res
    )
})

export { gameRouter };
