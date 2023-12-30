const robotForm = () => {
    const form = document.getElementById("robot-form");

    form.addEventListener("submit", (submitEvent) => {
        submitEvent.preventDefault();

        const value = document.getElementById("description").value;
        const newUrl = `https://robohash.org/${value}`;

        document.getElementById("robot-image").src = newUrl;
    });
};

robotForm();




// Cat facts
const catFacts = async (cat) => {
    cat.preventDefault();
    const response = await fetch("https://catfact.ninja/fact");
    const data = await response.json();
    document.getElementById("cat-fact").innerHTML = data.fact;
    console.log(data.fact);
}

document.getElementById("cat-button").addEventListener("click", catFacts);




// Counter
let counter = 1;

const my_interval = setInterval(() => {
    counter += 1;
    document.getElementById("counter").textContent = counter;
}, 1000);

