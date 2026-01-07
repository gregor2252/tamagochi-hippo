// components/StatBar.tsx
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface StatBarProps {
    label: string;
    value: number;
    maxValue?: number;
    color?: string;
}

export default function StatBar({
    label,
    value,
    maxValue = 100,
    color = '#4CAF50'
}: StatBarProps) {
    const percentage = Math.min(100, (value / maxValue) * 100);

    return (
        <View style={styles.container}>
            <View style={styles.labelRow}>
                <ThemedText style={styles.label}>{label}</ThemedText>
                <ThemedText style={styles.value}>{value}/{maxValue}</ThemedText>
            </View>
            <ThemedView style={styles.barBackground}>
                <View
                    style={[
                        styles.barFill,
                        {
                            width: `${percentage}%`,
                            backgroundColor: color
                        }
                    ]}
                />
            </ThemedView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
    },
    value: {
        fontSize: 14,
        opacity: 0.7,
    },
    barBackground: {
        height: 8,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 4,
    },
});