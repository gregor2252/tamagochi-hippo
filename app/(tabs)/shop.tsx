// app/(tabs)/shop.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useHippo } from '@/context/HippoContext';
import { ClothingCategory, ClothingItem as ClothingItemType } from '@/types/hippo';
import { useState } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

const categories: { id: ClothingCategory; name: string; emoji: string }[] = [
  { id: 'head', name: 'Голова', emoji: '🧢' },
  { id: 'upper', name: 'Верх', emoji: '👕' },
  { id: 'lower', name: 'Низ', emoji: '👖' },
  { id: 'feet', name: 'Ноги', emoji: '👟' },
];

type RarityType = 'common' | 'rare' | 'epic';

const rarityColors: Record<RarityType, string> = {
  common: '#8B8B8B',
  rare: '#4A90E2',
  epic: '#FF6B00'
};

const rarityNames: Record<RarityType, string> = {
  common: 'Обычный',
  rare: 'Редкий',
  epic: 'Эпический'
};

export default function ShopScreen() {
  const { hippo, buyItem, equipItem, unequipItem, getAvailableItems } = useHippo();
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory>('head');

  const items = getAvailableItems().filter(item => item.category === selectedCategory);
  const currentOutfit = hippo?.outfit || {};

  const handleBuyItem = (itemId: string, price: number) => {
    if ((hippo?.coins || 0) < price) {
      Alert.alert('Недостаточно монет', `Вам нужно ещё ${price - (hippo?.coins || 0)} монет`);
      return;
    }

    if (buyItem(itemId)) {
      Alert.alert('Успех!', 'Предмет куплен и добавлен в инвентарь');
    } else {
      Alert.alert('Ошибка', 'Не удалось купить предмет');
    }
  };

  const handleEquipItem = (itemId: string) => {
    equipItem(itemId);
  };

  const handleUnequipItem = (category: ClothingCategory) => {
    unequipItem(category);
  };

  const renderCategoryButton = ({ id, name, emoji }: typeof categories[0]) => (
    <TouchableOpacity
      key={id}
      style={[
        styles.categoryButton,
        selectedCategory === id && styles.categoryButtonSelected
      ]}
      onPress={() => setSelectedCategory(id)}
    >
      <ThemedText style={styles.categoryEmoji}>{emoji}</ThemedText>
      <ThemedText style={[
        styles.categoryText,
        selectedCategory === id && styles.categoryTextSelected
      ]}>
        {name}
      </ThemedText>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: ClothingItemType }) => {
    const isUnlocked = item.unlocked;
    const isEquipped = currentOutfit[item.category as keyof typeof currentOutfit] === item.id;
    const canAfford = (hippo?.coins || 0) >= item.price;
    const rarity = item.rarity as RarityType;

    return (
      <View style={styles.itemCard}>
        <View style={styles.itemHeader}>
          <ThemedText style={styles.itemEmoji}>{item.icon}</ThemedText>
          <View style={styles.itemInfo}>
            <ThemedText style={styles.itemName}>{item.name}</ThemedText>
            <ThemedText style={[styles.itemRarity, { color: rarityColors[rarity] }]}>
              {rarityNames[rarity]}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.itemDescription}>{item.description}</ThemedText>

        <View style={styles.itemFooter}>
          <ThemedText style={styles.itemPrice}>💰 {item.price}</ThemedText>

          {isUnlocked ? (
            isEquipped ? (
              <TouchableOpacity
                style={[styles.actionButton, styles.equippedButton]}
                onPress={() => handleUnequipItem(item.category)}
              >
                <ThemedText style={styles.actionButtonText}>Снять</ThemedText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.actionButton, styles.equipButton]}
                onPress={() => handleEquipItem(item.id)}
              >
                <ThemedText style={styles.actionButtonText}>Надеть</ThemedText>
              </TouchableOpacity>
            )
          ) : (
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.buyButton,
                !canAfford && styles.disabledButton
              ]}
              onPress={() => handleBuyItem(item.id, item.price)}
              disabled={!canAfford}
            >
              <ThemedText style={styles.actionButtonText}>
                {canAfford ? 'Купить' : 'Не хватает'}
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">🛍️ Магазин</ThemedText>
        <View style={styles.coinDisplay}>
          <ThemedText style={styles.coinText}>Ваши монеты: </ThemedText>
          <ThemedText style={styles.coinAmount}>💰 {hippo?.coins || 0}</ThemedText>
        </View>
      </View>

      <ThemedText style={styles.subtitle}>
        Покупайте одежду для вашего бегемотика
      </ThemedText>

      {/* Категории */}
      <View style={styles.categoriesContainer}>
        {categories.map(renderCategoryButton)}
      </View>

      {/* Список предметов */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.itemsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              В этой категории пока нет предметов
            </ThemedText>
          </View>
        }
      />

      {/* Информация о надетом */}
      <View style={styles.currentOutfitContainer}>
        <ThemedText style={styles.outfitTitle}>Сейчас надето:</ThemedText>
        <View style={styles.outfitItems}>
          {Object.entries(currentOutfit).map(([category, itemId]) => {
            const item = getAvailableItems().find(i => i.id === itemId);
            if (!item) return null;

            return (
              <View key={category} style={styles.outfitItem}>
                <ThemedText style={styles.outfitEmoji}>{item.icon}</ThemedText>
                <ThemedText style={styles.outfitName}>{item.name}</ThemedText>
              </View>
            );
          })}

          {Object.keys(currentOutfit).length === 0 && (
            <ThemedText style={styles.noOutfitText}>
              Ничего не надето
            </ThemedText>
          )}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 20,
    opacity: 0.8,
    fontSize: 16,
  },
  coinDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  coinText: {
    fontSize: 14,
    opacity: 0.9,
  },
  coinAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryButtonSelected: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderColor: '#4A90E2',
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryTextSelected: {
    color: '#4A90E2',
  },
  itemsList: {
    paddingBottom: 20,
  },
  itemCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  itemRarity: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
    lineHeight: 20,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#4CAF50',
  },
  equipButton: {
    backgroundColor: '#2196F3',
  },
  equippedButton: {
    backgroundColor: '#9C27B0',
  },
  disabledButton: {
    backgroundColor: '#9E9E9E',
    opacity: 0.6,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.5,
    textAlign: 'center',
  },
  currentOutfitContainer: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  outfitTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  outfitItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  outfitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.3)',
  },
  outfitEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  outfitName: {
    fontSize: 14,
    fontWeight: '500',
  },
  noOutfitText: {
    fontSize: 14,
    opacity: 0.5,
    fontStyle: 'italic',
  },
});