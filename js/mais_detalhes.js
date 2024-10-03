const cardContainer = document.querySelector('.card-container');
const modal = document.querySelector('.modal');
const closeButton = document.querySelector('.close');
const pokemonImageDetail = document.querySelector('.pokemon__image-detail');
const pokemonNameDetail = document.querySelector('.pokemon__name-detail');
const statsList = document.querySelector('.stats-list');
const typesContainer = document.querySelector('.types');
const evolutionsContainer = document.querySelector('.evolutions');
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const clearFiltersButton = document.querySelector('.clear-filters-button');

let allPokemons = [];
const selectedTypes = new Set();
let favoritePokemons = JSON.parse(localStorage.getItem('favoritePokemons')) || [];

const fetchPokemons = async () => {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
    const data = await response.json();
    allPokemons = await Promise.all(data.results.map(async (pokemon) => {
        const pokemonData = await fetch(pokemon.url);
        return await pokemonData.json();
    }));
    displayPokemons(allPokemons);
};

const displayPokemons = (pokemons) => {
    cardContainer.innerHTML = '';
    pokemons.forEach(pokemon => {
        const card = document.createElement('div');
        card.classList.add('card');
        const isFavorited = favoritePokemons.includes(pokemon.id);
        card.innerHTML = `
            <span class="heart ${isFavorited ? 'favorited' : ''}">&#9825;</span>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
        `;
        card.style.backgroundColor = getTypeColor(pokemon.types[0].type.name);
        card.addEventListener('click', () => showDetails(pokemon));
        
        const heart = card.querySelector('.heart');
        heart.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleFavorite(pokemon.id);
            heart.classList.toggle('favorited');
        });
        
        cardContainer.appendChild(card);
    });
};

const showDetails = (pokemon) => {
    pokemonImageDetail.src = pokemon.sprites.front_default;
    pokemonNameDetail.innerHTML = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    statsList.innerHTML = '';
    typesContainer.innerHTML = '';
    evolutionsContainer.innerHTML = '';
    
    pokemon.stats.forEach(stat => {
        const li = document.createElement('li');
        li.innerHTML = `${stat.stat.name}: ${stat.base_stat}`;
        statsList.appendChild(li);
    });
    pokemon.types.forEach(type => {
        const typeDiv = document.createElement('div');
        typeDiv.classList.add('type');
        typeDiv.style.backgroundColor = getTypeColor(type.type.name);
        typeDiv.innerHTML = type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1);
        typesContainer.appendChild(typeDiv);
    });
    modal.style.display = "block";
};

const toggleFavorite = (id) => {
    if (favoritePokemons.includes(id)) {
        favoritePokemons = favoritePokemons.filter(favoriteId => favoriteId !== id);
    } else {
        favoritePokemons.push(id);
    }
    localStorage.setItem('favoritePokemons', JSON.stringify(favoritePokemons));
};

const getTypeColor = (type) => {
    const colors = {
        water: '#b3e0ff',
        fire: '#ffcccb',
        grass: '#c2f0c2',
        electric: '#fff4b2',
        ice: '#cce7ff',
        bug: '#e6ffb3',
        normal: '#f8e6b3',
        fighting: '#ffb3e6',
        poison: '#d8a3d8',
        ground: '#e4c9a6',
        fairy: '#ffebee',
        rock: '#d0c8b0',
        ghost: '#e6d4f0',
        dragon: '#ffcccb',
        psychic: '#d1c4e9',
    };
    return colors[type] || '#ffffff';
};

closeButton.addEventListener('click', () => {
    modal.style.display = "none";
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

const filterPokemons = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredPokemons = allPokemons.filter(pokemon => {
        const matchesSearchTerm = pokemon.name.toLowerCase().includes(searchTerm) || 
                                   pokemon.id.toString() === searchTerm;
        const matchesType = selectedTypes.size === 0 || 
            pokemon.types.some(type => selectedTypes.has(type.type.name));
        return matchesSearchTerm && matchesType;
    });

    if (filteredPokemons.length > 0) {
        displayPokemons(filteredPokemons);
    } else {
        cardContainer.innerHTML = '<h2>Nenhum Pokémon encontrado :(</h2>';
    }
};

document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', () => {
        const type = button.dataset.type;
        if (selectedTypes.has(type)) {
            selectedTypes.delete(type);
            button.classList.remove('active');
        } else {
            selectedTypes.add(type);
            button.classList.add('active');
        }
        filterPokemons();
    });
});

searchButton.addEventListener('click', filterPokemons);
searchInput.addEventListener('input', filterPokemons);

clearFiltersButton.addEventListener('click', () => {
    selectedTypes.clear();
    document.querySelectorAll('.filter-button').forEach(button => button.classList.remove('active'));
    searchInput.value = '';
    displayPokemons(allPokemons);
});

fetchPokemons();
