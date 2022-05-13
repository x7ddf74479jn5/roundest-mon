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

const PokemonListing: React.FC<PokemonListingProps> = (props) => {
  return (
    <div className="flex border-b p-4 items-center">
      <Image src={props.pokemon.spriteUrl} alt={props.pokemon.name} width={64} height={64} layout="fixed" />
      <div className="capitalize">{props.pokemon.name}</div>
    </div>
  );
};
const ResultsPage: NextPage<ResultsPageProps> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl p-4">Results</h2>
      <div className="flex flex-col w-full max-w-2xl border">
        {props.pokemon.map((pokemon, index) => (
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
