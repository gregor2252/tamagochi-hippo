import React, { useRef } from 'react';
import {
    Animated,
    Image,
    ImageSourcePropType,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

interface NavigationArrowsProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const leftCasual = require('@/models/icons/buttons/arrows/left_casual.png');
const leftExtended = require('@/models/icons/buttons/arrows/left_extended.png');
const rightCasual = require('@/models/icons/buttons/arrows/right_casual.png');
const rightExtended = require('@/models/icons/buttons/arrows/right_extended.png');

export default function NavigationArrows({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: NavigationArrowsProps) {
  const prevScaleAnim = useRef(new Animated.Value(1)).current;
  const nextScaleAnim = useRef(new Animated.Value(1)).current;

  const handlePrevPressIn = () => {
    if (canGoPrevious) {
      Animated.spring(prevScaleAnim, {
        toValue: 0.9,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePrevPressOut = () => {
    Animated.spring(prevScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleNextPressIn = () => {
    if (canGoNext) {
      Animated.spring(nextScaleAnim, {
        toValue: 0.9,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleNextPressOut = () => {
    Animated.spring(nextScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const leftImage: ImageSourcePropType = canGoPrevious ? leftExtended : leftCasual;
  const rightImage: ImageSourcePropType = canGoNext ? rightExtended : rightCasual;

  return (
    <View style={styles.container}>
      {/* Стрелка влево */}
      <Animated.View
        style={[
          styles.arrowButton,
          {
            transform: [{ scale: prevScaleAnim }],
            opacity: canGoPrevious ? 1 : 0.5,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.touchable}
          onPress={onPrevious}
          onPressIn={handlePrevPressIn}
          onPressOut={handlePrevPressOut}
          disabled={!canGoPrevious}
          activeOpacity={0.8}
        >
          <Image
            source={leftImage}
            style={styles.arrowImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Стрелка вправо */}
      <Animated.View
        style={[
          styles.arrowButton,
          {
            transform: [{ scale: nextScaleAnim }],
            opacity: canGoNext ? 1 : 0.5,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.touchable}
          onPress={onNext}
          onPressIn={handleNextPressIn}
          onPressOut={handleNextPressOut}
          disabled={!canGoNext}
          activeOpacity={0.8}
        >
          <Image
            source={rightImage}
            style={styles.arrowImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 16,
  },
  arrowButton: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowImage: {
    width: '100%',
    height: '100%',
  },
});
