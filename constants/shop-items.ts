// constants/shop-items.ts
import { ClothingItem } from '@/types/hippo';

export const SHOP_ITEMS: ClothingItem[] = [
    // HEAD ITEMS
    {
        id: 'hat_1',
        name: 'Бейсболка',
        description: 'Стильная бейсболка для бегемотика',
        price: 250,
        category: 'head',
        icon: require('@/models/icons/shop/head.png'),
        rarity: 'common',
        unlocked: false
    },
    {
        id: 'hat_2',
        name: 'Кепка',
        description: 'Модная кепка',
        price: 250,
        category: 'head',
        icon: require('@/models/icons/shop/head.png'),
        rarity: 'common',
        unlocked: false
    },
    {
        id: 'hat_3',
        name: 'Корона',
        description: 'Королевская корона',
        price: 1000,
        category: 'head',
        icon: require('@/models/icons/shop/head.png'),
        rarity: 'epic',
        unlocked: false
    },
    {
        id: 'hat_4',
        name: 'Шляпа',
        description: 'Элегантная шляпа',
        price: 500,
        category: 'head',
        icon: require('@/models/icons/shop/head.png'),
        rarity: 'rare',
        unlocked: false
    },
    {
        id: 'hat_5',
        name: 'Шлем',
        description: 'Защитный шлем',
        price: 500,
        category: 'head',
        icon: require('@/models/icons/shop/head.png'),
        rarity: 'rare',
        unlocked: false
    },
    {
        id: 'hat_6',
        name: 'Заячьи ушки',
        description: 'Милые заячьи ушки',
        price: 300,
        category: 'head',
        icon: require('@/models/icons/shop/costumes/bunny_hat.png'),
        rarity: 'common',
        unlocked: false,
        ageRestriction: 'child'
    },

    // UPPER ITEMS
    {
        id: 'upper_1',
        name: 'Футболка',
        description: 'Простая футболка',
        price: 250,
        category: 'upper',
        icon: require('@/models/icons/shop/body.png'),
        rarity: 'common',
        unlocked: false
    },
    {
        id: 'upper_2',
        name: 'Рубашка',
        description: 'Строгая рубашка',
        price: 250,
        category: 'upper',
        icon: require('@/models/icons/shop/body.png'),
        rarity: 'common',
        unlocked: false
    },
    {
        id: 'upper_3',
        name: 'Кофта',
        description: 'Теплая кофта',
        price: 500,
        category: 'upper',
        icon: require('@/models/icons/shop/body.png'),
        rarity: 'rare',
        unlocked: false
    },
    {
        id: 'upper_4',
        name: 'Куртка',
        description: 'Стильная куртка',
        price: 1000,
        category: 'upper',
        icon: require('@/models/icons/shop/body.png'),
        rarity: 'epic',
        unlocked: false
    },
    {
        id: 'upper_5',
        name: 'Платье',
        description: 'Красивое платье',
        price: 500,
        category: 'upper',
        icon: require('@/models/icons/shop/body.png'),
        rarity: 'rare',
        unlocked: false
    },
    {
        id: 'upper_6',
        name: 'Боксерские перчатки',
        description: 'Боксерские перчатки для боевого духа',
        price: 750,
        category: 'upper',
        icon: require('@/models/icons/shop/costumes/boxing.png'),
        rarity: 'rare',
        unlocked: false,
        ageRestriction: 'parent'
    },

    // LOWER ITEMS
    {
        id: 'lower_1',
        name: 'Шорты',
        description: 'Удобные шорты',
        price: 250,
        category: 'lower',
        icon: require('@/models/icons/shop/pants.png'),
        rarity: 'common',
        unlocked: false
    },
    {
        id: 'lower_2',
        name: 'Джинсы',
        description: 'Классические джинсы',
        price: 250,
        category: 'lower',
        icon: require('@/models/icons/shop/pants.png'),
        rarity: 'common',
        unlocked: false
    },
    {
        id: 'lower_3',
        name: 'Юбка',
        description: 'Элегантная юбка',
        price: 500,
        category: 'lower',
        icon: require('@/models/icons/shop/pants.png'),
        rarity: 'rare',
        unlocked: false
    },
    {
        id: 'lower_4',
        name: 'Спортивные штаны',
        description: 'Для активного отдыха',
        price: 250,
        category: 'lower',
        icon: require('@/models/icons/shop/pants.png'),
        rarity: 'common',
        unlocked: false
    },
    {
        id: 'lower_5',
        name: 'Костюм',
        description: 'Деловой костюм',
        price: 1000,
        category: 'lower',
        icon: require('@/models/icons/shop/pants.png'),
        rarity: 'epic',
        unlocked: false
    },

    // FEET ITEMS
    {
        id: 'feet_1',
        name: 'Кроссовки',
        description: 'Спортивные кроссовки',
        price: 250,
        category: 'feet',
        icon: require('@/models/icons/shop/shoes.png'),
        rarity: 'common',
        unlocked: false
    },
    {
        id: 'feet_2',
        name: 'Тапочки',
        description: 'Домашние тапочки',
        price: 250,
        category: 'feet',
        icon: require('@/models/icons/shop/shoes.png'),
        rarity: 'common',
        unlocked: false
    },
    {
        id: 'feet_3',
        name: 'Туфли',
        description: 'Классические туфли',
        price: 500,
        category: 'feet',
        icon: require('@/models/icons/shop/shoes.png'),
        rarity: 'rare',
        unlocked: false
    },
    {
        id: 'feet_4',
        name: 'Сапоги',
        description: 'Теплые сапоги',
        price: 500,
        category: 'feet',
        icon: require('@/models/icons/shop/shoes.png'),
        rarity: 'rare',
        unlocked: false
    },
    {
        id: 'feet_5',
        name: 'Золотые сандалии',
        description: 'Роскошные сандалии',
        price: 1000,
        category: 'feet',
        icon: require('@/models/icons/shop/shoes.png'),
        rarity: 'epic',
        unlocked: false
    },

    // COSTUMES (only for child)
    {
        id: 'costume_shark',
        name: 'Акуленок',
        description: 'Костюм акуленка для маленького бегемотика',
        price: 500,
        category: 'costume',
        icon: require('@/models/icons/shop/costumes/shark.png'),
        rarity: 'rare',
        unlocked: false,
        ageRestriction: 'child',
        costume: 'costume_shark'
    },
    {
        id: 'costume_bunny',
        name: 'Кролик',
        description: 'Милый костюм кролика',
        price: 500,
        category: 'costume',
        icon: require('@/models/icons/shop/costumes/bunny.png'),
        rarity: 'rare',
        unlocked: false,
        ageRestriction: 'child',
        costume: 'costume_bunny'
    },
    {
        id: 'costume_water',
        name: 'Дождевик',
        description: 'Водонепроницаемый дождевик',
        price: 250,
        category: 'costume',
        icon: require('@/models/icons/shop/costumes/water_costume.png'),
        rarity: 'common',
        unlocked: false,
        ageRestriction: 'child',
        costume: 'costume_water'
    },

    // COSTUMES (only for parent)
    {
        id: 'costume_dino',
        name: 'Динозавр',
        description: 'Костюм динозавра для взрослого бегемотика',
        price: 500,
        category: 'costume',
        icon: require('@/models/icons/shop/costumes/dino.png'),
        rarity: 'rare',
        unlocked: false,
        ageRestriction: 'parent',
        costume: 'costume_dino'
    },
    {
        id: 'costume_duck',
        name: 'Утка',
        description: 'Костюм утки для взрослого бегемотика',
        price: 500,
        category: 'costume',
        icon: require('@/models/icons/shop/costumes/duck.png'),
        rarity: 'rare',
        unlocked: false,
        ageRestriction: 'parent',
        costume: 'costume_duck'
    }
];
