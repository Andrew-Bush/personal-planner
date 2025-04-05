import { FlatList, StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { Text, Card, List } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { styles } from '../../components/styles';
import Fuse from 'fuse.js';
import { pokemonQuery } from '../../graphql/queries';
import { print } from 'graphql';
import type { GetFirstGenPokemonQuery } from '@/generated/graphql';


export default function TabTwoScreen() {
  const [data, setData] = useState<GetFirstGenPokemonQuery | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fuzzyOptions = {
    keys: ['name']
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: print(pokemonQuery),
          variables: null,
        }),
      });
      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };
  
  const fuse = new Fuse(data?.pokemon_v2_pokemonspecies || [], fuzzyOptions);

  useEffect(() => {
    fetchData();
  }, []);

  const renderCard = (item: GetFirstGenPokemonQuery['pokemon_v2_pokemonspecies'][0]) => {
    return (
      <Card style={styles.card} mode='outlined'>
        <Card.Content>
          <List.Accordion id={item.id.toString()} title={item.name} expanded={true}>
            <Text variant='bodyMedium'>{`Color: ${item.pokemon_v2_pokemoncolor?.name}`}</Text>
            <Text variant='bodyMedium'>{`Evolutions: ${item.pokemon_v2_evolutionchain?.pokemon_v2_pokemonspecies.map((pokemon: { name: string }) => pokemon.name).join(', ')}`}</Text>
          </List.Accordion>
        </Card.Content>
      </Card>
    )
  }

  return (
    <View style={styles.container}>
      <List.AccordionGroup>
        <FlatList
          style={styles.flatList}
          data={data?.pokemon_v2_pokemonspecies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => renderCard(item)}
        />
      </List.AccordionGroup>
    </View>
  );
}
