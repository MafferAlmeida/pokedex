const cardContainer = document.querySelector('.card-container');

const fetchFavoritedPokemons = () => {
    const favoritedPokemons = JSON.parse(localStorage.getItem('favoritedPokemons')) || [];
    displayPokemons(favoritedPokemons);
};

const displayPokemons = (pokemons) => {
    cardContainer.innerHTML = '';
    if (pokemons.length === 0) {
        cardContainer.innerHTML = '<h2>Nenhum Pokémon favoritado</h2>';
        return;
    }
    pokemons.forEach(pokemon => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h2>#${pokemon.id} ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        `;
        cardContainer.appendChild(card);
    });
};

fetchFavoritedPokemons();
