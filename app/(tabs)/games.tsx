// app/(tabs)/games.tsx - ПОЛНОСТЬЮ ПЕРЕРАБОТАННЫЙ ДИЗАЙН С ФОНОМ И НОВЫМИ КНОПКАМИ
import { ThemedText } from '@/components/themed-text';
import { useHippo } from '@/context/HippoContext';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
// Импорты компонентов
import EnergyBar from '@/components/mini-games/EnergyBar';
import GameCard from '@/components/mini-games/GameCard';
import NavigationArrows from '@/components/mini-games/NavigationArrows';
// Импорты игр
import BubbleGame from '@/components/mini-games/BubbleGame';
import DiceGuessGame from '@/components/mini-games/DiceGuessGame';
import MemoryGame from '@/components/mini-games/MemoryGame';

const GAMES = [
  {
    id: 'bubble',
    title: 'Лопай пузыри',
    icon: require('@/models/icons/games/bubble_icon.png'),
    energyCost: 20,
  },
  {
    id: 'diceGuess',
    title: 'Угадай число',
    icon: require('@/models/icons/games/number icon.png'),
    energyCost: 20,
  },
  {
    id: 'memory',
    title: 'Игра на память',
    icon: require('@/models/icons/games/logic icon.png'),
    energyCost: 20,
  },
  {
    id: 'comingSoon',
    title: 'Скоро...',
    icon: require('@/models/icons/games/coming soon.png'),
    energyCost: 20,
    isComingSoon: true,
  },
];

export default function GamesScreen() {
  const { hippo, addCoins, updateStats } = useHippo();
  const [activeGame, setActiveGame] = useState<'bubble' | 'diceGuess' | 'memory' | null>(null);
  const [selectedGameType, setSelectedGameType] = useState<'bubble' | 'diceGuess' | 'memory' | null>(null);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState(require('@/screens/Main/real_fon.png'));

  const currentEnergy = hippo?.stats.energy || 0;
  const currentGame = GAMES[currentGameIndex];

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

  const handleGameStart = (gameType: 'bubble' | 'diceGuess' | 'memory') => {
    const game = GAMES.find(g => g.id === gameType);
    if (!game) return;

    if (currentEnergy < game.energyCost) {
      Alert.alert('😴 Бегемотик устал!', `Нужно ${game.energyCost}% энергии для этой игры`);
      return;
    }

    setSelectedGameType(gameType);
    setActiveGame(gameType);
  };

  const handleGameEnd = (score: number) => {
    setActiveGame(null);

    if (score > 0) {
      const game = GAMES.find(g => g.id === selectedGameType);
      if (!game) return;

      // Списываем энергию и добавляем настроение
      updateStats({
        happiness: Math.min(100, (hippo?.stats.happiness || 0) + 10),
        energy: Math.max(0, currentEnergy - game.energyCost),
        satiety: Math.max(0, (hippo?.stats.satiety || 0) - 5),
        thirst: Math.max(0, (hippo?.stats.thirst || 0) - 5),
      });

      // Вычисляем награды
      const happinessBonus = Math.min(30, score * 0.1);
      let baseCoins = 10;
      if (selectedGameType === 'diceGuess') baseCoins = 12;
      if (selectedGameType === 'memory') baseCoins = 15;

      const coinsBonus = Math.floor(score / 20);
      addCoins(baseCoins + coinsBonus);

      Alert.alert(
        '🎮 Игра окончена!',
        `Вы набрали ${score} очков!\n` +
        `+${Math.round(10 + happinessBonus)} к настроению\n` +
        `-${game.energyCost}% энергии\n` +
        `+${baseCoins + coinsBonus} монет`,
        [{ text: 'Отлично!', style: 'default' }]
      );
    }

    setSelectedGameType(null);
  };

  const handleGameClose = () => {
    setActiveGame(null);
    setSelectedGameType(null);
  };

  const handlePrevious = () => {
    setCurrentGameIndex((prev) => (prev - 1 + GAMES.length) % GAMES.length);
  };

  const handleNext = () => {
    setCurrentGameIndex((prev) => (prev + 1) % GAMES.length);
  };

  const isComingSoon = currentGame?.isComingSoon || false;

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="stretch"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ЗАГОЛОВОК */}
        <View style={styles.headerSection}>
          <ThemedText style={styles.title}>Мини-игры</ThemedText>
        </View>

        {/* ШКАЛА ЭНЕРГИИ */}
        <View style={styles.contentPadding}>
          <EnergyBar current={currentEnergy} max={100} />
        </View>

        {/* КАРТОЧКА ИГРЫ */}
        <View style={styles.contentPadding}>
          {isComingSoon ? (
            <View style={styles.comingSoonCard}>
              <View style={styles.iconWrapper}>
                <Image
                  source={require('@/models/icons/games/coming soon.png')}
                  style={styles.comingSoonIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.card}>
                <ThemedText style={styles.gameTitle}>Скоро...</ThemedText>
                <ThemedText style={styles.comingSoonText}>
                  Новая игра уже в разработке!
                </ThemedText>
              </View>
            </View>
          ) : (
            <GameCard
              title={currentGame.title}
              icon={currentGame.icon}
              energyCost={currentGame.energyCost}
              currentEnergy={currentEnergy}
              onPlay={() => handleGameStart(currentGame.id as any)}
              isDisabled={false}
              index={currentGameIndex}
              totalGames={GAMES.length}
            />
          )}
        </View>

        {/* СТРЕЛКИ НАВИГАЦИИ - ВНИЗУ */}
        <View style={styles.contentPadding}>
          <NavigationArrows
            onPrevious={handlePrevious}
            onNext={handleNext}
            canGoPrevious={GAMES.length > 1}
            canGoNext={GAMES.length > 1}
          />
        </View>
      </ScrollView>

      {/* Модальные окна игр */}
      <Modal
        visible={activeGame === 'bubble'}
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

      <Modal
        visible={activeGame === 'diceGuess'}
        animationType="slide"
        transparent={false}
        statusBarTranslucent={true}
        onRequestClose={handleGameClose}
      >
        <DiceGuessGame
          onGameEnd={handleGameEnd}
          onClose={handleGameClose}
        />
      </Modal>

      <Modal
        visible={activeGame === 'memory'}
        animationType="slide"
        transparent={false}
        statusBarTranslucent={true}
        onRequestClose={handleGameClose}
      >
        <MemoryGame
          onGameEnd={handleGameEnd}
          onClose={handleGameClose}
        />
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingTop: 40,
    paddingBottom: 60,
  },
  contentPadding: {
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFE4A1',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  comingSoonCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrapper: {
    marginBottom: -40,
    zIndex: 10,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFF7E8',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  comingSoonEmoji: {
    fontSize: 80,
  },
  comingSoonIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF7E8',
    padding: 10,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#1a1a1a',
    textAlign: 'center',
    opacity: 0.7,
  },
});
