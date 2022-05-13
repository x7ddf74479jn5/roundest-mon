import Image from "next/image";
import type { GetStaticProps, NextPage } from "next";

import { prisma } from "@/backend/utils/prisma";
import { AsyncReturnType } from "@/utils/ts-bs";

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      VoteFor: { _count: "desc" },
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          VoteFor: true,
          VoteAgainst: true,
        },
      },
    },
  });
};

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

type ResultsPageProps = {
  pokemon: PokemonQueryResult;
};

type PokemonListingProps = {
  pokemon: PokemonQueryResult[number];
};

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
  const { VoteAgainst, VoteFor } = pokemon._count;

  if (VoteFor === 0 && VoteAgainst === 0) return 0;

  return (VoteFor / (VoteFor + VoteAgainst)) * 100;
};

const PokemonListing: React.FC<PokemonListingProps> = ({ pokemon }) => {
  return (
    <div className="flex border-b p-4 items-center justify-between">
      <div className="flex items-center">
        <Image src={pokemon.spriteUrl} alt={pokemon.name} width={64} height={64} layout="fixed" />
        <div className="capitalize">{pokemon.name}</div>
      </div>
      <div className="pr-4">{generateCountPercent(pokemon) + "%"}</div>
    </div>
  );
};
const ResultsPage: NextPage<ResultsPageProps> = (props) => {
  const pokemonSorted = [...props.pokemon].sort((a, b) => generateCountPercent(b) - generateCountPercent(a));

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl p-4">Results</h2>
      <div className="flex flex-col w-full max-w-2xl border">
        {pokemonSorted.map((pokemon, index) => (
          <PokemonListing key={index} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();

  return {
    props: { pokemon: pokemonOrdered },
    revalidate: 60,
  };
};

export default ResultsPage;
