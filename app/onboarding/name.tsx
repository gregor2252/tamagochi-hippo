// app/onboarding/name.tsx - ВЫБОР ИМЕНИ
import { storage } from '@/utils/storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function NameScreen() {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleContinue = async () => {
    if (!name.trim()) {
      return;
    }

    // Сохраняем имя
    try {
      await Promise.all([
        storage.setItem('hippoName', name.trim()),
        storage.setItem('hasCreatedHippo', 'true')
      ]);

      // Переходим на главный экран
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Failed to save name:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const canContinue = name.trim().length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Дайте имя бегемотику</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите имя..."
        value={name}
        onChangeText={setName}
        maxLength={20}
        autoFocus
        placeholderTextColor="#A65437"
      />
      <Text style={styles.hint}>
        Примеры: Пузик, Мото, Река, Счастливчик
      </Text>
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>← Назад</Text>
        </TouchableOpacity>
        {canContinue && (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Начать игру →</Text>
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
  input: {
    width: '100%',
    height: 50,
    borderWidth: 2,
    borderColor: '#A65437',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 18,
    backgroundColor: '#fff',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  hint: {
    width: '100%',
    textAlign: 'center',
    fontSize: 14,
    color: '#A65437',
    marginBottom: 40,
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