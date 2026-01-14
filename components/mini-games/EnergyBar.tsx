import { ThemedText } from '@/components/themed-text';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  View,
} from 'react-native';

const energyIcon = require('@/models/icons/stats/energy.png');

interface EnergyBarProps {
  current: number;
  max: number;
}

export default function EnergyBar({ current, max }: EnergyBarProps) {
  const percentage = (current / max) * 100;
  const widthAnim = useRef(new Animated.Value(percentage)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [percentage, widthAnim]);

  const getEnergyColor = () => {
    if (percentage >= 50) return '#4CD964'; // Зелёный
    if (percentage >= 20) return '#FFD60A'; // Жёлтый
    return '#FF3B30'; // Красный
  };

  return (
    <View style={styles.container}>
      {/* Иконка слева */}
      <Image source={energyIcon} style={styles.icon} />

      {/* Шкала энергии */}
      <View style={styles.barContainer}>
        <View style={styles.barBackground}>
          <Animated.View
            style={[
              styles.barFill,
              {
                width: widthAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: getEnergyColor(),
              },
            ]}
          />
        </View>
      </View>

      {/* Текст справа */}
      <ThemedText style={styles.text}>
        {Math.round(current)} / {max}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: {
    fontSize: 20,
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  barContainer: {
    flex: 1,
  },
  barBackground: {
    height: 12,
    backgroundColor: '#E8E8E8',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    minWidth: 50,
    textAlign: 'right',
    fontFamily: 'ComicSans',
  },
});
