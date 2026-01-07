// components/HippoView.tsx
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from './themed-text';

interface HippoViewProps {
    mood?: 'happy' | 'sad' | 'hungry' | 'sleepy';
    size?: 'small' | 'medium' | 'large';
}

export default function HippoView({
    mood = 'happy',
    size = 'medium'
}: HippoViewProps) {
    const sizeMap = {
        small: 100,
        medium: 200,
        large: 300,
    };

    // Временная заглушка - используем существующую картинку из проекта
    const imageSource = require('@/assets/images/react-logo.png');

    return (
        <View style={styles.container}>
            <Image
                source={imageSource}
                style={[
                    styles.image,
                    { width: sizeMap[size], height: sizeMap[size] }
                ]}
                contentFit="contain"
            />
            <ThemedText style={styles.moodText}>
                {mood.charAt(0).toUpperCase() + mood.slice(1)} Hippo
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    image: {
        marginBottom: 10,
    },
    moodText: {
        fontSize: 18,
        fontWeight: '600',
    },
});