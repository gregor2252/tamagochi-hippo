// components/HippoView.tsx - ОТОБРАЖЕНИЕ КАРТИНОК БЕГЕМОТА
import { Image, StyleSheet, View } from 'react-native';

// Статические импорты для baby
const babyDefault = require('@/models/baby/default.png');
const babyHunger = require('@/models/baby/hunger/hunger.png');
const babyBath = require('@/models/baby/bath/bath.png');
const babyEntertainment = require('@/models/baby/entertainment/entertainment.png');
const babySleep = require('@/models/baby/sleep/sleep.png');
const babyWater = require('@/models/baby/water/water.png');

// Статические импорты для parent (используем baby пока нет parent картинок)
const parentDefault = require('@/models/baby/default.png');
const parentHunger = require('@/models/baby/hunger/hunger.png');
const parentBath = require('@/models/baby/bath/bath.png');
const parentEntertainment = require('@/models/baby/entertainment/entertainment.png');
const parentSleep = require('@/models/baby/sleep/sleep.png');
const parentWater = require('@/models/baby/water/water.png');

interface HippoViewProps {
    mood?: 'default' | 'hunger' | 'bath' | 'entertainment' | 'sleep' | 'water';
    size?: 'small' | 'medium' | 'large';
    age?: 'child' | 'parent';
}

// Маппинг состояний на картинки
const getMoodImage = (mood: string, age: string) => {
    const isParent = age === 'parent';
    
    switch (mood) {
        case 'hunger':
            return isParent ? parentHunger : babyHunger;
        case 'bath':
            return isParent ? parentBath : babyBath;
        case 'entertainment':
            return isParent ? parentEntertainment : babyEntertainment;
        case 'sleep':
            return isParent ? parentSleep : babySleep;
        case 'water':
            return isParent ? parentWater : babyWater;
        default:
            return isParent ? parentDefault : babyDefault;
    }
};

// Размеры для разных типов
const getSizeStyle = (size: string) => {
    switch (size) {
        case 'small':
            return { width: 120, height: 120 };
        case 'large':
            return { width: 300, height: 300 };
        default: // medium
            return { width: 200, height: 200 };
    }
};

export default function HippoView({
    mood = 'default',
    size = 'medium',
    age = 'child'
}: HippoViewProps) {
    const imageSource = getMoodImage(mood, age);
    const sizeStyle = getSizeStyle(size);

    return (
        <View style={styles.container}>
            <Image
                source={imageSource}
                style={[styles.image, sizeStyle]}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        resizeMode: 'contain',
    },
});