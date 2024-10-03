const cardContainer = document.querySelector('.card-container');
const modal = document.querySelector('.modal');
const closeButton = document.querySelector('.close');
const pokemonImageDetail = document.querySelector('.pokemon__image-detail');
const pokemonNameDetail = document.querySelector('.pokemon__name-detail');
const statsList = document.querySelector('.stats-list');
const typesContainer = document.querySelector('.types');
const evolutionsContainer = document.querySelector('.evolutions');

const fetchPokemons = async () => {
    const promises = [];
    for (let i = 1; i <= 150; i++) {
        promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then(res => res.json()));
    }
    const pokemons = await Promise.all(promises);
    displayPokemons(pokemons);
};

const displayPokemons = (pokemons) => {
    pokemons.forEach(pokemon => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h2>${pokemon.name}</h2>
        `;
        card.addEventListener('click', () => showDetails(pokemon));
        cardContainer.appendChild(card);
    });
};

const showDetails = async (pokemon) => {
    pokemonImageDetail.src = pokemon.sprites.front_default;
    pokemonNameDetail.innerHTML = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    statsList.innerHTML = '';
    typesContainer.innerHTML = '';
    evolutionsContainer.innerHTML = '';

    for (const stat of pokemon.stats) {
        const li = document.createElement('li');
        li.innerHTML = `${stat.stat.name}: ${stat.base_stat}`;
        statsList.appendChild(li);
    }

    for (const type of pokemon.types) {
        const typeDiv = document.createElement('div');
        typeDiv.classList.add('type');
        typeDiv.style.backgroundColor = getTypeColor(type.type.name);
        typeDiv.innerHTML = type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1);
        typesContainer.appendChild(typeDiv);
    }

    await fetchEvolutions(pokemon.species.url);
    modal.style.display = "block";
};

const fetchEvolutions = async (speciesUrl) => {
    const response = await fetch(speciesUrl);
    const speciesData = await response.json();
    const evolutionChainUrl = speciesData.evolution_chain.url;

    const evolutionResponse = await fetch(evolutionChainUrl);
    const evolutionData = await evolutionResponse.json();

    displayEvolutions(evolutionData.chain);
};

const displayEvolutions = (chain) => {
    let currentChain = chain;

    while (currentChain) {
        const evolutionDiv = document.createElement('div');
        evolutionDiv.innerHTML = `
            <img src="https://pokeapi.co/media/sprites/pokemon/${currentChain.species.url.split('/')[6]}.png" alt="${currentChain.species.name}">
            <span>${currentChain.species.name.charAt(0).toUpperCase() + currentChain.species.name.slice(1)}</span>
        `;
        evolutionsContainer.appendChild(evolutionDiv);
        currentChain = currentChain.evolves_to[0];
    }
};

const getTypeColor = (type) => {
    const colors = {
        bug: '#A8B400',
        dark: '#5A5A5A',
        dragon: '#6F36B7',
        electric: '#E8D400',
        fairy: '#D16FCE',
        fighting: '#C03028',
        fire: '#F54B2B',
        flying: '#A49DF0',
        ghost: '#4F3C4F',
        grass: '#68C31E',
        ground: '#D5B34B',
        ice: '#7BC0D7',
        normal: '#A8A8A8',
        poison: '#7F2D86',
        psychic: '#F452A2',
        rock: '#B8A434',
        steel: '#B7B6D7',
        water: '#2B4BB4'
    };
    return colors[type] || '#FFF';
};

closeButton.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

fetchPokemons();
