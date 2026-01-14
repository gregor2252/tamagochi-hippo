import { ThemedText } from '@/components/themed-text';
import React, { useRef } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const greenButton = require('@/models/icons/buttons/arrows/green_button.png');
const greyButton = require('@/models/icons/buttons/arrows/grey_button.png');
const energyIcon = require('@/models/icons/stats/energy.png');

interface GameCardProps {
  title: string;
  icon: any;
  energyCost: number;
  currentEnergy: number;
  onPlay: () => void;
  isDisabled: boolean;
  index: number;
  totalGames: number;
}

export default function GameCard({
  title,
  icon,
  energyCost,
  currentEnergy,
  onPlay,
  isDisabled,
  index,
  totalGames,
}: GameCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const canPlay = currentEnergy >= energyCost && !isDisabled;

  const handlePressIn = () => {
    if (canPlay) {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Иконка игры - выпирает вверх */}
      <View style={styles.iconWrapper}>
        <Image
          source={icon}
          style={styles.gameIcon}
          resizeMode="contain"
        />
      </View>

      {/* Основная карточка */}
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale: scaleAnim }],
            opacity: isDisabled ? 0.6 : 1,
          },
        ]}
      >
        {/* Название игры */}
        <ThemedText style={styles.gameTitle}>{title}</ThemedText>

        {/* Стоимость энергии */}
        <View style={styles.costContainer}>
          <View style={styles.costContent}>
            <Image source={energyIcon} style={styles.costIcon} />
            <ThemedText
              style={[
                styles.costText,
                !canPlay && styles.costTextDisabled,
              ]}
            >
              {energyCost} энергии
            </ThemedText>
          </View>
        </View>

        {/* Кнопка Играть */}
        <TouchableOpacity
          style={styles.playButton}
          onPress={onPlay}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={!canPlay}
          activeOpacity={0.8}
        >
          <Image
            source={canPlay ? greenButton : greyButton}
            style={styles.playButtonImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Индикаторы внизу */}
      <View style={styles.indicatorsContainer}>
        {Array.from({ length: totalGames }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.indicator,
              i === index && styles.indicatorActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrapper: {
    marginBottom: -40,
    zIndex: 10,
  },
  gameIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF7E8',
    padding: 10,
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
    fontFamily: 'ComicSans',
  },
  costContainer: {
    marginBottom: 16,
  },
  costContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  costIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  costText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CD964',
    fontFamily: 'ComicSans',
  },
  costTextDisabled: {
    color: '#FF3B30',
    fontFamily: 'ComicSans',
  },
  playButton: {
    width: 120,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonImage: {
    width: '100%',
    height: '100%',
  },
  indicatorsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D0D0D0',
  },
  indicatorActive: {
    backgroundColor: '#4CD964',
    width: 24,
  },
});
