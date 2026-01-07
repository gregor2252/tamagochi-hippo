// context/HippoContext.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ
import { Hippo, HippoContextType, HippoStats } from '@/types/hippo';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const HippoContext = createContext<HippoContextType | undefined>(undefined);

const initialStats: HippoStats = {
    health: 100,
    hunger: 50,
    happiness: 70,
    cleanliness: 60,
    energy: 80,
};

const initialHippo: Hippo = {
    id: '1',
    name: 'Hippo',
    age: 1,
    stats: initialStats,
    createdAt: new Date(),
    lastFed: new Date(),
    lastCleaned: new Date(),
    lastPlayed: new Date(),
};

export function HippoProvider({ children }: { children: React.ReactNode }) {
    const [hippo, setHippo] = useState<Hippo | null>(() => {
        // Пытаемся загрузить из localStorage при инициализации
        if (typeof window !== 'undefined') {
            const savedName = localStorage.getItem('hippoName');
            const savedStats = localStorage.getItem('hippoStats');

            if (savedName) {
                const baseHippo = { ...initialHippo, name: savedName };

                if (savedStats) {
                    try {
                        const parsedStats = JSON.parse(savedStats);
                        return { ...baseHippo, stats: parsedStats };
                    } catch (e) {
                        console.error('Failed to parse saved stats:', e);
                    }
                }

                return baseHippo;
            }
        }
        return initialHippo;
    });

    // Функция обновления статистики
    const updateStats = useCallback((newStats: Partial<HippoStats>) => {
        setHippo(prev => {
            if (!prev) return prev;

            const updatedStats = {
                health: Math.max(0, Math.min(100, newStats.health ?? prev.stats.health)),
                hunger: Math.max(0, Math.min(100, newStats.hunger ?? prev.stats.hunger)),
                happiness: Math.max(0, Math.min(100, newStats.happiness ?? prev.stats.happiness)),
                cleanliness: Math.max(0, Math.min(100, newStats.cleanliness ?? prev.stats.cleanliness)),
                energy: Math.max(0, Math.min(100, newStats.energy ?? prev.stats.energy)),
            };

            const updatedHippo = {
                ...prev,
                stats: updatedStats,
                lastFed: newStats.hunger !== undefined ? new Date() : prev.lastFed,
                lastCleaned: newStats.cleanliness !== undefined ? new Date() : prev.lastCleaned,
                lastPlayed: newStats.happiness !== undefined ? new Date() : prev.lastPlayed,
            };

            // Сохраняем в localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('hippoStats', JSON.stringify(updatedStats));
            }

            return updatedHippo;
        });
    }, []);

    // Функции действий
    const feed = useCallback(() => {
        updateStats({
            hunger: Math.max(0, (hippo?.stats.hunger || 0) - 30),
            happiness: Math.min(100, (hippo?.stats.happiness || 0) + 10),
            energy: Math.min(100, (hippo?.stats.energy || 0) + 5),
        });
    }, [hippo?.stats.hunger, hippo?.stats.happiness, hippo?.stats.energy, updateStats]);

    const clean = useCallback(() => {
        updateStats({
            cleanliness: Math.min(100, (hippo?.stats.cleanliness || 0) + 40),
            happiness: Math.min(100, (hippo?.stats.happiness || 0) + 5),
        });
    }, [hippo?.stats.cleanliness, hippo?.stats.happiness, updateStats]);

    const play = useCallback(() => {
        updateStats({
            happiness: Math.min(100, (hippo?.stats.happiness || 0) + 20),
            energy: Math.max(0, (hippo?.stats.energy || 0) - 25),
            hunger: Math.min(100, (hippo?.stats.hunger || 0) + 10),
        });
    }, [hippo?.stats.happiness, hippo?.stats.energy, hippo?.stats.hunger, updateStats]);

    const sleep = useCallback(() => {
        updateStats({
            energy: Math.min(100, (hippo?.stats.energy || 0) + 50),
            health: Math.min(100, (hippo?.stats.health || 0) + 5),
        });
    }, [hippo?.stats.energy, hippo?.stats.health, updateStats]);

    // Автоматическое ухудшение статистики
    useEffect(() => {
        const interval = setInterval(() => {
            setHippo(prev => {
                if (!prev) return prev;

                const updatedStats = {
                    health: Math.max(0, prev.stats.health - 0.1),
                    hunger: Math.min(100, prev.stats.hunger + 0.2),
                    happiness: Math.max(0, prev.stats.happiness - 0.1),
                    cleanliness: Math.max(0, prev.stats.cleanliness - 0.15),
                    energy: Math.min(100, prev.stats.energy + 0.1),
                };

                // Сохраняем в localStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem('hippoStats', JSON.stringify(updatedStats));
                }

                return {
                    ...prev,
                    stats: updatedStats,
                };
            });
        }, 30000); // Каждые 30 секунд

        return () => clearInterval(interval);
    }, []);

    const value: HippoContextType = {
        hippo,
        setHippo,
        updateStats,
        feed,
        clean,
        play,
        sleep,
        resetHippo: () => {
            setHippo(initialHippo);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('hippoStats');
            }
        },
        hasCompletedOnboarding: !!hippo?.name && hippo.name !== 'Hippo',
        completeOnboarding: (name: string) => {
            setHippo(prev => prev ? { ...prev, name } : prev);
        },
    };

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