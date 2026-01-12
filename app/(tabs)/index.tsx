// app/(tabs)/index.tsx - ГЛАВНЫЙ ЭКРАН С ИЗМЕНЕННОЙ КНОПКОЙ ИГРАТЬ
import HippoView from '@/components/HippoView';
import { ThemedText } from '@/components/themed-text';
import { useHippo } from '@/context/HippoContext';
import { storage } from '@/utils/storage';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  TextInput,
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
  const [editingName, setEditingName] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(require('@/screens/Main/real_fon.png'));
  const [hippoMood, setHippoMood] = useState<'default' | 'hunger' | 'bath' | 'entertainment' | 'sleep' | 'water'>('default');
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  // Функция для определения текущего фона на основе времени
  const getBackgroundByTime = useCallback(() => {
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 5 && hours < 17) {
      return require('@/screens/Main/real_fon.png');
    }
    if (hours >= 17 && hours < 22) {
      return require('@/screens/Main/evening_fon.png');
    }
    return require('@/screens/Main/night_fon.png');
  }, []);

  useEffect(() => {
    setBackgroundImage(getBackgroundByTime());
    const interval = setInterval(() => {
      setBackgroundImage(getBackgroundByTime());
    }, 60000);
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
        setEditingName(savedName);
      }
    } catch (error) {
      console.error('Failed to load hippo name:', error);
    }
  };

  const setTemporaryMood = useCallback((mood: 'hunger' | 'bath' | 'entertainment' | 'sleep' | 'water') => {
    setHippoMood(mood);
    const timeout = mood === 'sleep' ? 20000 : 5000;
    setTimeout(() => {
      setHippoMood('default');
    }, timeout);
  }, []);

  const handleOpenSettings = () => {
    setEditingName(hippoName);
    setSettingsModalVisible(true);
  };

  const handleSaveName = async () => {
    if (!editingName.trim()) {
      Alert.alert('Ошибка', 'Имя не может быть пустым');
      return;
    }
    try {
      await storage.setItem('hippoName', editingName.trim());
      setHippoName(editingName.trim());
      setSettingsModalVisible(false);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить имя');
    }
  };

  // ОБНОВЛЕННАЯ ФУНКЦИЯ ДЛЯ КНОПКИ ИГРАТЬ
  const handlePlay = () => {
    // Просто переходим на страницу игр
    router.push('/games');
  };

  return (
    <View style={styles.mainContainer}>
      <ImageBackground source={backgroundImage} style={styles.background} resizeMode="stretch">
        {/* КНОПКА НАСТРОЕК СЛЕВА СВЕРХУ */}
        <TouchableOpacity style={styles.settingsButton} onPress={handleOpenSettings}>
          <ThemedText style={styles.settingsButtonText}>⚙️</ThemedText>
        </TouchableOpacity>

        {/* КОНТЕЙНЕР С МОНЕТАМИ */}
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
            {/* КОРМИТЬ */}
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

            {/* МЫТЬ */}
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

            {/* ИГРАТЬ - ОБНОВЛЕННАЯ КНОПКА */}
            <View style={styles.buttonWithStats}>
              <View style={[styles.statBarContainer, { height: Math.max(4, (hippo?.stats.happiness || 0) * 0.6) }]}>
                <View style={[styles.statBar, { backgroundColor: '#E91E63' }]} />
              </View>
              <TouchableOpacity
                style={styles.circleButton}
                onPress={handlePlay} // Просто переход на страницу игр
              >
                <Image source={playButtonImg} style={styles.buttonImage} />
              </TouchableOpacity>
            </View>

            {/* СПАТЬ */}
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

            {/* ПОИТЬ */}
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

      {/* МОДАЛЬНОЕ ОКНО НАСТРОЕК */}
      <Modal
        visible={settingsModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Настройки</ThemedText>
            <View style={styles.settingSection}>
              <ThemedText style={styles.settingLabel}>Имя бегемотика:</ThemedText>
              <TextInput
                style={styles.settingInput}
                value={editingName}
                onChangeText={setEditingName}
                maxLength={20}
                placeholder="Введите имя"
              />
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setSettingsModalVisible(false)}>
                <ThemedText style={styles.modalButtonText}>Отмена</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveName}>
                <ThemedText style={styles.saveButtonText}>Сохранить</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // ===== КНОПКА НАСТРОЕК =====
  settingsButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  settingsButtonText: {
    fontSize: 24,
  },
  // ===== КОНТЕЙНЕР С МОНЕТАМИ =====
  coinContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    zIndex: 10,
  },
  coinText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 12,
    paddingTop: 60,
  },
  // ===== ЗАГОЛОВОК =====
  header: {
    alignItems: 'center',
    marginBottom: 4,
    minHeight: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  // ===== КОНТЕЙНЕР С БЕГЕМОТИКОМ =====
  hippoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 250,
    marginBottom: 12,
  },
  // ===== КНОПКИ ДЕЙСТВИЙ =====
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 12,
    paddingTop: 20,
    gap: 4,
    paddingHorizontal: 4,
    marginTop: 'auto',
  },
  buttonWithStats: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 90,
  },
  statBarContainer: {
    width: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 5,
    marginBottom: 3,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  statBar: {
    width: '100%',
    height: '100%',
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonImage: {
    width: 50,
    height: 50,
    resizeMode: 'stretch',
  },
  // ===== МОДАЛЬНОЕ ОКНО НАСТРОЕК =====
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#D9D0C5',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingSection: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  settingInput: {
    borderWidth: 2,
    borderColor: '#A65437',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#1a1a1a',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#A65437',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A65437',
  },
  saveButton: {
    backgroundColor: '#A65437',
    borderColor: '#A65437',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});