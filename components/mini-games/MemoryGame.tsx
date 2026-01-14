// components/mini-games/MemoryGame.tsx
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

// Импорты
const cardGameBg = require('@/screens/games/card_game.png');
const backArrow = require('@/models/icons/games/back_arrow.png');
const brainIcon = require('@/models/icons/games/brain.png');
const cardBack = require('@/models/icons/games/cards/back.png');
const restartIcon = require('@/models/icons/games/restart.png');

// Карточки для игры
const cardImages = [
    require('@/models/icons/games/cards/card1 (1).png'),
    require('@/models/icons/games/cards/card2 (1).png'),
    require('@/models/icons/games/cards/card3 (1).png'),
    require('@/models/icons/games/cards/card4 (1).png'),
    require('@/models/icons/games/cards/card5 (1).png'),
    require('@/models/icons/games/cards/card6 (1).png'),
    require('@/models/icons/games/cards/card7 (1).png'),
    require('@/models/icons/games/cards/card8 (1).png'),
    require('@/models/icons/games/cards/card9.png'),
    require('@/models/icons/games/cards/card10.png'),
];

interface Card {
    id: number;
    value: number;
    imageIndex: number;
    isFlipped: boolean;
    isMatched: boolean;
}

interface MemoryGameProps {
    onGameEnd: (score: number) => void;
    onClose: () => void;
}

// Эмодзи для карточек
const CARD_EMOJIS = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
    '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆'
];

export default function MemoryGame({ onGameEnd, onClose }: MemoryGameProps) {
    const [cards, setCards] = useState<Card[]>([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120); // 2 минуты на игру
    const [gameActive, setGameActive] = useState(true);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [canFlip, setCanFlip] = useState(true);
    const [gameCompleted, setGameCompleted] = useState(false);

    // Инициализация игры
    useEffect(() => {
        initializeGame();
    }, []);

    // Таймер
    useEffect(() => {
        if (!gameActive || gameCompleted) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleGameOver();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameActive, gameCompleted]);

    // Проверка на завершение игры
    useEffect(() => {
        if (matches === 10 && gameActive) { // 10 пар = 20 карт
            setGameCompleted(true);
            setGameActive(false);
        }
    }, [matches, gameActive]);

    const initializeGame = () => {
        // Создаем пары карточек (10 пар = 20 карт)
        const cardPairs = []
        for (let i = 0; i < 10; i++) {
            cardPairs.push(i, i);
        }
        
        // Перемешиваем
        const shuffled = cardPairs
            .sort(() => Math.random() - 0.5)
            .map((imageIndex, index) => ({
                id: index,
                value: imageIndex,
                imageIndex: imageIndex,
                isFlipped: false,
                isMatched: false
            }));

        setCards(shuffled);
        setMoves(0);
        setMatches(0);
        setTimeLeft(120);
        setFlippedCards([]);
        setCanFlip(true);
        setGameActive(true);
        setGameCompleted(false);
    };

    const handleCardPress = (cardId: number) => {
        if (!canFlip || !gameActive || gameCompleted) return;

        const card = cards.find(c => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched) return;

        // Переворачиваем карту
        setCards(prev => prev.map(card =>
            card.id === cardId ? { ...card, isFlipped: true } : card
        ));

        setFlippedCards(prev => [...prev, cardId]);

        // Если перевернуто 2 карты, проверяем на совпадение
        if (flippedCards.length === 1) {
            setCanFlip(false);
            setMoves(prev => prev + 1);

            const firstCardId = flippedCards[0];
            const secondCardId = cardId;

            const firstCard = cards.find(c => c.id === firstCardId);
            const secondCard = cards.find(c => c.id === secondCardId);

            if (firstCard && secondCard && firstCard.value === secondCard.value) {
                // Найдена пара
                setTimeout(() => {
                    setCards(prev => prev.map(card =>
                        card.id === firstCardId || card.id === secondCardId
                            ? { ...card, isMatched: true, isFlipped: true }
                            : card
                    ));
                    setMatches(prev => prev + 1);
                    setFlippedCards([]);
                    setCanFlip(true);
                }, 500);
            } else {
                // Не совпали - переворачиваем обратно
                setTimeout(() => {
                    setCards(prev => prev.map(card =>
                        card.id === firstCardId || card.id === secondCardId
                            ? { ...card, isFlipped: false }
                            : card
                    ));
                    setFlippedCards([]);
                    setCanFlip(true);
                }, 1000);
            }
        }
    };

    const handleGameOver = () => {
        setGameActive(false);
    };

    const calculateScore = () => {
        // Базовые очки: 50 за каждую найденную пару (было 100)
        const matchScore = matches * 50;

        // Бонус за скорость: оставшееся время * 5 (было *10)
        const timeBonus = timeLeft * 5;

        // Бонус за эффективность: чем меньше ходов, тем лучше
        // Идеальное количество ходов для 10 пар: 10 (по одному ходу на пару)
        const optimalMoves = 10;
        const moveBonus = Math.max(0, 200 - Math.max(0, moves - optimalMoves) * 5);

        // Итоговый счет
        const totalScore = matchScore + timeBonus + moveBonus;

        return Math.max(0, totalScore);
    };

    const handleFinishGame = () => {
        const finalScore = calculateScore();
        onGameEnd(finalScore);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <ImageBackground
            source={cardGameBg}
            style={styles.container}
            resizeMode="cover"
        >
            {/* Шапка игры */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onClose}>
                    <Image source={backArrow} style={styles.backIcon} />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <Image source={brainIcon} style={styles.brainIcon} />
                    <Text style={styles.headerTitle}>Игра на память</Text>
                </View>

                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>🕒 {formatTime(timeLeft)}</Text>
                </View>
            </View>

            {/* Игровое поле 4x5 */}
            <View style={styles.gameBoard}>
                {cards.map((card) => (
                    <TouchableOpacity
                        key={card.id}
                        style={[
                            styles.card,
                            card.isFlipped || card.isMatched ? styles.cardFlipped : styles.cardBack,
                            card.isMatched && styles.cardMatched
                        ]}
                        onPress={() => handleCardPress(card.id)}
                        disabled={!canFlip || card.isFlipped || card.isMatched || !gameActive}
                        activeOpacity={1}
                    >
                        {card.isFlipped || card.isMatched ? (
                            <Image
                                source={cardImages[card.imageIndex]}
                                style={styles.cardImage}
                                resizeMode="contain"
                            />
                        ) : (
                            <Image
                                source={cardBack}
                                style={styles.cardImage}
                                resizeMode="contain"
                            />
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Инструкции */}
            {/* Убрали подсказки */}

            {/* Управление */}
            <View style={styles.controls}>
                <TouchableOpacity style={styles.restartIconButton} onPress={initializeGame}>
                    <Image source={restartIcon} style={styles.restartIconImage} />
                </TouchableOpacity>

                {!gameActive && (
                    <TouchableOpacity style={styles.finishButton} onPress={handleFinishGame}>
                        <Text style={styles.finishButtonText}>🏁 Завершить игру</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Экран завершения игры */}
            {(gameCompleted || !gameActive) && (
                <View style={styles.gameOverContainer}>
                    <Text style={styles.gameOverTitle}>
                        {gameCompleted ? '🎉 Победа!' : '⏰ Время вышло!'}
                    </Text>

                    <View style={styles.finalStats}>
                        <Text style={styles.finalStat}>Найдено пар: {matches}/10</Text>
                        <Text style={styles.finalStat}>Ходов сделано: {moves}</Text>
                        <Text style={styles.finalStat}>Время осталось: {formatTime(timeLeft)}</Text>
                    </View>

                    <Text style={styles.finalScore}>
                        Итоговый счет: {calculateScore()} очков
                    </Text>

                    <Text style={styles.rewardText}>
                        🎁 Награда: {Math.floor(calculateScore() / 20)} дополнительных монет
                    </Text>

                    <View style={styles.finalButtons}>
                        <TouchableOpacity style={styles.playAgainButton} onPress={initializeGame}>
                            <Text style={styles.playAgainText}>Играть снова</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.claimButton} onPress={handleFinishGame}>
                            <Text style={styles.claimButtonText}>Забрать награду</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2C3E50',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    brainIcon: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'ComicSans',
    },
    statsContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 15,
    },
    statsText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'ComicSans',
    },
    gameBoard: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 8,
        gap: 4,
        flex: 1,
        marginTop: 320,
    },
    card: {
        width: (width - 40) / 5 - 4,
        height: (width - 40) / 5 - 4,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
        marginBottom: 2,
        borderWidth: 0,
        outline: 'none',
    },
    cardBack: {
        backgroundColor: 'transparent',
    },
    cardFlipped: {
        backgroundColor: '#ECF0F1',
        transform: [{ rotateY: '180deg' }],
    },
    cardMatched: {
        backgroundColor: '#2ECC71',
    },
    cardImage: {
        width: '90%',
        height: '90%',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
        gap: 20,
    },
    restartIconButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    restartIconImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    finishButton: {
        backgroundColor: '#9B59B6',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
    },
    finishButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    gameOverContainer: {
        position: 'absolute',
        top: '20%',
        left: '5%',
        right: '5%',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    gameOverTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#9B59B6',
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'ComicSans',
    },
    finalStats: {
        marginBottom: 10,
        alignItems: 'center',
    },
    finalStat: {
        fontSize: 12,
        color: '#2C3E50',
        marginBottom: 3,
        fontWeight: '500',
        fontFamily: 'ComicSans',
    },
    finalScore: {
        fontSize: 16,
        color: '#E74C3C',
        marginBottom: 6,
        fontWeight: 'bold',
        fontFamily: 'ComicSans',
    },
    rewardText: {
        fontSize: 12,
        color: '#27AE60',
        marginBottom: 12,
        textAlign: 'center',
        fontWeight: '600',
        fontFamily: 'ComicSans',
    },
    finalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 10,
    },
    playAgainButton: {
        backgroundColor: '#3498DB',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        flex: 1,
        alignItems: 'center',
    },
    playAgainText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    claimButton: {
        backgroundColor: '#27AE60',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        flex: 1,
        alignItems: 'center',
    },
    claimButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
