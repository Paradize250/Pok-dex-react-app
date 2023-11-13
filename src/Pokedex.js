import React, { useEffect, useState } from 'react';

// Adjust the path to your image file
const typeToBackgroundImage = {
    'fire': 'img/Fire.jpg', 'electric': 'img/Fire.jpg', 'dragon': 'img/Fire.jpg', 'fighting': 'img/Fire.jpg',
    'water': 'img/Water.jpg', 'ice': 'img/Water.jpg', 'fairy': 'img/Water.jpg',
    'grass': 'img/Earth.jpg', 'bug': 'img/Earth.jpg', 'rock': 'img/Earth.jpg', 'ground': 'img/Earth.jpg', 'steel': 'img/Earth.jpg',
    'default': 'img/Air.jpg',
};

function Pokedex() {
    // Define state variables using the useState hook
    const [pokemonData, setPokemonData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Use the useEffect hook to fetch data based on the search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            // Handle empty search term here
            setPokemonData(null);
            return;
        }

        // Check if the search term is numeric; if it is, consider it an ID, otherwise, use it as a name
        const searchIsNumeric = !isNaN(searchTerm);
        const apiUrl = `https://pokeapi.co/api/v2/pokemon/${searchIsNumeric ? searchTerm : searchTerm.toLowerCase()}`;

        // Fetch data from the PokeAPI
        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Réponse réseau incorrecte");
                }
                return response.json();
            })
            .then((data) => {
                setPokemonData(data);
            })
            .catch((error) => {
                console.error("Il y a eu un problème avec l'opération de récupération :", error);
            });
    }, [searchTerm]);

    // Render statistics bars with capitalized stat labels
    const renderStatsBars = () => {
        if (pokemonData && pokemonData.stats) {
            return pokemonData.stats.map((stat) => (
                <div key={stat.stat.name} className="stat-bar">
                    <span className="stat-label">{capitalizeFirstLetter(stat.stat.name)}</span>
                    <div className="stat-value">
                        <div className="stat-fill" style={{ width: `${(stat.base_stat / 100) * 100}%` }}>
                            {stat.base_stat}
                        </div>
                    </div>
                </div>
            ));
        }
        return null;
    };

    // Helper function to capitalize the first letter of a string
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Handle search input changes
    const handleSearchInputChange = (event) => {
        const { value } = event.target;
        setSearchTerm(value);
    };

    // Update body background image based on Pokemon type
    const backgroundImage = pokemonData ? typeToBackgroundImage[pokemonData.types[0]?.type.name] || typeToBackgroundImage['default'] : typeToBackgroundImage['default'];
    const highQualityImageUrl = pokemonData ? pokemonData.sprites.other['official-artwork'].front_default : null;

    // Use useEffect to update body background image when searchTerm or backgroundImage changes
    useEffect(() => {
        const updateBodyBackgroundImage = (image) => {
            document.body.style.backgroundImage = `url(${image})`;
        };

        updateBodyBackgroundImage(backgroundImage);
    }, [searchTerm, backgroundImage]);

    // JSX structure of the component
    return (
        <div className="pokedex" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <header>
                <p id='prompt'>Entrez le nom ou l'identifiant Pokémon ci-dessous :</p>
                <input
                    type="text"
                    placeholder="Nom ou ID de 1 à 1292"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    className="white-placeholder"
                />
                <div className='info1'>
                    {pokemonData ? (
                        <>
                            {/* Display Pokemon information */}
                            <p>Bonheur de base: {pokemonData.base_happiness ? pokemonData.base_happiness.name : 'Inconnu'}</p>
                            <p>Légendaire: {pokemonData.is_legendary ? 'Oui' : 'Non'}</p>
                            <p>Génération: {pokemonData.generation ? pokemonData.generation.name : 'Inconnu'}</p>
                            <p>Habitat: {pokemonData.habitat ? pokemonData.habitat.name : 'Inconnu'}</p>
                            <p>Taille: {pokemonData.height ? (pokemonData.height / 10) + ' m' : 'N/A'}</p>
                            <p>Poids: {pokemonData.weight ? (pokemonData.weight / 10) + ' kg' : 'N/A'}</p>
                            <p>Types: {pokemonData.types
                                ? pokemonData.types.map((type) => type.type.name).join(', ')
                                : 'N/A'
                            }</p>
                            <p>Capacités: {pokemonData.abilities
                                ? pokemonData.abilities.map((ability) => ability.ability.name).join(', ')
                                : 'N/A'
                            }</p>
                        </>
                    ) : (
                        // Display a logo if no Pokemon data is available
                        <div className='logo'>
                            <img src="img/Logo.png" alt="Logo" />
                        </div>
                    )}
                </div>
            </header>
            {highQualityImageUrl ? (
                // Display Pokemon image if available
                <div className="pokemon-image">
                    <img src={highQualityImageUrl} alt={pokemonData ? (pokemonData.name || 'Unknown') : 'Unknown'} />
                </div>
            ) : null}
            {pokemonData ? (
                // Display Pokemon details if data is available
                <div className="pokemon-details">
                    <div className="pokemon-info">
                        <h2>{pokemonData.name ? (pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)) : 'Unknown'}</h2>
                        <div className='info2'>
                            <p>Stats:</p>
                            {renderStatsBars()} {/* Render statistics bars */}
                            <p>Mouvements apprenables en montant de niveau: {pokemonData.moves
                                ? pokemonData.moves.map((move) => {
                                    if (move.version_group_details.some((detail) => detail.move_learn_method.name === 'level-up')) {
                                        return move.move.name;
                                    }
                                    return null;
                                }).filter(Boolean).join(', ')
                                : 'N/A'
                            }</p>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default Pokedex;
