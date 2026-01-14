// components/HippoView.tsx - ОТОБРАЖЕНИЕ КАРТИНОК БЕГЕМОТА
import { Image, StyleSheet, View } from 'react-native';

// Статические импорты для baby casual
const babyDefault = require('@/models/baby/casual/default.png');
const babyHunger = require('@/models/baby/casual/hunger/hunger.png');
const babyBath = require('@/models/baby/casual/bath/bath.png');
const babyEntertainment = require('@/models/baby/casual/entertainment/entertainment.png');
const babySleep = require('@/models/baby/casual/sleep/sleep.png');
const babyWater = require('@/models/baby/casual/water/water.png');

// Статические импорты для parent casual
const parentDefault = require('@/models/parent/casual/default.png');
const parentHunger = require('@/models/parent/casual/hunger/hunger.png');
const parentBath = require('@/models/parent/casual/bath/bath.png');
const parentEntertainment = require('@/models/parent/casual/entertainment/entertainment.png');
const parentSleep = require('@/models/parent/casual/sleep/sleep.png');
const parentWater = require('@/models/parent/casual/water/water.png');

// Костюмы для baby - DINO
const dinoDef = require('@/models/baby/dino/default.png');
const dinoHunger = require('@/models/baby/dino/hunger/hunger.png');
const dinoBath = require('@/models/baby/dino/bath/bath.png');
const dinoEntertainment = require('@/models/baby/dino/entertainment/entertainment.png');
const dinoSleep = require('@/models/baby/dino/sleep/sleep.png');
const dinoWater = require('@/models/baby/dino/water/water.png');

// Костюмы для baby - BUNNY
const bunnyDef = require('@/models/baby/bunny/default.png');
const bunnyHunger = require('@/models/baby/bunny/hunger/hunger.png');
const bunnyBath = require('@/models/baby/bunny/bath/bath.png');
const bunnyEntertainment = require('@/models/baby/bunny/entertainment/entertainment.png');
const bunnySleep = require('@/models/baby/bunny/sleep/sleep.png');
const bunnyWater = require('@/models/baby/bunny/water/water.png');

// Костюмы для parent - DINO
const parentDinoDef = require('@/models/parent/dino/default.png');
const parentDinoHunger = require('@/models/parent/dino/hunger/hunger.png');
const parentDinoBath = require('@/models/parent/dino/bath/bath.png');
const parentDinoEntertainment = require('@/models/parent/dino/entertainment/entertainment.png');
const parentDinoSleep = require('@/models/parent/dino/sleep/sleep.png');
const parentDinoWater = require('@/models/parent/dino/water/water.png');

// Костюмы для parent - DUCK
const parentDuckDef = require('@/models/parent/duck/default.png');
const parentDuckHunger = require('@/models/parent/duck/hunger/hunger.png');
const parentDuckBath = require('@/models/parent/duck/bath/bath.png');
const parentDuckEntertainment = require('@/models/parent/duck/entertainment/entertainment.png');
const parentDuckSleep = require('@/models/parent/duck/sleep/sleep.png');
const parentDuckWater = require('@/models/parent/duck/water/water.png');

// Костюмы для baby - WATER
const waterDef = require('@/models/baby/water_costume/default.png');
const waterHunger = require('@/models/baby/water_costume/hunger/hunger.png');
const waterBath = require('@/models/baby/water_costume/bath/bath.png');
const waterEntertainment = require('@/models/baby/water_costume/entertainment/entertainment.png');
const waterSleep = require('@/models/baby/water_costume/sleep/sleep.png');
const waterWaterState = require('@/models/baby/water_costume/water/water.png');

interface HippoViewProps {
    mood?: 'default' | 'hunger' | 'bath' | 'entertainment' | 'sleep' | 'water';
    size?: 'small' | 'medium' | 'large';
    age?: 'child' | 'parent';
    costume?: string; // ID костюма (costume_dino, costume_bunny, costume_water)
}

// Маппинг состояний на картинки
const getMoodImage = (mood: string, age: string, costume?: string) => {
    const isParent = age === 'parent';
    
    // Если есть костюм, используем спрайты костюма
    if (costume) {
        if (isParent) {
            // Костюмы для взрослого
            switch (costume) {
                case 'costume_dino':
                    switch (mood) {
                        case 'hunger': return parentDinoHunger;
                        case 'bath': return parentDinoBath;
                        case 'entertainment': return parentDinoEntertainment;
                        case 'sleep': return parentDinoSleep;
                        case 'water': return parentDinoWater;
                        default: return parentDinoDef;
                    }
                case 'costume_duck':
                    switch (mood) {
                        case 'hunger': return parentDuckHunger;
                        case 'bath': return parentDuckBath;
                        case 'entertainment': return parentDuckEntertainment;
                        case 'sleep': return parentDuckSleep;
                        case 'water': return parentDuckWater;
                        default: return parentDuckDef;
                    }
            }
        } else {
            // Костюмы для ребенка
            switch (costume) {
                case 'costume_shark':
                    switch (mood) {
                        case 'hunger': return dinoHunger;
                        case 'bath': return dinoBath;
                        case 'entertainment': return dinoEntertainment;
                        case 'sleep': return dinoSleep;
                        case 'water': return dinoWater;
                        default: return dinoDef;
                    }
                case 'costume_bunny':
                    switch (mood) {
                        case 'hunger': return bunnyHunger;
                        case 'bath': return bunnyBath;
                        case 'entertainment': return bunnyEntertainment;
                        case 'sleep': return bunnySleep;
                        case 'water': return bunnyWater;
                        default: return bunnyDef;
                    }
                case 'costume_water':
                    switch (mood) {
                        case 'hunger': return waterHunger;
                        case 'bath': return waterBath;
                        case 'entertainment': return waterEntertainment;
                        case 'sleep': return waterSleep;
                        case 'water': return waterWaterState;
                        default: return waterDef;
                    }
            }
        }
    }
    
    // Обычные спрайты (casual)
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
            return { width: 80, height: 80 };
        case 'large':
            return { width: 200, height: 200 };
        default: // medium
            return { width: 140, height: 140 };
    }
};

export default function HippoView({
    mood = 'default',
    size = 'medium',
    age = 'child',
    costume
}: HippoViewProps) {
    const imageSource = getMoodImage(mood, age, costume);
    const sizeStyle = getSizeStyle(size);
    
    console.log('HippoView rendered with costume:', costume, 'age:', age, 'mood:', mood);

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