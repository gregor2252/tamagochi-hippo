// app/(tabs)/care.tsx - ВЕРСИЯ С МИНИ-ИГРОЙ
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useHippo } from '@/context/HippoContext';
import { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

// Импортируем компонент игры (создайте этот файл)
import BubbleGame from '@/components/mini-games/BubbleGame';

export default function CareScreen() {
  const { hippo, feed, clean, play, sleep, giveWater, addCoins } = useHippo();
  const [showGame, setShowGame] = useState(false);
  const [gameScore, setGameScore] = useState(0);

  const handleFeed = () => {
    feed();
    addCoins(5); // Добавляем монеты за кормление
    Alert.alert('🍖 Накормлено!', 'Бегемотик доволен! +5 монет');
  };

  const handleClean = () => {
    clean();
    addCoins(5); // Добавляем монеты за умывание
    Alert.alert('🛁 Помыто!', 'Бегемотик чистый и свежий! +5 монет');
  };

  const handlePlay = () => {
    if ((hippo?.stats.energy || 0) < 20) {
      Alert.alert('😴 Устал', 'Бегемотику нужно спать!');
      return;
    }

    // Запускаем мини-игру вместо стандартной игры
    setShowGame(true);
  };

  const handleSleep = () => {
    sleep();
    addCoins(3); // Меньше монет за сон
    Alert.alert('😴 Спит!', 'Бегемотик отдыхает и набирает энергию! +3 монеты');
  };

  const handleWater = () => {
    giveWater();
    addCoins(4); // Монеты за поение
    Alert.alert('💧 Напоено!', 'Бегемотик освежился! +4 монеты');
  };

  // Обработчик завершения игры
  // Обработчик завершения игры
  const handleGameEnd = (score: number) => {
    setGameScore(score);
    setShowGame(false);

    // Вызываем стандартную функцию игры
    play(); // play() не возвращает значение

    // Дополнительные награды в зависимости от счета
    const happinessBonus = Math.min(20, score * 0.5); // +0.5 настроения за очко
    const coinsBonus = Math.floor(score / 5); // +1 монета за каждые 5 очков

    // Добавляем монеты за игру
    addCoins(10 + coinsBonus); // 10 базовых + бонус

    Alert.alert(
      '🎮 Игра окончена!',
      `Вы набрали ${score} очков!\n` +
      `+${Math.round(happinessBonus)} к настроению\n` +
      `+${10 + coinsBonus} монет`,
      [{ text: 'Отлично!', style: 'default' }]
    );
  };

  // Функция для закрытия игры без начисления очков
  const handleGameClose = () => {
    setShowGame(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Уход за {hippo?.gender === 'male' ? 'бегемотиком' : 'бегемотичкой'}
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Помогите {hippo?.name || 'бегемотику'} быть счастливым и здоровым
      </ThemedText>

      <View style={styles.statsPreview}>
        <ThemedText style={styles.statsTitle}>Текущие показатели:</ThemedText>
        {hippo && (
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statEmoji}>❤️</ThemedText>
              <ThemedText style={styles.statLabel}>Здоровье:</ThemedText>
              <ThemedText style={styles.statValue}>{Math.round(hippo.stats.health)}%</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statEmoji}>🍖</ThemedText>
              <ThemedText style={styles.statLabel}>Сытость:</ThemedText>
              <ThemedText style={styles.statValue}>{Math.round(hippo.stats.satiety)}%</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statEmoji}>😊</ThemedText>
              <ThemedText style={styles.statLabel}>Настроение:</ThemedText>
              <ThemedText style={styles.statValue}>{Math.round(hippo.stats.happiness)}%</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statEmoji}>✨</ThemedText>
              <ThemedText style={styles.statLabel}>Чистота:</ThemedText>
              <ThemedText style={styles.statValue}>{Math.round(hippo.stats.cleanliness)}%</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statEmoji}>⚡</ThemedText>
              <ThemedText style={styles.statLabel}>Энергия:</ThemedText>
              <ThemedText style={styles.statValue}>{Math.round(hippo.stats.energy)}%</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statEmoji}>💧</ThemedText>
              <ThemedText style={styles.statLabel}>Жажда:</ThemedText>
              <ThemedText style={styles.statValue}>{Math.round(hippo.stats.thirst)}%</ThemedText>
            </View>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <ActionButtonWithIcon
          title="Кормить"
          icon={require('@/assets/images/eat_button.png')}
          onPress={handleFeed}
        />
        <ActionButtonWithIcon
          title="Мыть"
          icon={require('@/assets/images/bath_button.png')}
          onPress={handleClean}
        />
        <ActionButtonWithIcon
          title="Играть"
          icon={require('@/assets/images/talk_button.png')}
          onPress={handlePlay}
          disabled={(hippo?.stats.energy || 0) < 20}
        />
        <ActionButtonWithIcon
          title="Спать"
          icon={require('@/assets/images/sleep_button.png')}
          onPress={handleSleep}
        />
        <ActionButtonWithIcon
          title="Поить"
          icon={require('@/assets/images/water_button.png')}
          onPress={handleWater}
        />
      </View>

      {/* Информация об игре */}
      {(hippo?.stats.energy || 0) >= 20 && (
        <View style={styles.gameInfo}>
          <ThemedText style={styles.gameInfoTitle}>🎮 Мини-игра!</ThemedText>
          <ThemedText style={styles.gameInfoText}>
            Нажмите "Играть" чтобы поиграть в мини-игру с бегемотиком и получить дополнительные награды!
          </ThemedText>
          <ThemedText style={styles.gameInfoSubtext}>
            Чем больше очков заработаете, тем больше монет получите!
          </ThemedText>
        </View>
      )}

      <View style={styles.tips}>
        <ThemedText style={styles.tipTitle}>💡 Советы по уходу:</ThemedText>
        <ThemedText style={styles.tip}>• Кормите, когда сытость ниже 50%</ThemedText>
        <ThemedText style={styles.tip}>• Мойте, когда чистота ниже 40%</ThemedText>
        <ThemedText style={styles.tip}>• Играйте, когда энергия выше 20%</ThemedText>
        <ThemedText style={styles.tip}>• Укладывайте спать, когда энергия ниже 30%</ThemedText>
        <ThemedText style={styles.tip}>• Поите, когда жажда выше 50%</ThemedText>
        <ThemedText style={styles.tip}>• Следите за здоровьем - оно влияет на все показатели</ThemedText>
        <ThemedText style={styles.tip}>• Высокая жажда снижает здоровье и настроение</ThemedText>
      </View>

      {/* Модальное окно с игрой */}
      <Modal
        visible={showGame}
        animationType="slide"
        transparent={false}
        statusBarTranslucent={true}
        onRequestClose={handleGameClose}
      >
        <BubbleGame
          onGameEnd={handleGameEnd}
          onClose={handleGameClose}
        />
      </Modal>
    </ThemedView>
  );
}

function ActionButtonWithIcon({ title, icon, onPress, disabled = false }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Image source={icon} style={styles.buttonIcon} />
      <ThemedText style={styles.buttonText}>{title}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
    opacity: 0.8,
  },
  statsPreview: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  statsTitle: {
    fontWeight: '600',
    marginBottom: 12,
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  statItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 6,
  },
  statEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  statLabel: {
    fontSize: 12,
    flex: 1,
    opacity: 0.8,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A90E2',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    width: '31%',
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonIcon: {
    width: 40,
    height: 40,
    marginBottom: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  // Новые стили для информации об игре
  gameInfo: {
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.2)',
  },
  gameInfoTitle: {
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 14,
    color: '#9B59B6',
  },
  gameInfoText: {
    fontSize: 13,
    marginBottom: 4,
    color: '#34495E',
  },
  gameInfoSubtext: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#7F8C8D',
  },
  tips: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  tipTitle: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 14,
  },
  tip: {
    marginLeft: 8,
    marginBottom: 3,
    fontSize: 13,
  },
});