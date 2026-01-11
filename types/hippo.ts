// types/hippo.ts
export type RootStackParamList = {
    onboarding: undefined;
    main: undefined;
    hippoDetail: { hippoId: string };
    settings: undefined;
    feeding: undefined;
    cleaning: undefined;
    playing: undefined;
    watering: undefined;
};

export type HippoStats = {
    health: number;
    satiety: number;
    happiness: number;
    cleanliness: number;
    energy: number;
    thirst: number;
};

export type HippoGender = 'male' | 'female';

// НОВЫЕ ТИПЫ ДЛЯ ОДЕЖДЫ И МАГАЗИНА
export type ClothingCategory = 'head' | 'upper' | 'lower' | 'feet';

// В types/hippo.ts в типе ClothingItem добавьте:
export type ClothingItem = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: ClothingCategory;
    icon: string;
    rarity: 'common' | 'rare' | 'epic';
    unlocked: boolean; // Это поле должно быть
};

export type HippoOutfit = {
    head?: string; // id предмета
    upper?: string;
    lower?: string;
    feet?: string;
};

// types/hippo.ts
export interface Hippo {
    id: string;
    name: string;
    gender: HippoGender;
    age: 'child' | 'parent'; // Изменено на строковый тип
    stats: HippoStats;
    outfit: HippoOutfit;
    coins: number;
    createdAt: Date;
    lastFed?: Date;
    lastCleaned?: Date;
    lastPlayed?: Date;
    lastWatered?: Date;
    // СЧЕТЧИКИ ДЕЙСТВИЙ
    feedCount: number;
    cleanCount: number;
    playCount: number;
    sleepCount: number;
    waterCount: number;
}

export type HippoMood = 'happy' | 'sad' | 'hungry' | 'sleepy' | 'dirty' | 'thirsty';

// Типы для контекста
export interface HippoContextType {
    hippo: Hippo | null;
    setHippo: (hippo: Hippo) => void;
    updateStats: (stats: Partial<HippoStats>) => void;
    feed: () => void;
    clean: () => void;
    play: () => void;
    sleep: () => void;
    giveWater: () => void;
    resetHippo: () => void;
    hasCompletedOnboarding: boolean;
    completeOnboarding: (name: string, gender: HippoGender) => void;
    // ФУНКЦИИ ДЛЯ МАГАЗИНА
    buyItem: (itemId: string) => boolean; // Обратно на boolean
    equipItem: (itemId: string) => void;
    unequipItem: (category: ClothingCategory) => void;
    addCoins: (amount: number) => void;
    getAvailableItems: () => ClothingItem[];
}