import validator from "valivalue";
import { v4 as uuid } from "uuid";
import { CustomError } from "./custom-error";

export class Game {

    readonly id: string;
    readonly name: string;
    readonly type: string;
    rating: number;
    isFavourite: boolean;

    constructor(
        id: string,
        name: string,
        type: string,
        rating: number,
        isFavourite = false
    ) { 
        this.id = validator.strings.validateNotEmpty(id, 'Game ID');
        this.name = validator.strings.validateMinAndMaxLength(name, 2, 64, "Name");
        this.type = validator.strings.validateMinAndMaxLength(type, 2, 32, "Type");
        this.rating = validator.numbers.validateMinAndMaxValue(rating, 0, 10, "Rating");

        this.isFavourite = isFavourite;
    }

    equals(otherGame: Game): boolean {
        return this.name === otherGame.name
            && this.type === otherGame.type
            && this.rating === otherGame.rating
            && this.isFavourite === otherGame.isFavourite
    }

    toggleFavourite(): void {
        this.isFavourite = !this.isFavourite;
    }

    setRating(rating: number): void {
        validator.numbers.validateMinAndMaxValue(rating, 0, 5, "Rating");
        this.rating = rating;
    }

    static create(json: any): Game {

        validator.objects.validateNotNullOrUndefined(json.name, "Name");
        validator.objects.validateNotNullOrUndefined(json.type, "Type");
        validator.objects.validateNotNullOrUndefined(json.rating, "Rating");

        return new Game(
            uuid(),
            json.name,
            json.type,
            json.rating,
            false
        )
    }
}

let allGames: Game[] = [
    new Game(uuid(), 'Elden Ring', 'Fantasy', 4),
    new Game(uuid(), 'Horizon Forbidden West', 'Adventure', 3.5),
    new Game(uuid(), 'Pokémon Legends: Arceus', 'RPG', 3),
    new Game(uuid(), 'GTAV', 'Open World', 5)
];

const getAllGames = async (query?: string) => {
    if (query) {
        return allGames.filter(game => {
            return game.name.toLowerCase().includes(query.toLowerCase());
        })
    }
    return allGames;
};

const getGame = async (uuid: string) => {
    const foundGame = allGames.find(existingGame => existingGame.id === uuid);

    if (foundGame) {
        return foundGame;
    } else {
        throw new CustomError(404, `Game with ID '${uuid}' was not found.`)
    }
}

const add = async (game: Game) => {
    allGames.push(game);
    return game;
};

const favourite = async (uuid: string) => {
    const foundGame = await getGame(uuid);
    foundGame.toggleFavourite();
    return foundGame;
}

const setRating = async (uuid: string, rating: number) => {
    const foundGame = await getGame(uuid);
    foundGame.setRating(rating);
    return foundGame;
}

const deleteGame = async (uuid: string) => {
    const foundGame = await getGame(uuid);
    const updatedList = allGames.filter(currentGame => currentGame.id !== foundGame.id);
    allGames = updatedList;
    return foundGame;
}

const deleteAllGames = async () => {
    allGames = [];
}

const getGameByName = async (name: string) => {
    return allGames.find(game => game.name.toLowerCase() === name.toLowerCase());
}

export { getAllGames, getGameByName, favourite, add, setRating, deleteGame, deleteAllGames };