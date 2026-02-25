import { StatusBar, StyleSheet, SafeAreaView, View, Text } from 'react-native';
import { LivenessWebView } from './FaceLivenessWebView';

function App() {
  const sessionId = '7c4aa9e1-37c6-45a8-80bf-3cef29ee7590'; // Provided by user
  const region = 'us-east-1';

  const handleSuccess = (data: any) => {
    console.log('Liveness Success:', data);
    // Handle success (e.g., navigate to results screen)
  };

  const handleError = (error: any) => {
    console.log('Liveness Error:', error);
    // Handle error (e.g., show alert)
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>AWS Face Liveness POC</Text>
      </View>
      <View style={styles.webviewContainer}>
        <LivenessWebView
          sessionId={sessionId}
          region={region}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  webviewContainer: {
    flex: 1,
  },
});

export default App;
