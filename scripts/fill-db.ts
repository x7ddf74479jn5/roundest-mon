import { PokemonClient } from "pokenode-ts";

import { prisma } from "../src/backend/utils/prisma";

const dbBackFill = async () => {
  const pokeApi = new PokemonClient();

  const allPokemon = await pokeApi.listPokemons(0, 493);

  const formattedPokemon = allPokemon.results.map((pokemon, index) => ({
    id: index + 1,
    name: pokemon.name,
    spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
  }));

  const creation = await prisma.pokemon.createMany({
    data: formattedPokemon,
  });
};

dbBackFill();
