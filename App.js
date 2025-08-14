import { StyleSheet, SafeAreaView } from 'react-native';
import AdvisorScreen from "./src/AdvisorScreen";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <AdvisorScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
