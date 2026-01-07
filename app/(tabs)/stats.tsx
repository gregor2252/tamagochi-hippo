import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function StatsScreen() {
    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Statistics</ThemedText>
            <ThemedText>Track your hippo's progress here</ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
});