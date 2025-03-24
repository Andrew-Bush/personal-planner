import { FlatList, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Card } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { styles } from './styles';
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
    console.log(item, "item")
    return (
      <Card style={styles.card} mode='outlined'>
        <Card.Content>
          <Text>{item.name}</Text>
        </Card.Content>
      </Card>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        data={data?.data?.pokemon}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderCard(item)}
      />
    </View>
  );
}
