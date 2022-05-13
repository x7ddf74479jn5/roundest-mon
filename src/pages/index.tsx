import Image from "next/image";
import type { NextPage } from "next";
import { useState } from "react";

import { trpc } from "@/utils/trpc";
import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { InferQueryResponse } from "@/pages/api/trpc/[trpc]";

const Home: NextPage = () => {
  const [ids, updateIds] = useState(() => getOptionsForVote());
  const [first, second] = ids;

  const firstPokemon = trpc.useQuery([
    "get-pokemon-by-id",
    {
      id: first,
    },
  ]);

  const secondPokemon = trpc.useQuery([
    "get-pokemon-by-id",
    {
      id: second,
    },
  ]);

  const voteMutation = trpc.useMutation(["cast-vote"]);

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else [voteMutation.mutate({ votedFor: second, votedAgainst: first })];

    updateIds(getOptionsForVote());
  };

  return (
    <div className="h-screen w-screen flex flex-col relative justify-center items-center">
      <div className="text-2xl text-center">Which Pokémon is rounder?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        {!firstPokemon.isLoading && firstPokemon.data && !secondPokemon.isLoading && secondPokemon.data && (
          <>
            <PokemonListing pokemon={firstPokemon.data} vote={() => voteForRoundest(first)} />
            <div className="p-8">Vs</div>
            <PokemonListing pokemon={secondPokemon.data} vote={() => voteForRoundest(second)} />
          </>
        )}
        <div className="p-2" />
      </div>
      <div className="absolute bottom-0 w-full text-xl text-center pb-2">
        <a href="https://github.com/x7ddf74479jn5/roundest-mon">GitHub</a>
      </div>
    </div>
  );
};

type PokemonFromServer = InferQueryResponse<"get-pokemon-by-id">;

const PokemonListing: React.FC<{ pokemon: PokemonFromServer; vote: () => void }> = (props) => {
  return (
    <div className="w-64 h-64 flex flex-col items-center">
      <Image src={props.pokemon.spriteUrl} alt={props.pokemon.name} width={256} height={256} layout="fixed" />
      <div className="text-xl text-center capitalize mt-[-0.5rem]">{props.pokemon.name}</div>
      <button
        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => props.vote()}
      >
        Rounder
      </button>
    </div>
  );
};

export default Home;
