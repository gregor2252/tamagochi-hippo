// components/SimpleStatItem.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface SimpleStatItemProps {
    label: string;
    value: string | number;
    icon: string;
    color: string;
    progress?: number; // от 0 до 100
}

export default function SimpleStatItem({
    label,
    value,
    icon,
    color,
    progress
}: SimpleStatItemProps) {
    return (
        <ThemedView style={styles.container}>
            <View style={styles.iconContainer}>
                <ThemedText style={[styles.icon, { color }]}>{icon}</ThemedText>
            </View>

            <View style={styles.content}>
                <ThemedText style={styles.label}>{label}</ThemedText>
                <ThemedText style={styles.value}>{value}</ThemedText>
            </View>

            {progress !== undefined && (
                <View style={styles.progressContainer}>
                    <View style={styles.progressBackground}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${progress}%`, backgroundColor: color }
                            ]}
                        />
                    </View>
                    <ThemedText style={styles.progressText}>{Math.round(progress)}%</ThemedText>
                </View>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 20,
    },
    content: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        opacity: 0.7,
        marginBottom: 2,
        fontFamily: 'ComicSans',
    },
    value: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'ComicSans',
    },
    progressContainer: {
        alignItems: 'flex-end',
        minWidth: 80,
    },
    progressBackground: {
        width: 60,
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 3,
        marginBottom: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        opacity: 0.7,
        fontFamily: 'ComicSans',
    },
});