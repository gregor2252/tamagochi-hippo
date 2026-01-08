// app/(tabs)/index.tsx - ОБНОВЛЕННАЯ ВЕРСИЯ С МОНЕТАМИ
import HippoView from '@/components/HippoView';
import { ThemedText } from '@/components/themed-text';
import { useHippo } from '@/context/HippoContext';
import { Link } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

const backgroundImage = require('@/screens/Main/real_fon.png');
const feedButtonImg = require('@/assets/images/eat_button.png');
const bathButtonImg = require('@/assets/images/bath_button.png');
const playButtonImg = require('@/assets/images/talk_button.png');
const sleepButtonImg = require('@/assets/images/sleep_button.png');
const waterButtonImg = require('@/assets/images/water_button.png');

export default function HomeScreen() {
  const { hippo } = useHippo();
  const [hippoName, setHippoName] = useState('Бегемотик');

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
    const { happiness, satiety, energy, cleanliness, thirst } = hippo.stats;

    if (thirst > 80) return 'thirsty';
    if (satiety < 20) return 'hungry';
    if (energy < 15) return 'sleepy';
    if (cleanliness < 25) return 'dirty';
    if (happiness < 30) return 'sad';

    return 'happy';
  }, [hippo]);

  const navigateTo = useCallback((path: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  }, []);

  const handleResetHippo = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (confirm('Вы уверены? Это удалит всё')) {
        localStorage.removeItem('hippoName');
        localStorage.removeItem('hippoStats');
        localStorage.removeItem('hasCreatedHippo');
        localStorage.removeItem('hippoOutfit');
        localStorage.removeItem('hippoCoins');
        localStorage.removeItem('unlockedItems');
        window.location.href = '/onboarding';
      }
    }
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.sidebarLeft} />

      <View style={styles.centerContainer}>
        <ImageBackground source={backgroundImage} style={styles.background}>
          {/* НОВЫЙ КОНТЕЙНЕР С МОНЕТАМИ В ПРАВОМ ВЕРХНЕМ УГЛУ */}
          <View style={styles.coinContainer}>
            <ThemedText style={styles.coinText}>💰 {hippo?.coins || 0}</ThemedText>
          </View>

          <View style={styles.contentWrapper}>
            <View style={styles.header}>
              <ThemedText style={styles.title}>{hippoName}</ThemedText>
            </View>

            <View style={styles.hippoContainer}>
              <HippoView mood={getHippoMood()} size="medium" />
            </View>

            <View style={styles.actionButtonsContainer}>
              <View style={styles.buttonWithStats}>
                <View style={[styles.statBarContainer, { height: Math.max(4, (hippo?.stats.satiety || 0) * 0.6) }]}>
                  <View style={[styles.statBar, { backgroundColor: '#FF9800' }]} />
                </View>
                <TouchableOpacity style={styles.circleButton} onPress={() => navigateTo('/(tabs)/care')}>
                  <Image source={feedButtonImg} style={styles.buttonImage} />
                </TouchableOpacity>
              </View>

              <View style={styles.buttonWithStats}>
                <View style={[styles.statBarContainer, { height: Math.max(4, (hippo?.stats.cleanliness || 0) * 0.6) }]}>
                  <View style={[styles.statBar, { backgroundColor: '#2196F3' }]} />
                </View>
                <TouchableOpacity style={styles.circleButton} onPress={() => navigateTo('/(tabs)/care')}>
                  <Image source={bathButtonImg} style={styles.buttonImage} />
                </TouchableOpacity>
              </View>

              <View style={styles.buttonWithStats}>
                <View style={[styles.statBarContainer, { height: Math.max(4, (hippo?.stats.happiness || 0) * 0.6) }]}>
                  <View style={[styles.statBar, { backgroundColor: '#E91E63' }]} />
                </View>
                <TouchableOpacity style={styles.circleButton} onPress={() => navigateTo('/(tabs)/care')}>
                  <Image source={playButtonImg} style={styles.buttonImage} />
                </TouchableOpacity>
              </View>

              <View style={styles.buttonWithStats}>
                <View style={[styles.statBarContainer, { height: Math.max(4, (hippo?.stats.energy || 0) * 0.6) }]}>
                  <View style={[styles.statBar, { backgroundColor: '#9C27B0' }]} />
                </View>
                <TouchableOpacity style={styles.circleButton} onPress={() => navigateTo('/(tabs)/care')}>
                  <Image source={sleepButtonImg} style={styles.buttonImage} />
                </TouchableOpacity>
              </View>

              <View style={styles.buttonWithStats}>
                <View style={[styles.statBarContainer, { height: Math.max(4, (hippo?.stats.health || 0) * 0.6) }]}>
                  <View style={[styles.statBar, { backgroundColor: '#4CAF50' }]} />
                </View>
                <TouchableOpacity style={styles.circleButton} onPress={() => navigateTo('/(tabs)/care')}>
                  <Image source={waterButtonImg} style={styles.buttonImage} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.sidebarRight}>
        <TouchableOpacity style={styles.sideButton} onPress={() => navigateTo('/(tabs)/care')}>
          <ThemedText style={styles.sideButtonEmoji}>🏥</ThemedText>
          <ThemedText style={styles.sideButtonText}>Уход</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideButton} onPress={() => navigateTo('/(tabs)/shop')}>
          <ThemedText style={styles.sideButtonEmoji}>🛍️</ThemedText>
          <ThemedText style={styles.sideButtonText}>Магазин</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideButton} onPress={() => navigateTo('/(tabs)/stats')}>
          <ThemedText style={styles.sideButtonEmoji}>📊</ThemedText>
          <ThemedText style={styles.sideButtonText}>Статистика</ThemedText>
        </TouchableOpacity>

        <View style={styles.sideButtonDivider} />

        <Link href="/onboarding" asChild>
          <TouchableOpacity style={styles.sideButton}>
            <ThemedText style={styles.sideButtonText}>Имя</ThemedText>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.sideButton} onPress={handleResetHippo}>
          <ThemedText style={[styles.sideButtonText, styles.resetText]}>Сброс</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ===== ОСНОВНОЙ КОНТЕЙНЕР =====
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
  },

  // ===== БОКОВЫЕ ПАНЕЛИ =====
  sidebarLeft: {
    width: '15%',
    backgroundColor: '#1a1a1a',
  },

  // ===== ЦЕНТРАЛЬНАЯ ОБЛАСТЬ С ФОНОМ =====
  centerContainer: {
    width: '70%',
    position: 'relative', // Для позиционирования контейнера с монетами
  },

  background: {
    flex: 1,
    resizeMode: 'cover',
  },

  // ===== КОНТЕЙНЕР С МОНЕТАМИ =====
  coinContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
  },

  coinText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },

  contentWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },

  // ===== ЗАГОЛОВОК БЕЗ ЛОГОТИПА =====
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  },

  // ===== КОНТЕЙНЕР С БЕГЕМОТИКОМ =====
  hippoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  // ===== КНОПКИ ДЕЙСТВИЙ =====
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 8,
    gap: 8,
    paddingHorizontal: 8,
  },

  buttonWithStats: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 120,
  },

  statBarContainer: {
    width: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 6,
    marginBottom: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },

  statBar: {
    width: '100%',
    height: '100%',
  },

  circleButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },

  buttonImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },

  // ===== ПРАВАЯ БОКОВАЯ ПАНЕЛЬ =====
  sidebarRight: {
    width: '15%',
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
  },

  sideButton: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  sideButtonEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },

  sideButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },

  sideButtonDivider: {
    width: '80%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 8,
  },

  resetText: {
    color: '#FF5252',
  },
});