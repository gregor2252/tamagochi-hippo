// constants/shop-items.ts
import { ClothingItem } from '@/types/hippo';

export const SHOP_ITEMS: ClothingItem[] = [
    // HEAD ITEMS
    {
        id: 'hat_1',
        name: 'Бейсболка',
        description: 'Стильная бейсболка для бегемотика',
        price: 50,
        category: 'head',
        icon: '🧢',
        rarity: 'common',
        unlocked: false
    },
    {
        id: 'hat_2',
        name: 'Кепка',
        description: 'Модная кепка',
        price: 75,
        category: 'head',
        icon: '🧢',
        rarity: 'common',
        unlocked: false
    },
    {
        id: 'hat_3',
        name: 'Корона',
        description: 'Королевская корона',
        price: 300,
        category: 'head',
        icon: '👑',
        rarity: 'epic',
        unlocked: false
    },
    {
        id: 'hat_4',
        name: 'Шляпа',
        description: 'Элегантная шляпа',
        price: 120,
        category: 'head',
        icon: '🎩',
        rarity: 'rare',
        unlocked: false
    },
    {
        id: 'hat_5',
        name: 'Шлем',
        description: 'Защитный шлем',
        price: 200,
        category: 'head',
        icon: '⛑️',
        rarity: 'rare',
        unlocked: false
    },

    // UPPER ITEMS
    {
        id: 'upper_1',
        name: 'Футболка',
        description: 'Простая футболка',
        price: 60,
        category: 'upper',
        icon: '👕',
        rarity: 'common',
        unlocked: false
    },
    {
        id: 'upper_2',
        name: 'Рубашка',
        description: 'Строгая рубашка',
        price: 100,
        category: 'upper',
        icon: '👔',
        rarity: 'common',
        unlocked: false
    },
    {
        id: 'upper_3',
        name: 'Кофта',
        description: 'Теплая кофта',
        price: 150,
        category: 'upper',
        icon: '🧥',
        rarity: 'rare',
        unlocked: false
    },
    {
        id: 'upper_4',
        name: 'Куртка',
        description: 'Стильная куртка',
        price: 250,
        category: 'upper',
        icon: '🧥',
        rarity: 'epic',
        unlocked: false
    },
    {
        id: 'upper_5',
        name: 'Платье',
        description: 'Красивое платье',
        price: 180,
        category: 'upper',
        icon: '👗',
        rarity: 'rare',
        unlocked: false
    },

    // LOWER ITEMS
    {
        id: 'lower_1',
        name: 'Шорты',
        description: 'Удобные шорты',
        price: 70,
        category: 'lower',
        icon: '🩳',
        rarity: 'common',
        unlocked: false
    },
    {
        id: 'lower_2',
        name: 'Джинсы',
        description: 'Классические джинсы',
        price: 120,
        category: 'lower',
        icon: '👖',
        rarity: 'common',
        unlocked: false
    },
    {
        id: 'lower_3',
        name: 'Юбка',
        description: 'Элегантная юбка',
        price: 110,
        category: 'lower',
        icon: '👗',
        rarity: 'rare',
        unlocked: false
    },
    {
        id: 'lower_4',
        name: 'Спортивные штаны',
        description: 'Для активного отдыха',
        price: 90,
        category: 'lower',
        icon: '👖',
        rarity: 'common',
        unlocked: false
    },
    {
        id: 'lower_5',
        name: 'Костюм',
        description: 'Деловой костюм',
        price: 350,
        category: 'lower',
        icon: '👔',
        rarity: 'epic',
        unlocked: false
    },

    // FEET ITEMS
    {
        id: 'feet_1',
        name: 'Кроссовки',
        description: 'Спортивные кроссовки',
        price: 80,
        category: 'feet',
        icon: '👟',
        rarity: 'common',
        unlocked: false
    },
    {
        id: 'feet_2',
        name: 'Тапочки',
        description: 'Домашние тапочки',
        price: 40,
        category: 'feet',
        icon: '🩴',
        rarity: 'common',
        unlocked: false
    },
    {
        id: 'feet_3',
        name: 'Туфли',
        description: 'Классические туфли',
        price: 150,
        category: 'feet',
        icon: '👞',
        rarity: 'rare',
        unlocked: false
    },
    {
        id: 'feet_4',
        name: 'Сапоги',
        description: 'Теплые сапоги',
        price: 200,
        category: 'feet',
        icon: '🥾',
        rarity: 'rare',
        unlocked: false
    },
    {
        id: 'feet_5',
        name: 'Золотые сандалии',
        description: 'Роскошные сандалии',
        price: 500,
        category: 'feet',
        icon: '👡',
        rarity: 'epic',
        unlocked: false
    }
];