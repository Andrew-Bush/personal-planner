import { Alert, FlatList, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { Button, Card, TextInput } from 'react-native-paper';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  useAnimatedStyle,
} from 'react-native-reanimated';


const RightActionComponent = ({ progress, dragX }) => {
  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ translateX: dragX.value + 45 }],
    };
  });
  return (
    <Reanimated.View style={[animatedStyle, styles.rightAction]}>
      <Text style={styles.actionText}>Delete</Text>
    </Reanimated.View>
  );
};

interface Task {
  id: string;
  title: string;
  completed: boolean;
}


export default function TabOneScreen() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const storeData = async (value: Task[]) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem("user-tasks", jsonValue)
    } catch (e) {
      Alert.alert("couldn't save to storage")
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user-tasks");
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
      const newTask: Task = {
        id: Date.now().toString(),
        title: task,
        completed: false
      }
      const newTasks = [...tasks, newTask]
      setTasks(newTasks)
      storeData(newTasks)
      setTask("");
    }
  }

  const RemoveTask = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    storeData(updatedTasks);
  }

  const handleSwipeOpen = (taskIndex: number, direction: string | null) => {
    if (direction === 'left') {
      RemoveTask(taskIndex);
    }
  };

  const renderTask = (singleTask: Task, taskIndex: number) => (
    <Swipeable
      overshootRight={false}
      onSwipeableOpen={(direction) => handleSwipeOpen(taskIndex, direction)}
      renderRightActions={(progress, dragX) => (
        <RightActionComponent progress={progress} dragX={dragX} />
      )}
    >
      <Card style={styles.card} mode='outlined'>
        <Card.Content>
          <Text>{singleTask.title}</Text>
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
        multiline={true}
        numberOfLines={4}
        mode="outlined"
        label="Task"
        value={task}
        onChangeText={text => setTask(text)}
        style={styles.textInput}
        contentStyle={styles.textInputContent}
        activeOutlineColor="white"
      />
      <Button mode='contained' onPress={() => AddTask()} style={styles.button}>
        <Text>Add Task</Text>
      </Button>
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => item.id}
        renderItem={({item, index}) => renderTask(item, index)}
        style={styles.flatList}
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
  rightAction: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  actionText: {
    color: 'white',
  },
  button: {
    marginVertical: 10,
  },
  card: {
    width: "80%",
    marginVertical: 10,
    backgroundColor:  "black",
    marginHorizontal: "auto"
  },
  flatList: {
    width: "100%",
    marginVertical: 10,
    backgroundColor:  "black",
    marginHorizontal: "auto"
  },
  textInput: {
    width: "80%",
    marginVertical: 10,
    backgroundColor:  "black",
  },
  textInputContent: {
    color: "white",
  }
});
