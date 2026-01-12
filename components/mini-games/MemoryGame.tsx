// components/mini-games/MemoryGame.tsx
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

interface Card {
    id: number;
    value: string;
    emoji: string;
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
        // Выбираем 10 случайных эмодзи
        const selectedEmojis = [...CARD_EMOJIS]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);

        // Создаем пары карточек
        const cardPairs = [...selectedEmojis, ...selectedEmojis]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({
                id: index,
                value: emoji,
                emoji: emoji,
                isFlipped: false,
                isMatched: false
            }));

        setCards(cardPairs);
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
        <View style={styles.container}>
            {/* Шапка игры */}
            <View style={styles.header}>
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>🕒 {formatTime(timeLeft)}</Text>
                </View>
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>👣 Ходы: {moves}</Text>
                </View>
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>✅ Пары: {matches}/10</Text>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
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
                    >
                        {card.isFlipped || card.isMatched ? (
                            <Text style={styles.cardEmoji}>{card.emoji}</Text>
                        ) : (
                            <Text style={styles.cardBackText}>?</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Инструкции */}
            <View style={styles.instructions}>
                <Text style={styles.instructionsTitle}>🎯 Как играть:</Text>
                <Text style={styles.instruction}>• Находите пары одинаковых карточек</Text>
                <Text style={styles.instruction}>• На игру даётся 2 минуты</Text>
                <Text style={styles.instruction}>• Чем меньше ходов и больше времени останется - тем больше очков</Text>
                <Text style={styles.instruction}>• Нужно найти все 10 пар</Text>
            </View>

            {/* Управление */}
            <View style={styles.controls}>
                <TouchableOpacity style={styles.restartButton} onPress={initializeGame}>
                    <Text style={styles.restartButtonText}>🔄 Начать заново</Text>
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
        </View>
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
        backgroundColor: '#34495E',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        flexWrap: 'wrap',
    },
    statsContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 15,
        marginVertical: 4,
    },
    statsText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    closeButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 4,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    gameBoard: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 8,
        gap: 4,
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
    },
    cardBack: {
        backgroundColor: '#3498DB',
    },
    cardFlipped: {
        backgroundColor: '#ECF0F1',
        transform: [{ rotateY: '180deg' }],
    },
    cardMatched: {
        backgroundColor: '#2ECC71',
    },
    cardEmoji: {
        fontSize: 20,
    },
    cardBackText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    instructions: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 12,
        margin: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    instructionsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFD54F',
        marginBottom: 6,
    },
    instruction: {
        fontSize: 11,
        color: '#E0E0E0',
        marginBottom: 3,
        marginLeft: 8,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    restartButton: {
        backgroundColor: '#E74C3C',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
    },
    restartButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
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
    },
    finalScore: {
        fontSize: 16,
        color: '#E74C3C',
        marginBottom: 6,
        fontWeight: 'bold',
    },
    rewardText: {
        fontSize: 12,
        color: '#27AE60',
        marginBottom: 12,
        textAlign: 'center',
        fontWeight: '600',
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
