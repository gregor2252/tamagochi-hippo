// context/HippoContext.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ
import { SHOP_ITEMS } from '@/constants/shop-items';
import { Hippo, HippoContextType, HippoGender, HippoOutfit, HippoStats } from '@/types/hippo';
import { storage } from '@/utils/storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const HippoContext = createContext<HippoContextType | undefined>(undefined);

const initialStats: HippoStats = {
    health: 100,
    satiety: 50,
    happiness: 70,
    cleanliness: 60,
    energy: 80,
    thirst: 30,
};

const initialHippo: Hippo = {
    id: '1',
    name: 'Бегемотик',
    gender: 'male',
    age: 'child',
    stats: initialStats,
    outfit: {},
    coins: 100,
    createdAt: new Date(),
    lastFed: new Date(),
    lastCleaned: new Date(),
    lastPlayed: new Date(),
    lastWatered: new Date(),
    feedCount: 0,
    cleanCount: 0,
    playCount: 0,
    sleepCount: 0,
    waterCount: 0,
};

export function HippoProvider({ children }: { children: React.ReactNode }) {
    const [hippo, setHippo] = useState<Hippo | null>(initialHippo);
    const [isLoading, setIsLoading] = useState(true);
    const [unlockedItems, setUnlockedItems] = useState<Set<string>>(new Set());

    // Загрузка данных при инициализации
    useEffect(() => {
        loadHippoData();
    }, []);

    const loadHippoData = async () => {
        try {
            const [
                savedName,
                savedGender,
                savedAge,
                savedStats,
                savedOutfit,
                savedCoins,
                feedCount,
                cleanCount,
                playCount,
                sleepCount,
                waterCount,
                savedUnlockedItems
            ] = await Promise.all([
                storage.getItem('hippoName'),
                storage.getItem('hippoGender'),
                storage.getItem('hippoAge'),
                storage.getItem('hippoStats'),
                storage.getItem('hippoOutfit'),
                storage.getItem('hippoCoins'),
                storage.getItem('hippoFeedCount'),
                storage.getItem('hippoCleanCount'),
                storage.getItem('hippoPlayCount'),
                storage.getItem('hippoSleepCount'),
                storage.getItem('hippoWaterCount'),
                storage.getItem('unlockedItems')
            ]);

            if (savedName) {
                const baseHippo = {
                    ...initialHippo,
                    name: savedName,
                    gender: (savedGender as HippoGender) || 'male',
                    age: savedAge ? (savedAge as 'child' | 'parent') : 'child',
                    coins: savedCoins ? parseInt(savedCoins) : initialHippo.coins,
                    outfit: savedOutfit ? JSON.parse(savedOutfit) : {},
                    feedCount: feedCount ? parseInt(feedCount) : 0,
                    cleanCount: cleanCount ? parseInt(cleanCount) : 0,
                    playCount: playCount ? parseInt(playCount) : 0,
                    sleepCount: sleepCount ? parseInt(sleepCount) : 0,
                    waterCount: waterCount ? parseInt(waterCount) : 0,
                };
                
                if (savedStats) {
                    try {
                        const parsedStats = JSON.parse(savedStats);
                        setHippo({
                            ...baseHippo,
                            stats: { ...initialStats, ...parsedStats }
                        });
                    } catch (e) {
                        console.error('Failed to parse saved stats:', e);
                        setHippo(baseHippo);
                    }
                } else {
                    setHippo(baseHippo);
                }
            }

            if (savedUnlockedItems) {
                try {
                    setUnlockedItems(new Set(JSON.parse(savedUnlockedItems)));
                } catch (e) {
                    console.error('Failed to parse unlocked items:', e);
                }
            }
        } catch (error) {
            console.error('Failed to load hippo data:', error);
            setHippo(initialHippo);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isLoading) return;
        const saveUnlockedItems = async () => {
            try {
                await storage.setItem('unlockedItems', JSON.stringify(Array.from(unlockedItems)));
            } catch (error) {
                console.error('Failed to save unlocked items:', error);
            }
        };
        saveUnlockedItems();
    }, [unlockedItems, isLoading]);

    useEffect(() => {
        if (!hippo || isLoading) return;
        const saveCounters = async () => {
            try {
                await Promise.all([
                    storage.setItem('hippoFeedCount', hippo.feedCount.toString()),
                    storage.setItem('hippoCleanCount', hippo.cleanCount.toString()),
                    storage.setItem('hippoPlayCount', hippo.playCount.toString()),
                    storage.setItem('hippoSleepCount', hippo.sleepCount.toString()),
                    storage.setItem('hippoWaterCount', hippo.waterCount.toString()),
                ]);
            } catch (error) {
                console.error('Failed to save counters:', error);
            }
        };
        saveCounters();
    }, [hippo?.feedCount, hippo?.cleanCount, hippo?.playCount, hippo?.sleepCount, hippo?.waterCount, isLoading]);

    const updateStats = useCallback((newStats: Partial<HippoStats>) => {
        setHippo(prev => {
            if (!prev) return prev;
            const updatedStats = {
                health: Math.max(0, Math.min(100, (newStats.health ?? prev.stats.health))),
                satiety: Math.max(0, Math.min(100, (newStats.satiety ?? prev.stats.satiety))),
                happiness: Math.max(0, Math.min(100, (newStats.happiness ?? prev.stats.happiness))),
                cleanliness: Math.max(0, Math.min(100, (newStats.cleanliness ?? prev.stats.cleanliness))),
                energy: Math.max(0, Math.min(100, (newStats.energy ?? prev.stats.energy))),
                thirst: Math.max(0, Math.min(100, (newStats.thirst ?? prev.stats.thirst))),
            };
            const updatedHippo = {
                ...prev,
                stats: updatedStats,
                lastFed: newStats.satiety !== undefined ? new Date() : prev.lastFed,
                lastCleaned: newStats.cleanliness !== undefined ? new Date() : prev.lastCleaned,
                lastPlayed: newStats.happiness !== undefined ? new Date() : prev.lastPlayed,
                lastWatered: newStats.thirst !== undefined ? new Date() : prev.lastWatered,
            };
            storage.setItem('hippoStats', JSON.stringify(updatedStats)).catch(
                error => console.error('Failed to save stats:', error)
            );
            return updatedHippo;
        });
    }, []);

    const feed = useCallback(() => {
        setHippo(prev => {
            if (!prev) return prev;
            const updated = {
                ...prev,
                feedCount: prev.feedCount + 1,
                coins: prev.coins + 5
            };
            Promise.all([
                storage.setItem('hippoFeedCount', updated.feedCount.toString()),
                storage.setItem('hippoCoins', updated.coins.toString())
            ]).catch(error => console.error('Failed to save data:', error));
            return updated;
        });
        updateStats({
            satiety: Math.min(100, (hippo?.stats.satiety || 0) + 30),
            happiness: Math.min(100, (hippo?.stats.happiness || 0) + 10),
            energy: Math.min(100, (hippo?.stats.energy || 0) + 5),
            thirst: Math.max(0, (hippo?.stats.thirst || 0) - 5),
        });
    }, [hippo?.stats, updateStats]);

    const clean = useCallback(() => {
        setHippo(prev => {
            if (!prev) return prev;
            const updated = {
                ...prev,
                cleanCount: prev.cleanCount + 1,
                coins: prev.coins + 5
            };
            Promise.all([
                storage.setItem('hippoCleanCount', updated.cleanCount.toString()),
                storage.setItem('hippoCoins', updated.coins.toString())
            ]).catch(error => console.error('Failed to save data:', error));
            return updated;
        });
        updateStats({
            cleanliness: Math.min(100, (hippo?.stats.cleanliness || 0) + 40),
            happiness: Math.min(100, (hippo?.stats.happiness || 0) + 5),
            energy: Math.max(0, (hippo?.stats.energy || 0) - 10),
        });
    }, [hippo?.stats, updateStats]);

    // ФУНКЦИЯ addCoins ДОЛЖНА БЫТЬ ОБЪЯВЛЕНА ДО completeGame
    const addCoins = useCallback((amount: number) => {
        setHippo(prev => {
            if (!prev) return prev;
            const updated = {
                ...prev,
                coins: prev.coins + amount
            };
            storage.setItem('hippoCoins', updated.coins.toString()).catch(
                error => console.error('Failed to save coins:', error)
            );
            return updated;
        });
    }, []);

    // ОБНОВЛЕННАЯ ФУНКЦИЯ play() - теперь возвращает boolean
    const play = useCallback((): boolean => {
        // Проверяем энергию (20% минимум для игры)
        if (hippo && hippo.stats.energy < 20) {
            return false; // Недостаточно энергии
        }
        
        setHippo(prev => {
            if (!prev) return prev;
            const updated = {
                ...prev,
                playCount: prev.playCount + 1,
            };
            storage.setItem('hippoPlayCount', updated.playCount.toString())
                .catch(error => console.error('Failed to save play count:', error));
            return updated;
        });
        
        // Обновляем статистику: списываем энергию, добавляем немного настроения
        updateStats({
            happiness: Math.min(100, (hippo?.stats.happiness || 0) + 10),
            energy: Math.max(0, (hippo?.stats.energy || 0) - 20),
            satiety: Math.max(0, (hippo?.stats.satiety || 0) - 5),
            thirst: Math.max(0, (hippo?.stats.thirst || 0) - 5),
        });
        
        return true; // Игра успешно начата
    }, [hippo?.stats, updateStats]);

    // Функция для завершения игры с бонусами
    const completeGame = useCallback((score: number) => {
        // Рассчитываем бонусы в зависимости от счета
        const coinsBonus = Math.floor(score / 10);
        const happinessBonus = Math.min(25, score * 0.1);
        
        // Добавляем монеты
        addCoins(coinsBonus);
        
        // Дополнительно увеличиваем настроение
        updateStats({
            happiness: Math.min(100, (hippo?.stats.happiness || 0) + happinessBonus),
        });
        
        return { coinsBonus, happinessBonus };
    }, [hippo?.stats, addCoins, updateStats]);

    const sleep = useCallback(() => {
        setHippo(prev => {
            if (!prev) return prev;
            const updated = {
                ...prev,
                sleepCount: prev.sleepCount + 1,
                coins: prev.coins + 3
            };
            Promise.all([
                storage.setItem('hippoSleepCount', updated.sleepCount.toString()),
                storage.setItem('hippoCoins', updated.coins.toString())
            ]).catch(error => console.error('Failed to save data:', error));
            return updated;
        });
        updateStats({
            energy: Math.min(100, (hippo?.stats.energy || 0) + 50),
            health: Math.min(100, (hippo?.stats.health || 0) + 5),
            satiety: Math.max(0, (hippo?.stats.satiety || 0) - 5),
            thirst: Math.max(0, (hippo?.stats.thirst || 0) - 10),
        });
    }, [hippo?.stats, updateStats]);

    const giveWater = useCallback(() => {
        setHippo(prev => {
            if (!prev) return prev;
            const updated = {
                ...prev,
                waterCount: prev.waterCount + 1,
                coins: prev.coins + 4
            };
            Promise.all([
                storage.setItem('hippoWaterCount', updated.waterCount.toString()),
                storage.setItem('hippoCoins', updated.coins.toString())
            ]).catch(error => console.error('Failed to save data:', error));
            return updated;
        });
        updateStats({
            thirst: Math.min(100, (hippo?.stats.thirst || 0) + 30),
            health: Math.min(100, (hippo?.stats.health || 0) + 10),
            happiness: Math.min(100, (hippo?.stats.happiness || 0) + 15),
        });
    }, [hippo?.stats, updateStats]);

    const buyItem = useCallback((itemId: string): boolean => {
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        if (!item || !hippo) return false;
        if (hippo.coins >= item.price) {
            setHippo(prev => {
                if (!prev) return prev;
                const updated = {
                    ...prev,
                    coins: prev.coins - item.price
                };
                storage.setItem('hippoCoins', updated.coins.toString()).catch(
                    error => console.error('Failed to save coins:', error)
                );
                return updated;
            });
            const newUnlockedItems = new Set([...unlockedItems, itemId]);
            setUnlockedItems(newUnlockedItems);
            storage.setItem('unlockedItems', JSON.stringify(Array.from(newUnlockedItems))).catch(
                error => console.error('Failed to save unlocked items:', error)
            );
            const currentOutfit = hippo.outfit || {};
            if (!currentOutfit[item.category as keyof HippoOutfit]) {
                equipItem(itemId);
            }
            return true;
        }
        return false;
    }, [hippo, unlockedItems]);

    const equipItem = useCallback((itemId: string) => {
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        if (!item || !hippo || !unlockedItems.has(itemId)) return;
        setHippo(prev => {
            if (!prev) return prev;
            const updatedOutfit = {
                ...prev.outfit,
                [item.category]: itemId
            };
            const updated = {
                ...prev,
                outfit: updatedOutfit
            };
            storage.setItem('hippoOutfit', JSON.stringify(updatedOutfit)).catch(
                error => console.error('Failed to save outfit:', error)
            );
            return updated;
        });
    }, [hippo, unlockedItems]);

    const unequipItem = useCallback((category: keyof HippoOutfit) => {
        if (!hippo) return;
        setHippo(prev => {
            if (!prev) return prev;
            const updatedOutfit = { ...prev.outfit };
            delete updatedOutfit[category];
            const updated = {
                ...prev,
                outfit: updatedOutfit
            };
            storage.setItem('hippoOutfit', JSON.stringify(updatedOutfit)).catch(
                error => console.error('Failed to save outfit:', error)
            );
            return updated;
        });
    }, [hippo]);

    const getAvailableItems = useCallback(() => {
        return SHOP_ITEMS.map(item => ({
            ...item,
            unlocked: unlockedItems.has(item.id)
        }));
    }, [unlockedItems]);

    useEffect(() => {
        if (isLoading) return;
        const interval = setInterval(() => {
            setHippo(prev => {
                if (!prev) return prev;
                const updatedStats = {
                    health: Math.max(0, prev.stats.health - 0.1),
                    satiety: Math.max(0, prev.stats.satiety - 0.2),
                    happiness: Math.max(0, prev.stats.happiness - 0.1),
                    cleanliness: Math.max(0, prev.stats.cleanliness - 0.15),
                    energy: Math.min(100, prev.stats.energy + 0.1),
                    thirst: Math.max(0, prev.stats.thirst - 0.25),
                };
                if (updatedStats.thirst < 20) {
                    updatedStats.health = Math.max(0, updatedStats.health - 0.3);
                    updatedStats.happiness = Math.max(0, updatedStats.happiness - 0.2);
                }
                storage.setItem('hippoStats', JSON.stringify(updatedStats)).catch(
                    error => console.error('Failed to save stats:', error)
                );
                return {
                    ...prev,
                    stats: updatedStats,
                };
            });
        }, 30000);
        return () => clearInterval(interval);
    }, [isLoading]);

    const completeOnboarding = useCallback((name: string, gender: HippoGender) => {
        setHippo(prev => {
            const updatedHippo = prev ? {
                ...prev,
                name,
                gender
            } : {
                ...initialHippo,
                name,
                gender
            };
            Promise.all([
                storage.setItem('hippoName', name),
                storage.setItem('hippoGender', gender),
                storage.setItem('hasCreatedHippo', 'true'),
                storage.setItem('hippoStats', JSON.stringify(updatedHippo.stats)),
                storage.setItem('hippoCoins', updatedHippo.coins.toString())
            ]).catch(error => {
                console.error('Failed to save onboarding data:', error);
            });
            return updatedHippo;
        });
    }, []);

    const hasCompletedOnboarding = (() => {
        if (hippo?.name && hippo.name !== 'Бегемотик') {
            return true;
        }
        return false;
    })();

    const setHippoAsync = useCallback((newHippo: Hippo) => {
        setHippo(newHippo);
        const savePromises = [
            storage.setItem('hippoName', newHippo.name),
            storage.setItem('hippoGender', newHippo.gender),
            storage.setItem('hippoStats', JSON.stringify(newHippo.stats)),
            storage.setItem('hippoOutfit', JSON.stringify(newHippo.outfit || {})),
            storage.setItem('hippoCoins', newHippo.coins.toString()),
            storage.setItem('hippoFeedCount', newHippo.feedCount.toString()),
            storage.setItem('hippoCleanCount', newHippo.cleanCount.toString()),
            storage.setItem('hippoPlayCount', newHippo.playCount.toString()),
            storage.setItem('hippoSleepCount', newHippo.sleepCount.toString()),
            storage.setItem('hippoWaterCount', newHippo.waterCount.toString()),
        ];
        Promise.all(savePromises).catch(error => {
            console.error('Failed to save hippo:', error);
        });
    }, []);

    const resetHippo = useCallback(async () => {
        setHippo(initialHippo);
        setUnlockedItems(new Set());
        try {
            await Promise.all([
                storage.removeItem('hippoStats'),
                storage.removeItem('hippoName'),
                storage.removeItem('hippoGender'),
                storage.removeItem('hippoAge'),
                storage.removeItem('hasCreatedHippo'),
                storage.removeItem('hippoOutfit'),
                storage.removeItem('hippoCoins'),
                storage.removeItem('unlockedItems'),
                storage.removeItem('hippoFeedCount'),
                storage.removeItem('hippoCleanCount'),
                storage.removeItem('hippoPlayCount'),
                storage.removeItem('hippoSleepCount'),
                storage.removeItem('hippoWaterCount'),
            ]);
        } catch (error) {
            console.error('Failed to reset hippo:', error);
        }
    }, []);

    const value: HippoContextType = {
        hippo,
        setHippo: setHippoAsync,
        updateStats,
        feed,
        clean,
        play, // Возвращает boolean
        sleep,
        giveWater,
        resetHippo,
        hasCompletedOnboarding,
        completeOnboarding,
        buyItem,
        equipItem,
        unequipItem,
        addCoins,
        getAvailableItems,
        // completeGame не добавляем в тип HippoContextType, поэтому уберем
    };

    if (isLoading) {
        return null;
    }

    return (
        <HippoContext.Provider value={value}>
            {children}
        </HippoContext.Provider>
    );
}

export function useHippo() {
    const context = useContext(HippoContext);
    if (context === undefined) {
        throw new Error('useHippo must be used within a HippoProvider');
    }
    return context;
}