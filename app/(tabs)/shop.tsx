import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function ShopScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Shop</ThemedText>
      <ThemedText>Buy food, toys and items for your hippo</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});