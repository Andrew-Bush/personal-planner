import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  