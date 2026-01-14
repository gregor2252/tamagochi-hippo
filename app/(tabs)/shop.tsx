// app/(tabs)/shop.tsx - ГАРДЕРОБ С МОДАЛЬНЫМ ОКНОМ
import HippoView from '@/components/HippoView';
import { ThemedText } from '@/components/themed-text';
import { useHippo } from '@/context/HippoContext';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

const wardrobeBg = require('@/screens/shop/wardrobe.png');

// Категории одежды с цветами
const categories = [
  { id: 'head', name: 'Головной убор', emoji: '🧢', color: '#D8B5E8', icon: require('@/models/icons/shop/head.png') },
  { id: 'upper', name: 'Верх', emoji: '👕', color: '#A8D5FF', icon: require('@/models/icons/shop/body.png') },
  { id: 'lower', name: 'Низ', emoji: '👖', color: '#B5E8A8', icon: require('@/models/icons/shop/pants.png') },
  { id: 'feet', name: 'Обувь', emoji: '👟', color: '#FFD4A8', icon: require('@/models/icons/shop/shoes.png') },
  { id: 'costume', name: 'Костюмы', emoji: '🧸', color: '#FFE8A8', icon: require('@/models/icons/shop/costumes.png') },
];

const moneyIcon = require('@/models/icons/stats/money.png');

export default function ShopScreen() {
  const router = useRouter();
  const { hippo, buyItem, equipItem, unequipItem, getAvailableItems } = useHippo();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  useEffect(() => {
    console.log('ShopScreen: hippo updated:', hippo?.outfit);
  }, [hippo?.outfit]);

  const currentCategory = categories.find(c => c.id === selectedCategory);
  let items = selectedCategory ? getAvailableItems().filter(item => item.category === selectedCategory) : [];
  
  // Фильтруем костюмы по возрасту
  if (selectedCategory === 'costume') {
    const allItems = getAvailableItems();
    const costumeItems = allItems.filter(item => item.category === 'costume');
    console.log('=== COSTUME DEBUG ===');
    console.log('Selected category:', selectedCategory);
    console.log('Hippo age:', hippo?.age);
    console.log('All items count:', allItems.length);
    console.log('Costume items before filter:', costumeItems);
    items = costumeItems.filter(item => !item.ageRestriction || item.ageRestriction === hippo?.age);
    console.log('Costume items after filter:', items);
    console.log('Items length:', items.length);
  }
  
  console.log('Current category:', selectedCategory, 'Items count:', items.length);
  
  const currentItem = items[currentItemIndex];
  const currentOutfit = hippo?.outfit || {};
  const isEquipped = currentItem && currentOutfit[selectedCategory as keyof typeof currentOutfit] === currentItem.id;
  const isUnlocked = currentItem?.unlocked;

  const handleCategoryPress = (categoryId: string) => {
    console.log('Category pressed:', categoryId);
    setSelectedCategory(categoryId);
    setCurrentItemIndex(0);
  };

  const handleNextItem = () => {
    if (currentItemIndex < items.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    }
  };

  const handlePrevItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
    }
  };

  const handleBuyItem = () => {
    if (!currentItem) return;

    if ((hippo?.coins || 0) < currentItem.price) {
      Alert.alert(
        'Недостаточно монет',
        `Вам нужно ещё ${currentItem.price - (hippo?.coins || 0)} монет`
      );
      return;
    }

    console.log('Buying item:', currentItem.id, 'Category:', currentItem.category);
    buyItem(currentItem.id);
    console.log('After buyItem, hippo.outfit:', hippo?.outfit);
  };

  const handleEquipItem = () => {
    if (!currentItem) return;
    if (isEquipped) {
      unequipItem(selectedCategory as any);
    } else {
      equipItem(currentItem.id);
    }
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
    setCurrentItemIndex(0);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={wardrobeBg} style={styles.background} resizeMode="stretch">
        {/* КНОПКА НАЗАД */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backButtonText}>←</ThemedText>
        </TouchableOpacity>

        {/* МОНЕТЫ СВЕРХУ */}
        <View style={styles.coinContainer}>
          <Image source={moneyIcon} style={styles.coinIcon} />
          <ThemedText style={styles.coinText}>{hippo?.coins || 0}</ThemedText>
        </View>

        {/* БЕГЕМОТИК В ЦЕНТРЕ */}
        <View style={styles.hippoSection}>
          {hippo && (
            <>
              {console.log('Shop screen rendering HippoView with outfit:', hippo.outfit)}
              <HippoView 
                mood="default" 
                size="medium" 
                age={(hippo.age as unknown as 'child' | 'parent') || 'child'}
                costume={hippo.outfit?.costume}
              />
            </>
          )}
        </View>

        {/* КАТЕГОРИИ СПРАВА */}
        <View style={styles.categoriesPanel}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonSelected,
              ]}
              onPress={() => handleCategoryPress(category.id)}
            >
              <Image
                source={category.icon}
                style={styles.categoryIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ImageBackground>

      {/* МОДАЛЬНОЕ ОКНО ВЫБОРА ПРЕДМЕТА */}
      <Modal
        visible={selectedCategory !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          {items.length > 0 ? (
            <View style={styles.modalContent}>
            {/* ЗАГОЛОВОК */}
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>
                {currentCategory?.emoji} {currentCategory?.name}
              </ThemedText>
              <TouchableOpacity onPress={handleCloseModal}>
                <ThemedText style={styles.closeButton}>✕</ThemedText>
              </TouchableOpacity>
            </View>

            {/* ПРЕДМЕТ */}
            <View style={styles.itemDisplay}>
              {typeof currentItem?.icon === 'string' ? (
                <ThemedText style={styles.itemEmoji}>{currentItem?.icon}</ThemedText>
              ) : (
                <Image
                  source={currentItem?.icon}
                  style={styles.itemIcon}
                  resizeMode="contain"
                />
              )}
              <ThemedText style={styles.itemName}>{currentItem?.name}</ThemedText>
              <ThemedText style={styles.itemDescription}>{currentItem?.description}</ThemedText>

              {/* СТАТУС */}
              {isUnlocked ? (
                <View style={styles.statusBadge}>
                  <ThemedText style={styles.statusText}>✓ Куплено</ThemedText>
                </View>
              ) : (
                <View style={[styles.statusBadge, styles.priceBadge]}>
                  <Image source={moneyIcon} style={styles.priceIcon} />
                  <ThemedText style={styles.priceText}>{currentItem?.price}</ThemedText>
                </View>
              )}
            </View>

            {/* НАВИГАЦИЯ */}
            <View style={styles.navigationContainer}>
              <TouchableOpacity
                style={[styles.arrowButton, currentItemIndex === 0 && styles.arrowButtonDisabled]}
                onPress={handlePrevItem}
                disabled={currentItemIndex === 0}
              >
                <ThemedText style={styles.arrowText}>←</ThemedText>
              </TouchableOpacity>

              <ThemedText style={styles.itemCounter}>
                {currentItemIndex + 1} / {items.length}
              </ThemedText>

              <TouchableOpacity
                style={[styles.arrowButton, currentItemIndex === items.length - 1 && styles.arrowButtonDisabled]}
                onPress={handleNextItem}
                disabled={currentItemIndex === items.length - 1}
              >
                <ThemedText style={styles.arrowText}>→</ThemedText>
              </TouchableOpacity>
            </View>

            {/* КНОПКИ ДЕЙСТВИЙ */}
            <View style={styles.actionButtonsContainer}>
              {isUnlocked ? (
                <TouchableOpacity
                  style={[styles.actionButton, isEquipped ? styles.removeButton : styles.equipButton]}
                  onPress={handleEquipItem}
                >
                  <ThemedText style={styles.actionButtonText}>
                    {isEquipped ? '❌ Снять' : '✅ Надеть'}
                  </ThemedText>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.actionButton, styles.buyButton]}
                  onPress={handleBuyItem}
                >
                  <ThemedText style={styles.actionButtonText}>🛒 Купить</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </View>
          ) : (
            <View style={styles.modalContent}>
              <ThemedText style={styles.modalTitle}>Нет предметов</ThemedText>
              <ThemedText style={styles.itemDescription}>
                В этой категории нет предметов для вашего возраста
              </ThemedText>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleCloseModal}
              >
                <ThemedText style={styles.actionButtonText}>Закрыть</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // ===== КНОПКА НАЗАД =====
  backButton: {
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
  backButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  // ===== МОНЕТЫ =====
  coinContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coinIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  coinText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  // ===== БЕГЕМОТИК =====
  hippoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 450, // НАСТРОЙКА: увеличено для опускания бегемотика
  },
  // ===== КАТЕГОРИИ СПРАВА =====
  categoriesPanel: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -100 }],
    gap: 12,
  },
  categoryButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  categoryButtonSelected: {
    transform: [{ scale: 1.1 }],
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  categoryEmoji: {
    fontSize: 8,
  },
  categoryIcon: {
    width: 64,
    height: 64,
  },
  // ===== МОДАЛЬНОЕ ОКНО =====
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#D9D0C5',
    borderRadius: 24,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  // ===== ЗАГОЛОВОК МОДАЛИ =====
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  closeButton: {
    fontSize: 24,
    color: '#A65437',
    fontWeight: 'bold',
  },
  // ===== ОТОБРАЖЕНИЕ ПРЕДМЕТА =====
  itemDisplay: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
  },
  itemEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  itemIcon: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    maxWidth: '90%',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  priceBadge: {
    backgroundColor: '#FFB74D',
  },
  priceIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    marginRight: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  // ===== НАВИГАЦИЯ =====
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  arrowButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#A65437',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  arrowButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.5,
  },
  arrowText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  itemCounter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  // ===== КНОПКИ ДЕЙСТВИЙ =====
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buyButton: {
    backgroundColor: '#4CAF50',
  },
  equipButton: {
    backgroundColor: '#4CAF50',
  },
  removeButton: {
    backgroundColor: '#FF6B9D',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});
