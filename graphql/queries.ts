import { graphql } from "../generated/gql";

export const pokemonQuery = graphql(`
    query GetFirstGenPokemon { 
      pokemon_v2_pokemonspecies(
        where: {pokemon_v2_generation: {name: {_eq: "generation-i"}}}
        order_by: {id: asc}
        limit: 10
      ) {
        id
        name
        pokemon_v2_pokemoncolor {
          name
        }
        pokemon_v2_evolutionchain {
          pokemon_v2_pokemonspecies(order_by: {id: asc}) {
            name
          }
        }
      }
    }
`);
