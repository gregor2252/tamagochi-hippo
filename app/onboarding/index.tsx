// app/onboarding/index.tsx - ВЫБОР ПОЛА
import { storage } from '@/utils/storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Gender = 'male' | 'female' | '';

export default function OnboardingScreen() {
  const router = useRouter();
  const [gender, setGender] = useState<Gender>('');

  const handleGenderSelect = (selectedGender: Gender) => {
    setGender(selectedGender);
  };

  const handleContinue = async () => {
    if (!gender) {
      return;
    }

    // Сохраняем выбранный пол
    try {
      await storage.setItem('hippoGender', gender);
      // Переходим к выбору возраста
      router.push('/onboarding/age');
    } catch (error) {
      console.error('Failed to save gender:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выберите пол бегемотика</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === 'male' && styles.genderButtonSelected,
          ]}
          onPress={() => handleGenderSelect('male')}
        >
          <Text style={styles.genderEmoji}>♂️</Text>
          <Text style={[
            styles.genderText,
            gender === 'male' && styles.genderTextSelected
          ]}>
            Мужской
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === 'female' && styles.genderButtonSelected,
          ]}
          onPress={() => handleGenderSelect('female')}
        >
          <Text style={styles.genderEmoji}>♀️</Text>
          <Text style={[
            styles.genderText,
            gender === 'female' && styles.genderTextSelected
          ]}>
            Женский
          </Text>
        </TouchableOpacity>
      </View>
      {gender && (
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Продолжить →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#D9D0C5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#1a1a1a',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
    justifyContent: 'center',
  },
  genderButton: {
    width: 140,
    height: 140,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#A65437',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  genderButtonSelected: {
    backgroundColor: '#A65437',
    shadowColor: '#A65437',
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  genderEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  genderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A65437',
    textAlign: 'center',
  },
  genderTextSelected: {
    color: '#fff',
  },
  continueButton: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 30,
    backgroundColor: '#A65437',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});