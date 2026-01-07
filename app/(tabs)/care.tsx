// app/(tabs)/care.tsx
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ActionButton from '@/components/ActionButton';

export default function CareScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Care for Your Hippo</ThemedText>
      <ThemedText style={styles.subtitle}>
        Keep your hippo happy and healthy
      </ThemedText>

      <View style={styles.actions}>
        <ActionButton
          title="Feed"
          icon="fork.knife"
          onPress={() => console.log('Feed')}
        />
        <ActionButton
          title="Clean"
          icon="drop.fill"
          onPress={() => console.log('Clean')}
        />
        <ActionButton
          title="Play"
          icon="gamecontroller.fill"
          onPress={() => console.log('Play')}
        />
        <ActionButton
          title="Sleep"
          icon="moon.zzz.fill"
          onPress={() => console.log('Sleep')}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    opacity: 0.8,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});