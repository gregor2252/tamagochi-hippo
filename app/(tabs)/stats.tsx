// app/(tabs)/stats.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ
import SimpleStatItem from '@/components/SimpleStatItem';
import StatSection from '@/components/StatSection';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useHippo } from '@/context/HippoContext';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function StatsScreen() {
    const { hippo, getAvailableItems } = useHippo();
    const router = useRouter();

    const handleResetHippo = () => {
        Alert.alert(
            'Сброс бегемотика',
            'Вы уверены? Это удалит все данные о вашем бегемотике.',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Для веба - очищаем localStorage
                            if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
                                localStorage.clear();
                            }

                            // Для телефона - очищаем через storage API
                            const keysToRemove = [
                                'hippoName',
                                'hippoGender',
                                'hippoAge',
                                'hippoStats',
                                'hasCreatedHippo',
                                'hippoOutfit',
                                'hippoCoins',
                                'unlockedItems',
                                'hippoFeedCount',
                                'hippoCleanCount',
                                'hippoPlayCount',
                                'hippoSleepCount',
                                'hippoWaterCount',
                            ];

                            for (const key of keysToRemove) {
                                try {
                                    await storage.removeItem(key);
                                } catch (e) {
                                    // Игнорируем ошибки для отдельных ключей
                                }
                            }
                            
                            // Перенаправляем на онбординг
                            router.replace('/onboarding');
                        } catch (error) {
                            console.error('Reset error:', error);
                            Alert.alert('Ошибка', 'Не удалось сбросить данные');
                        }
                    }
                }
            ]
        );
    };

    if (!hippo) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText type="title">📊 Статистика</ThemedText>
                <ThemedText style={styles.subtitle}>Загрузка данных...</ThemedText>
            </ThemedView>
        );
    }

    // Получаем все предметы и разблокированные предметы
    const availableItems = getAvailableItems();
    const unlockedItemsCount = availableItems.filter(item => item.unlocked).length;
    const totalItemsCount = availableItems.length;
    const equippedItemsCount = Object.keys(hippo.outfit || {}).length;

    // Рассчитываем общий счёт
    const totalScore = Math.round(
        hippo.stats.health * 0.25 +
        hippo.stats.happiness * 0.20 +
        hippo.stats.satiety * 0.15 +
        hippo.stats.cleanliness * 0.15 +
        hippo.stats.energy * 0.15 +
        hippo.stats.thirst * 0.10
    );

    // Рассчитываем уровень ухода
    const totalActions =
        (hippo.feedCount || 0) +
        (hippo.cleanCount || 0) +
        (hippo.playCount || 0) +
        (hippo.sleepCount || 0) +
        (hippo.waterCount || 0);

    // Определяем статус бегемотика
    const getHippoStatus = () => {
        if (totalScore >= 85) return { text: '🌟 Идеально', color: '#FFD700' };
        if (totalScore >= 70) return { text: '😊 Счастлив', color: '#4CAF50' };
        if (totalScore >= 50) return { text: '😐 Нормально', color: '#2196F3' };
        if (totalScore >= 30) return { text: '😟 Беспокоен', color: '#FF9800' };
        return { text: '😨 Требует ухода', color: '#F44336' };
    };

    const status = getHippoStatus();

    // Рассчитываем прогресс коллекции
    const collectionProgress = totalItemsCount > 0
        ? Math.round((unlockedItemsCount / totalItemsCount) * 100)
        : 0;

    // Рассчитываем прогресс монет
    const maxCoins = Math.max(hippo.coins, 1000); // 1000 как ориентир
    const coinsProgress = Math.min(100, Math.round((hippo.coins / maxCoins) * 100));

    // Рассчитываем прогресс действий
    const actionsProgress = Math.min(100, Math.round((totalActions / 50) * 100)); // 50 действий как цель

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Заголовок */}
                <View style={styles.header}>
                    <ThemedText type="title">📊 Статистика</ThemedText>
                    <ThemedText style={styles.subtitle}>
                        Отслеживайте прогресс вашего бегемотика
                    </ThemedText>
                </View>

                {/* Общая сводка */}
                <StatSection title="📈 Общий статус">
                    <View style={styles.summaryCard}>
                        <View style={styles.scoreContainer}>
                            <ThemedText style={styles.scoreLabel}>Общий счёт</ThemedText>
                            <ThemedText style={[styles.scoreValue, { color: status.color }]}>
                                {totalScore}/100
                            </ThemedText>
                        </View>
                        <View style={styles.statusContainer}>
                            <ThemedText style={[styles.statusText, { color: status.color }]}>
                                {status.text}
                            </ThemedText>
                        </View>
                    </View>

                    <View style={styles.summaryGrid}>
                        <View style={styles.summaryItem}>
                            <ThemedText style={styles.summaryIcon}>💰</ThemedText>
                            <ThemedText style={styles.summaryLabel}>Монеты</ThemedText>
                            <ThemedText style={styles.summaryValue}>{hippo.coins}</ThemedText>
                            <View style={styles.miniProgress}>
                                <View
                                    style={[
                                        styles.miniProgressFill,
                                        { width: `${coinsProgress}%`, backgroundColor: '#FFD700' }
                                    ]}
                                />
                            </View>
                        </View>

                        <View style={styles.summaryItem}>
                            <ThemedText style={styles.summaryIcon}>👕</ThemedText>
                            <ThemedText style={styles.summaryLabel}>Предметы</ThemedText>
                            <ThemedText style={styles.summaryValue}>
                                {unlockedItemsCount}/{totalItemsCount}
                            </ThemedText>
                            <View style={styles.miniProgress}>
                                <View
                                    style={[
                                        styles.miniProgressFill,
                                        { width: `${collectionProgress}%`, backgroundColor: '#4A90E2' }
                                    ]}
                                />
                            </View>
                        </View>

                        <View style={styles.summaryItem}>
                            <ThemedText style={styles.summaryIcon}>🎯</ThemedText>
                            <ThemedText style={styles.summaryLabel}>Действия</ThemedText>
                            <ThemedText style={styles.summaryValue}>{totalActions}</ThemedText>
                            <View style={styles.miniProgress}>
                                <View
                                    style={[
                                        styles.miniProgressFill,
                                        { width: `${actionsProgress}%`, backgroundColor: '#4CAF50' }
                                    ]}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Дополнительная информация о предметах */}
                    <View style={styles.collectionInfo}>
                        <ThemedText style={styles.collectionTitle}>Коллекция предметов:</ThemedText>
                        <View style={styles.collectionDetails}>
                            <View style={styles.collectionDetailItem}>
                                <ThemedText style={styles.collectionDetailIcon}>✅</ThemedText>
                                <ThemedText style={styles.collectionDetailText}>
                                    Открыто: {unlockedItemsCount}
                                </ThemedText>
                            </View>
                            <View style={styles.collectionDetailItem}>
                                <ThemedText style={styles.collectionDetailIcon}>👕</ThemedText>
                                <ThemedText style={styles.collectionDetailText}>
                                    Надето: {equippedItemsCount}
                                </ThemedText>
                            </View>
                            <View style={styles.collectionDetailItem}>
                                <ThemedText style={styles.collectionDetailIcon}>🎯</ThemedText>
                                <ThemedText style={styles.collectionDetailText}>
                                    Прогресс: {collectionProgress}%
                                </ThemedText>
                            </View>
                        </View>
                    </View>
                </StatSection>

                {/* Показатели здоровья */}
                <StatSection title="❤️ Показатели">
                    <SimpleStatItem
                        label="Здоровье"
                        value={`${Math.round(hippo.stats.health)}%`}
                        icon="❤️"
                        color="#F44336"
                        progress={hippo.stats.health}
                    />

                    <SimpleStatItem
                        label="Сытость"
                        value={`${Math.round(hippo.stats.satiety)}%`}
                        icon="🍖"
                        color="#FF9800"
                        progress={hippo.stats.satiety}
                    />

                    <SimpleStatItem
                        label="Настроение"
                        value={`${Math.round(hippo.stats.happiness)}%`}
                        icon="😊"
                        color="#FFC107"
                        progress={hippo.stats.happiness}
                    />

                    <SimpleStatItem
                        label="Чистота"
                        value={`${Math.round(hippo.stats.cleanliness)}%`}
                        icon="✨"
                        color="#2196F3"
                        progress={hippo.stats.cleanliness}
                    />

                    <SimpleStatItem
                        label="Энергия"
                        value={`${Math.round(hippo.stats.energy)}%`}
                        icon="⚡"
                        color="#9C27B0"
                        progress={hippo.stats.energy}
                    />

                    <SimpleStatItem
                        label="Жажда"
                        value={`${Math.round(hippo.stats.thirst)}%`}
                        icon="💧"
                        color="#03A9F4"
                        progress={hippo.stats.thirst}
                    />
                </StatSection>

                {/* Активность */}
                <StatSection title="📋 Активность">
                    <SimpleStatItem
                        label="Покормлено раз"
                        value={hippo.feedCount || 0}
                        icon="🍖"
                        color="#4CAF50"
                    />

                    <SimpleStatItem
                        label="Помыто раз"
                        value={hippo.cleanCount || 0}
                        icon="🛁"
                        color="#2196F3"
                    />

                    <SimpleStatItem
                        label="Поспано раз"
                        value={hippo.sleepCount || 0}
                        icon="😴"
                        color="#673AB7"
                    />

                    <SimpleStatItem
                        label="Напоено раз"
                        value={hippo.waterCount || 0}
                        icon="💧"
                        color="#00BCD4"
                    />
                </StatSection>

                {/* Информация о бегемотике */}
                <StatSection title="ℹ️ Информация">
                    <SimpleStatItem
                        label="Имя"
                        value={hippo.name}
                        icon="🏷️"
                        color="#795548"
                    />

                    <SimpleStatItem
                        label="Пол"
                        value={hippo.gender === 'male' ? 'Мальчик' : 'Девочка'}
                        icon={hippo.gender === 'male' ? '♂️' : '♀️'}
                        color="#E91E63"
                    />

                    <SimpleStatItem
                        label="Возраст"
                        value={hippo.age === 'child' ? 'Малыш' : 'Взрослый'}
                        icon="📅"
                        color="#607D8B"
                    />

                    <SimpleStatItem
                        label="Создан"
                        value={new Date(hippo.createdAt).toLocaleDateString('ru-RU')}
                        icon="🎉"
                        color="#FF5722"
                    />
                </StatSection>

                {/* Советы */}
                <StatSection title="💡 Советы">
                    <View style={styles.tipsContainer}>
                        {hippo.stats.thirst < 30 && (
                            <ThemedText style={styles.tip}>💧 Дайте бегемотику воды!</ThemedText>
                        )}
                        {hippo.stats.satiety < 30 && (
                            <ThemedText style={styles.tip}>🍖 Бегемотик голоден!</ThemedText>
                        )}
                        {hippo.stats.cleanliness < 40 && (
                            <ThemedText style={styles.tip}>✨ Пора помыть бегемотика!</ThemedText>
                        )}
                        {hippo.stats.energy < 20 && (
                            <ThemedText style={styles.tip}>😴 Бегемотику нужно поспать!</ThemedText>
                        )}
                        {hippo.stats.happiness < 50 && (
                            <ThemedText style={styles.tip}>🎮 Поиграйте с бегемотиком!</ThemedText>
                        )}

                        {unlockedItemsCount < 5 && (
                            <ThemedText style={styles.tip}>🛍️ Зайдите в магазин за новой одеждой!</ThemedText>
                        )}

                        {hippo.coins > 200 && (
                            <ThemedText style={styles.tip}>💰 У вас много монет! Купите что-нибудь в магазине!</ThemedText>
                        )}

                        {totalScore >= 80 && (
                            <ThemedText style={styles.tip}>🎉 Отличная забота! Продолжайте в том же духе!</ThemedText>
                        )}

                        {totalActions < 5 && (
                            <ThemedText style={styles.tip}>👶 Бегемотик новый? Чаще ухаживайте за ним!</ThemedText>
                        )}
                    </View>
                </StatSection>

                {/* КНОПКА СБРОСА */}
                <View style={styles.resetSection}>
                    <TouchableOpacity style={styles.resetButton} onPress={handleResetHippo}>
                        <ThemedText style={styles.resetButtonText}>🗑️ Сбросить бегемотика</ThemedText>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 20,
    },
    subtitle: {
        marginTop: 4,
        opacity: 0.8,
        fontSize: 16,
    },
    summaryCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.03)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    scoreContainer: {
        alignItems: 'flex-start',
    },
    scoreLabel: {
        fontSize: 14,
        opacity: 0.7,
        marginBottom: 4,
    },
    scoreValue: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    statusContainer: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    summaryGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 12,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.02)',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    summaryIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    summaryLabel: {
        fontSize: 12,
        opacity: 0.7,
        marginBottom: 2,
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    miniProgress: {
        width: '100%',
        height: 4,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    miniProgressFill: {
        height: '100%',
        borderRadius: 2,
    },
    collectionInfo: {
        backgroundColor: 'rgba(74, 144, 226, 0.05)',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(74, 144, 226, 0.1)',
    },
    collectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#4A90E2',
    },
    collectionDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    collectionDetailItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    collectionDetailIcon: {
        fontSize: 14,
    },
    collectionDetailText: {
        fontSize: 12,
        opacity: 0.8,
    },
    tipsContainer: {
        gap: 8,
    },
    tip: {
        fontSize: 14,
        padding: 10,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    resetSection: {
        marginTop: 20,
        marginBottom: 20,
    },
    resetButton: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#FF5252',
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    resetButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});