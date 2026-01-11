// app/onboarding/age.tsx - ВЫБОР ВОЗРАСТА
import { storage } from '@/utils/storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Age = 'child' | 'parent' | '';

export default function AgeScreen() {
  const router = useRouter();
  const [age, setAge] = useState<Age>('');

  const handleAgeSelect = (selectedAge: Age) => {
    setAge(selectedAge);
  };

  const handleContinue = async () => {
    if (!age) {
      return;
    }

    // Сохраняем выбранный возраст
    try {
      await storage.setItem('hippoAge', age);
      // Переходим к выбору имени
      router.push('/onboarding/name');
    } catch (error) {
      console.error('Failed to save age:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выберите возраст бегемотика</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.ageButton,
            age === 'child' && styles.ageButtonSelected,
          ]}
          onPress={() => handleAgeSelect('child')}
        >
          <Text style={styles.ageEmoji}>👶</Text>
          <Text style={[
            styles.ageText,
            age === 'child' && styles.ageTextSelected
          ]}>
            Ребенок
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.ageButton,
            age === 'parent' && styles.ageButtonSelected,
          ]}
          onPress={() => handleAgeSelect('parent')}
        >
          <Text style={styles.ageEmoji}>👨‍👩</Text>
          <Text style={[
            styles.ageText,
            age === 'parent' && styles.ageTextSelected
          ]}>
            Взрослый
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>← Назад</Text>
        </TouchableOpacity>
        {age && (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Продолжить →</Text>
          </TouchableOpacity>
        )}
      </View>
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
  ageButton: {
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
  ageButtonSelected: {
    backgroundColor: '#A65437',
    shadowColor: '#A65437',
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  ageEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  ageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A65437',
    textAlign: 'center',
  },
  ageTextSelected: {
    color: '#fff',
  },
  navigationContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#A65437',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A65437',
  },
  continueButton: {
    flex: 1,
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