// app/(tabs)/index.tsx - УПРОЩЕННАЯ ВЕРСИЯ БЕЗ ДУБЛИРУЮЩИХСЯ ТАБОВ
import HippoView from '@/components/HippoView';
import StatBar from '@/components/StatBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useHippo } from '@/context/HippoContext';
import { Link } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { hippo } = useHippo();

  // Состояние для принудительного обновления
  const [refreshKey, setRefreshKey] = useState(0);

  // Временное состояние для имени
  const [hippoName, setHippoName] = useState('Hippo');

  // Загружаем имя при монтировании и при изменении hippo
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('hippoName');
      if (savedName) {
        setHippoName(savedName);
      }
    }
  }, [hippo]);

  const getHippoMood = useCallback(() => {
    if (!hippo) return 'happy';
    const { happiness, hunger, energy, cleanliness } = hippo.stats;

    if (hunger > 70) return 'hungry';
    if (energy < 20) return 'sleepy';
    if (cleanliness < 30) return 'dirty';
    if (happiness < 40) return 'sad';
    return 'happy';
  }, [hippo]);

  const formatAge = useCallback((days: number) => {
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''}`;
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks !== 1 ? 's' : ''}`;
  }, []);

  // Простые функции навигации
  const navigateTo = useCallback((path: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  }, []);

  // Функция для обновления страницы
  const refreshPage = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // Функция для сброса гиппопотама
  const handleResetHippo = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (confirm('Are you sure you want to reset your hippo? This will delete all progress.')) {
        localStorage.removeItem('hippoName');
        localStorage.removeItem('hippoStats');
        localStorage.removeItem('hasCreatedHippo');
        window.location.href = '/onboarding';
      }
    }
  }, []);

  return (
    <ThemedView style={styles.container}>
      {/* Скрытый элемент для отслеживания обновлений */}
      <View style={{ display: 'none' }}>{refreshKey}</View>

      {/* Header с кнопкой обновления */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ThemedText type="title">{hippoName}</ThemedText>
          <ThemedText style={styles.age}>
            Age: {hippo ? formatAge(hippo.age) : '1 day'}
          </ThemedText>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={refreshPage} style={styles.refreshButton}>
            <IconSymbol name="arrow.clockwise" size={20} color="#4A90E2" />
            <ThemedText style={styles.refreshText}>Refresh</ThemedText>
          </TouchableOpacity>
          <Link href="/modal">
            <ThemedText type="link">Settings</ThemedText>
          </Link>
        </View>
      </View>

      {/* Hippo Display */}
      <HippoView mood={getHippoMood()} size="medium" />

      {/* Stats */}
      <ThemedView style={styles.statsContainer}>
        <ThemedText type="subtitle" style={styles.statsTitle}>
          Stats
        </ThemedText>

        {hippo ? (
          <>
            <StatBar
              label="Health"
              value={Math.round(hippo.stats.health)}
              color="#4CAF50"
              key={`health-${hippo.stats.health}-${refreshKey}`}
            />
            <StatBar
              label="Hunger"
              value={Math.round(hippo.stats.hunger)}
              color="#FF9800"
              key={`hunger-${hippo.stats.hunger}-${refreshKey}`}
            />
            <StatBar
              label="Happiness"
              value={Math.round(hippo.stats.happiness)}
              color="#E91E63"
              key={`happiness-${hippo.stats.happiness}-${refreshKey}`}
            />
            <StatBar
              label="Cleanliness"
              value={Math.round(hippo.stats.cleanliness)}
              color="#2196F3"
              key={`cleanliness-${hippo.stats.cleanliness}-${refreshKey}`}
            />
            <StatBar
              label="Energy"
              value={Math.round(hippo.stats.energy)}
              color="#9C27B0"
              key={`energy-${hippo.stats.energy}-${refreshKey}`}
            />
          </>
        ) : (
          <ThemedText style={styles.noStats}>
            No hippo stats available. Create a hippo first!
          </ThemedText>
        )}
      </ThemedView>

      {/* Quick Actions - ТОЛЬКО ЭТИ 3 КНОПКИ */}
      <View style={styles.quickActions}>
        <ThemedText type="subtitle" style={styles.actionsTitle}>
          Navigation
        </ThemedText>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigateTo('/(tabs)/care')}
          >
            <IconSymbol name="heart.fill" size={28} color="#fff" />
            <ThemedText style={styles.actionText}>Care</ThemedText>
            <ThemedText style={styles.actionSubtext}>Feed, Clean, Play</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.shopButton]}
            onPress={() => navigateTo('/(tabs)/shop')}
          >
            <IconSymbol name="cart.fill" size={28} color="#fff" />
            <ThemedText style={styles.actionText}>Shop</ThemedText>
            <ThemedText style={styles.actionSubtext}>Buy items</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.statsButton]}
            onPress={() => navigateTo('/(tabs)/stats')}
          >
            <IconSymbol name="chart.bar.fill" size={28} color="#fff" />
            <ThemedText style={styles.actionText}>Stats</ThemedText>
            <ThemedText style={styles.actionSubtext}>Progress</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tips */}
      <View style={styles.tips}>
        <ThemedText style={styles.tipTitle}>💡 Tips:</ThemedText>
        <ThemedText style={styles.tip}>
          • Go to <ThemedText style={styles.bold}>Care</ThemedText> to feed, clean, play with, and put your hippo to sleep
        </ThemedText>
        <ThemedText style={styles.tip}>
          • Keep all stats above 30% for a happy hippo
        </ThemedText>
        <ThemedText style={styles.tip}>
          • Low energy? Try the <ThemedText style={styles.bold}>Sleep</ThemedText> action in Care
        </ThemedText>
      </View>

      {/* Links */}
      <View style={styles.links}>
        <View style={styles.linkGroup}>
          <Link href="/onboarding">
            <ThemedText type="link">Edit Name</ThemedText>
          </Link>
          <TouchableOpacity onPress={handleResetHippo}>
            <ThemedText type="link" style={styles.resetLink}>Reset Hippo</ThemedText>
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.version}>Hippo Tamagotchi v1.0</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 6,
  },
  refreshText: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
  },
  age: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  statsContainer: {
    marginTop: 30,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 20,
  },
  statsTitle: {
    marginBottom: 15,
  },
  noStats: {
    textAlign: 'center',
    padding: 20,
    opacity: 0.7,
  },
  quickActions: {
    marginTop: 30,
    marginBottom: 30,
  },
  actionsTitle: {
    marginBottom: 15,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 100,
  },
  shopButton: {
    backgroundColor: '#FF9800',
  },
  statsButton: {
    backgroundColor: '#9C27B0',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    marginTop: 8,
    fontSize: 16,
  },
  actionSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  // УБРАН блок tabsContainer - больше нет дублирующихся табов!

  // Остальные стили
  tips: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 235, 59, 0.2)',
    borderRadius: 8,
    marginBottom: 30,
  },
  tipTitle: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 16,
  },
  tip: {
    marginLeft: 10,
    marginBottom: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  linkGroup: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  resetLink: {
    color: '#FF5252',
  },
  version: {
    fontSize: 12,
    opacity: 0.5,
  },
});