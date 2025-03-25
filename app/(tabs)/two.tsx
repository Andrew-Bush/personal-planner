import { FlatList, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import { Text, Card, Divider, IconButton, TouchableRipple, List } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { styles } from '../../components/styles';
export default function TabTwoScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const query = `{
    pokemon: pokemon_v2_pokemonspecies(
      where: {pokemon_v2_generation: {name: {_eq: "generation-i"}}}
      order_by: {id: asc}
      limit: 10,
    ){
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
  }`;


  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          variables: null,
          operationName: null
        }),
      });
      const data = await response.json();
      // console.log(JSON.stringify(data, null, 2))
      setData(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderCard = (item: any) => {
    return (
      <Card style={styles.card} mode='outlined'>
        <Card.Content>
          <List.Accordion id={item.id.toString()} title={item.name} expanded={true}>
            <Text variant='bodyMedium'>{`Color: ${item.pokemon_v2_pokemoncolor.name}`}</Text>
            <Text variant='bodyMedium'>{`Evolutions: ${item.pokemon_v2_evolutionchain.pokemon_v2_pokemonspecies.map((pokemon: any) => pokemon.name).join(', ')}`}</Text>
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
          data={data?.data?.pokemon}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderCard(item)}
        />
      </List.AccordionGroup>
    </View>
  );
}
