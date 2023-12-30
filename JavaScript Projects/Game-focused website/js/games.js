const errorElement = document.getElementById("form-errors"); // replace "error" with the actual ID of your error element

// const toString = (game) => {
//     return `${game.name}  ||  ${game.type}  ||  ${game.rating}/10`;
// }

const createImageElement = (gameName) => {
    const imgElement = new Image();

    // Try loading the .jpg image first
    imgElement.src = `/images/${getImageName(gameName, '.jpg')}`;

    imgElement.onerror = () => {
        // If the .jpg image fails to load, try the .png image
        imgElement.src = `/images/${getImageName(gameName, '.png')}`;

        imgElement.onerror = () => {
            // If the .png image also fails to load, try the .jpeg image
            imgElement.src = `/images/${getImageName(gameName, '.jpeg')}`;
        }
    };

    return imgElement;
};

const getImageName = (gameName, extension) => {
    // Convert to lowercase, replace spaces with hyphens, and remove special characters
    let imageName = gameName
        .toLowerCase()
        .replace(/ /g, '-')
        .normalize('NFD') // separate special characters from their base characters
        .replace(/[\u0300-\u036f]/g, '') // remove special characters
        .replace(/:/g, ''); // remove colons

    // Add the provided extension
    imageName += extension;

    return imageName;
};

window.onload = function() {
    if (window.location.pathname.endsWith('statistics.html')) {
        let images = document.querySelectorAll('.game-image');

        images.forEach(function(img) {
            var aspectRatio = img.naturalWidth / img.naturalHeight;

            if (aspectRatio.toFixed(4) === 1.7777) {
                img.style.maxWidth = '480px';
            }
        });
    };
};

let imageExtension = '.jpg';

const fetchGames = async () => {
    if (window.location.pathname.endsWith('statistics.html')) {
        const response = await fetch("http://localhost:3000/games");
        const data = await response.json();

        document.getElementById("games-list").innerHTML = "";
        
        for (const game of data) {
            const newElement = document.createElement("li");

            const textElement = document.createElement("text");
            textElement.className = "text";
            textElement.textContent = `${game.name}  ||  ${game.type}  ||  ${game.rating}/10`;
            newElement.appendChild(textElement);

            const imgElement = createImageElement(game.name);
            imgElement.alt = game.name;
            imgElement.onload = () => {
                imgElement.classList.add('game-image');
            };
            
            const aElement = document.createElement("a");
            newElement.appendChild(aElement);
            newElement.appendChild(imgElement);
            
            // Fetch game description from RAWG API
            fetchRAWGData(game.name).then(description => {
                const descriptionElement = document.createElement("description");
                descriptionElement.textContent = description;
                textElement.appendChild(descriptionElement); // Append the description to the text element
            });

            // Create delete button
            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-button";
            deleteButton.textContent = "X";
            
            deleteButton.addEventListener('click', function(event) {
                event.preventDefault();
                deleteGame(game.name);
            });

            newElement.appendChild(deleteButton);
            
            document.getElementById("games-list").appendChild(newElement);
        }
    }
}

fetchGames();


const fetchRAWGData = async (gameName) => {
    const apiKey = 'da184da520a04972bc6bbacc9927d06a';
    try {
    const response = await fetch(`https://api.rawg.io/api/games?search=${gameName}&key=${apiKey}`);
    const data = await response.json();
    console.log(data);
    return String(data.results[0].description);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Index page

window.onload = async () => {
    if (window.location.pathname.endsWith('index.html')) {
    const gameName = document.querySelector("h3").textContent;
    const gameDescription = await fetchRAWGData(gameName);
    document.querySelector(".index-description").textContent = gameDescription;

    if (gameDescription) {
        document.querySelector(".index-description").textContent = gameDescription;
    } else {
        console.log("Game description undefined")
    }
    }
};



// adding a game unto the Statistics page

const addGame = async () => {

    const name = document.getElementById("new-game-name").value;
    const type = document.getElementById("new-game-type").value;
    const rating = document.getElementById("new-game-rating").value;

    if (name.length > 50 || name.length < 2) {
        errorElement.textContent = "Game name needs to be between 2 and 20 characters."
    }

    else if (type.toLowerCase() === "book") {
        errorElement.textContent = ">No books allowed."
    }

    else if (rating < 0 || rating > 10) {
        errorElement.textContent = "Rating has to be inbetween 0 & 10."
    }

    else {
        const newGame = {
            name: name,
            type: type,
            rating: rating
        };

        const options = {
            method: "POST",
            body: JSON.stringify(newGame),
            headers: {
                "Content-Type": "application/json"
            }
        };
        
        document.getElementById("games-list").innerHTML = "";

        document.getElementById("new-game-type").innerHTML = "";
        await fetch("http://localhost:3000/games", options);
        fetchGames();
        // executes the HTTP request linked to the const options.

        /// CHECK HERE IF ITS POSSIBLE TO MIX WITH THE API OF RAWG.IO
        //  DEFINITE POSSIBILITIES OF THAT HAPPENING AHAHAHAHA
    }
}

if (window.location.pathname.endsWith('statistics.html')) {
    document.getElementById("new-game-form").addEventListener("submit", (event) => {
        event.preventDefault();
        addGame();

        document.querySelector(".add-game-button").classList.add("add-game-button");
    });
};


const deleteGame = async (gameName) => {
    const games = await fetch("http://localhost:3000/games");
    const gamesData = await games.json();

    const gameToDelete = gamesData.find(game => game.name === gameName);

    if (gameToDelete) {
        const response = await fetch(`http://localhost:3000/games/${gameToDelete.id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            // Refresh the game list after a game is deleted
            fetchGames();
        }
    } else {
        console.log(`Game with name ${gameName} not found.`);
    }
}



// setInterval(() => {
//    clearTableRows({ tableBodyID: "gamesTableBody"});
//    fetchandRenderGames();
// }, 5000);




// debugger; // used for debugging Javascript.


// async is a function that returns a "Promise", which is an object representing
// a value which isn't available yet but will be resolved in the future.
// await pauses the execution of the function until a Promise is resolved/rejected.
// 