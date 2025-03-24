import { Alert, FlatList, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Button, Card, TextInput } from 'react-native-paper';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';


// TODO: Verify data can be written to local storage
// TODO: Verify data can be read from local storage
export default function TabOneScreen() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);

  const storeData = async (value: string[]) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem("user-tasks", jsonValue)
      console.log("store data: ", value)
    } catch (e) {
      Alert.alert("couldn't save to storage")
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user-tasks");
      console.log(jsonValue)
      const parsedValue = jsonValue != null ? JSON.parse(jsonValue) : [];
      setTasks(parsedValue);
      return parsedValue;
    } catch (error) {
      Alert.alert("couldn't read storage")
      return [];
    }
  }

  const AddTask = () => {
    if (task) {
      setTasks([...tasks, task])
      storeData([...tasks, task])
    }
  }

  const RemoveTask = (index: number, direction: string) => {
    console.log(direction, typeof(direction))
    if(direction === 'right') {
      const updatedTasks = [...tasks];
      updatedTasks.splice(index, 1)
      setTasks(updatedTasks);
      storeData(updatedTasks);
    }
  }

  const renderTask = (singleTask: string, taskIndex: number) => (
    <Swipeable onSwipeableOpen={(direction) => {
      RemoveTask(taskIndex, direction);
    }}>

    <Card style={{ width: "80%", marginVertical: 10, backgroundColor:  "black", marginHorizontal: "auto"}} mode='outlined'>
      <Card.Content>
        <Text>{singleTask}</Text>
      </Card.Content>
    </Card>
    </Swipeable>

  )

  useEffect(() => {
    getData();
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule</Text>
      <TextInput
        mode="outlined"
        label="Task"
        value={task}
        onChangeText={text => setTask(text)}
        style={{
          backgroundColor: "black",
          flexDirection: "column",
          width: "80%"
        }}
        contentStyle={{
          color: "white"
        }}
      />
      <Button mode='contained' onPress={() => AddTask()} style={{marginVertical: 10}}>
        <Text>Add Task</Text>
      </Button>
      <FlatList
        data={tasks}
        renderItem={item => renderTask(item.item, item.index)}
        style={{flex: 1, width: "100%"}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
