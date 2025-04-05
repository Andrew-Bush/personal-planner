import { Alert, FlatList, StyleSheet, Modal } from 'react-native';

import { Text, View } from '@/components/Themed';
import { Button, Card, Portal, TextInput } from 'react-native-paper';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  useAnimatedStyle,
} from 'react-native-reanimated';


const RightActionComponent = ({ progress, dragX }: { progress: any, dragX: any }  ) => {
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
  const [isEditingTask, setIsEditingTask] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingText, setEditingText] = useState<string>("");

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

  const editTask = (taskIndex: number, newTitle: string) => {
    setIsEditingTask(true);
    setEditingTask(tasks[taskIndex]);
    setEditingText(newTitle);
  }

  const handleEditTask = (taskIndex: number, newTitle: string) => {
    const updatedTasks = tasks.map((task, index) => index === taskIndex ? { ...task, title: newTitle } : task);
    setTasks(updatedTasks);
    storeData(updatedTasks);
    setIsEditingTask(false);
    setEditingTask(null);
    setEditingText("");
  }

  const renderTask = (singleTask: Task, taskIndex: number) => (
    <Swipeable
      overshootRight={false}
      onSwipeableOpen={(direction) => handleSwipeOpen(taskIndex, direction)}
      renderRightActions={(progress, dragX) => (
        <RightActionComponent progress={progress} dragX={dragX} />
      )}
    >
      <Card style={styles.card} mode='outlined' onLongPress={() => editTask(taskIndex, singleTask.title)}>
        <Card.Content>
          <Text>{singleTask.title}</Text>
        </Card.Content>
      </Card>
    </Swipeable>
  )

  const renderEditTask = (task: Task | null, taskIndex: number) => (
    <Portal>
      <Modal visible={isEditingTask} onDismiss={() => handleEditTask(taskIndex, task?.title || "")} animationType='slide' transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Task</Text>
            <TextInput
              multiline={true}
              numberOfLines={4}
              value={editingText}
              onChangeText={text => setEditingText(text)}
              style={styles.textInput}
              contentStyle={styles.textInputContent}
              activeOutlineColor="white"
              mode="outlined"
            />
            <Button
              mode='contained'
              onPress={() => {
                if (editingText) {
                  handleEditTask(taskIndex, editingText)
                }
              }}
              style={styles.button}
            >
              <Text>Save</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  )

  useEffect(() => {
    getData();
  }, [])

  return (
    <>
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
      {renderEditTask(editingTask, tasks.findIndex(task => task.id === editingTask?.id))}
    </>
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContent: {
    width: "80%",
    margin: 20,
    backgroundColor: 'black',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  }
});
