// app/(tabs)/index.tsx - ГЛАВНЫЙ ЭКРАН С ДИНАМИЧЕСКИМИ КАРТИНКАМИ
import HippoView from '@/components/HippoView';
import { ThemedText } from '@/components/themed-text';
import { useHippo } from '@/context/HippoContext';
import { storage } from '@/utils/storage';
import { Link, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

const feedButtonImg = require('@/assets/images/eat_button.png');
const bathButtonImg = require('@/assets/images/bath_button.png');
const playButtonImg = require('@/assets/images/talk_button.png');
const sleepButtonImg = require('@/assets/images/sleep_button.png');
const waterButtonImg = require('@/assets/images/water_button.png');

export default function HomeScreen() {
  const router = useRouter();
  const { hippo, feed, clean, play, sleep, giveWater } = useHippo();
  const [hippoName, setHippoName] = useState('Бегемотик');
  const [backgroundImage, setBackgroundImage] = useState(require('@/screens/Main/real_fon.png'));
  const [hippoMood, setHippoMood] = useState<'default' | 'hunger' | 'bath' | 'entertainment' | 'sleep' | 'water'>('default');

  // Функция для определения текущего фона на основе времени
  const getBackgroundByTime = useCallback(() => {
    const now = new Date();
    const hours = now.getHours();
    // 05:00 - 17:00 -> real_fon
    if (hours >= 5 && hours < 17) {
      return require('@/screens/Main/real_fon.png');
    }
    // 17:00 - 22:00 -> evening_fon
    if (hours >= 17 && hours < 22) {
      return require('@/screens/Main/evening_fon.png');
    }
    // 22:00 - 05:00 -> night_fon
    return require('@/screens/Main/night_fon.png');
  }, []);

  // Обновление фона при монтировании и каждую минуту
  useEffect(() => {
    setBackgroundImage(getBackgroundByTime());
    // Обновляем фон каждую минуту
    const interval = setInterval(() => {
      setBackgroundImage(getBackgroundByTime());
    }, 60000); // 60000 мс = 1 минута
    return () => clearInterval(interval);
  }, [getBackgroundByTime]);

  useEffect(() => {
    loadHippoName();
  }, [hippo]);

  const loadHippoName = async () => {
    try {
      const savedName = await storage.getItem('hippoName');
      if (savedName) {
        setHippoName(savedName);
      }
    } catch (error) {
      console.error('Failed to load hippo name:', error);
    }
  };

  // Функция для смены настроения бегемотика с автоматическим возвратом
  const setTemporaryMood = useCallback((mood: 'hunger' | 'bath' | 'entertainment' | 'sleep' | 'water') => {
    setHippoMood(mood);
    const timeout = mood === 'sleep' ? 20000 : 5000; // 20 сек для сна, 5 сек для остальных
    setTimeout(() => {
      setHippoMood('default');
    }, timeout);
  }, []);

  const navigateTo = useCallback((path: string) => {
    router.push(path as any);
  }, [router]);

  const handleResetHippo = useCallback(async () => {
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
              await Promise.all([
                storage.removeItem('hippoName'),
                storage.removeItem('hippoGender'),
                storage.removeItem('hippoAge'),
                storage.removeItem('hippoStats'),
                storage.removeItem('hasCreatedHippo'),
                storage.removeItem('hippoOutfit'),
                storage.removeItem('hippoCoins'),
                storage.removeItem('unlockedItems'),
              ]);

              // Редирект на онбординг
              router.replace('/onboarding');
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось сбросить данные');
            }
          }
        }
      ]
    );
  }, [router]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.sidebarLeft} />
      <View style={styles.centerContainer}>
        <ImageBackground source={backgroundImage} style={styles.background} resizeMode="stretch">
          {/* КОНТЕЙНЕР С МОНЕТАМИ В ПРАВОМ ВЕРХНЕМ УГЛУ */}
          <View style={styles.coinContainer}>
            <ThemedText style={styles.coinText}>💰 {hippo?.coins || 0}</ThemedText>
          </View>
          <View style={styles.contentWrapper}>
            <View style={styles.header}>
              <ThemedText style={styles.title}>{hippoName}</ThemedText>
            </View>
            <View style={styles.hippoContainer}>
              {hippo && (
                <HippoView mood={hippoMood} size="medium" age={(hippo.age as unknown as 'child' | 'parent') || 'child'} />
              )}
            </View>
            <View style={styles.actionButtonsContainer}>
              <View style={styles.buttonWithStats}>
                <View style={[styles.statBarContainer, { height: Math.max(4, (hippo?.stats.satiety || 0) * 0.6) }]}>
                  <View style={[styles.statBar, { backgroundColor: '#FF9800' }]} />
                </View>
                <TouchableOpacity
                  style={styles.circleButton}
                  onPress={() => {
                    setTemporaryMood('hunger');
                    feed();
                  }}
                >
                  <Image source={feedButtonImg} style={styles.buttonImage} />
                </TouchableOpacity>
              </View>
              <View style={styles.buttonWithStats}>
                <View style={[styles.statBarContainer, { height: Math.max(4, (hippo?.stats.cleanliness || 0) * 0.6) }]}>
                  <View style={[styles.statBar, { backgroundColor: '#2196F3' }]} />
                </View>
                <TouchableOpacity
                  style={styles.circleButton}
                  onPress={() => {
                    setTemporaryMood('bath');
                    clean();
                  }}
                >
                  <Image source={bathButtonImg} style={styles.buttonImage} />
                </TouchableOpacity>
              </View>
              <View style={styles.buttonWithStats}>
                <View style={[styles.statBarContainer, { height: Math.max(4, (hippo?.stats.happiness || 0) * 0.6) }]}>
                  <View style={[styles.statBar, { backgroundColor: '#E91E63' }]} />
                </View>
                <TouchableOpacity
                  style={styles.circleButton}
                  onPress={() => {
                    setTemporaryMood('entertainment');
                    play();
                  }}
                >
                  <Image source={playButtonImg} style={styles.buttonImage} />
                </TouchableOpacity>
              </View>
              <View style={styles.buttonWithStats}>
                <View style={[styles.statBarContainer, { height: Math.max(4, (hippo?.stats.energy || 0) * 0.6) }]}>
                  <View style={[styles.statBar, { backgroundColor: '#9C27B0' }]} />
                </View>
                <TouchableOpacity
                  style={styles.circleButton}
                  onPress={() => {
                    setTemporaryMood('sleep');
                    sleep();
                  }}
                >
                  <Image source={sleepButtonImg} style={styles.buttonImage} />
                </TouchableOpacity>
              </View>
              <View style={styles.buttonWithStats}>
                <View style={[styles.statBarContainer, { height: Math.max(4, (hippo?.stats.thirst || 0) * 0.6) }]}>
                  <View style={[styles.statBar, { backgroundColor: '#4CAF50' }]} />
                </View>
                <TouchableOpacity
                  style={styles.circleButton}
                  onPress={() => {
                    setTemporaryMood('water');
                    giveWater();
                  }}
                >
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
    flex: 1,
    width: '70%',
    position: 'relative',
    overflow: 'hidden',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
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
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  // ===== ЗАГОЛОВОК =====
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
    marginTop: 200, // НАСТРОЙКА: увеличено для опускания бегемотика ниже
    marginBottom: 20,
  },
  // ===== КНОПКИ ДЕЙСТВИЙ =====
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 20,
    paddingTop: 40,
    gap: 8,
    paddingHorizontal: 8,
    marginTop: 'auto',
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
    resizeMode: 'stretch',
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