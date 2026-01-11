import React, { useCallback, useEffect, useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Bubble {
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    color: string;
}

interface BubbleGameProps {
    onGameEnd: (score: number) => void;
    onClose: () => void;
}

const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', '#EF476F'];

export default function BubbleGame({ onGameEnd, onClose }: BubbleGameProps) {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [gameActive, setGameActive] = useState(true);
    const [gameFinished, setGameFinished] = useState(false); // Новое состояние для завершения игры

    const createBubble = useCallback((id: number): Bubble => {
        return {
            id,
            x: Math.random() * (width - 100),
            y: height + 50,
            size: Math.random() * 40 + 30,
            speed: Math.random() * 2 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
        };
    }, []);

    useEffect(() => {
        const initialBubbles = Array.from({ length: 15 }, (_, i) => createBubble(i));
        setBubbles(initialBubbles);

        const gameTimer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(gameTimer);
                    handleGameFinish(); // Используем новую функцию
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        const bubbleInterval = setInterval(() => {
            if (gameActive) {
                setBubbles((prev) => {
                    const newId = prev.length > 0 ? Math.max(...prev.map(b => b.id)) + 1 : 0;
                    return [...prev, createBubble(newId)];
                });
            }
        }, Math.random() * 2000 + 1000);

        return () => {
            clearInterval(gameTimer);
            clearInterval(bubbleInterval);
        };
    }, [createBubble, gameActive]);

    useEffect(() => {
        if (!gameActive) return;

        const moveBubbles = setInterval(() => {
            setBubbles((prev) =>
                prev
                    .map((bubble) => ({
                        ...bubble,
                        y: bubble.y - bubble.speed,
                    }))
                    .filter((bubble) => bubble.y > -100)
            );
        }, 50);

        return () => clearInterval(moveBubbles);
    }, [gameActive]);

    const handleBubblePress = (id: number) => {
        if (!gameActive || gameFinished) return; // Не реагировать, если игра завершена

        setScore((prev) => prev + 1);
        setBubbles((prev) => prev.filter((bubble) => bubble.id !== id));

        const newId = bubbles.length > 0 ? Math.max(...bubbles.map(b => b.id)) + 1 : 0;
        setBubbles((prev) => [...prev, createBubble(newId)]);
    };

    const handleGameFinish = () => {
        setGameActive(false);
        setGameFinished(true); // Устанавливаем флаг завершения игры
        // onGameEnd(score) пока не вызываем - пусть пользователь сам закроет
    };

    const handleEndGame = () => {
        if (gameFinished) {
            // Если игра уже завершена по времени, просто закрываем
            onGameEnd(score);
        } else {
            // Если пользователь нажал досрочно, завершаем игру
            setGameActive(false);
            setGameFinished(true);
            onGameEnd(score);
        }
    };

    const handleClose = () => {
        if (gameFinished) {
            onGameEnd(score); // Передаем счет только при закрытии после завершения
        } else {
            onClose(); // Просто закрываем без передачи счета
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>🎯 Очки: {score}</Text>
                </View>
                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>⏱️ {timeLeft}с</Text>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                    <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.gameArea}>
                {bubbles.map((bubble) => (
                    <TouchableOpacity
                        key={bubble.id}
                        style={[
                            styles.bubble,
                            {
                                left: bubble.x,
                                top: bubble.y,
                                width: bubble.size,
                                height: bubble.size,
                                backgroundColor: bubble.color,
                            },
                        ]}
                        onPress={() => handleBubblePress(bubble.id)}
                        activeOpacity={0.7}
                    />
                ))}
            </View>

            <View style={styles.instructions}>
                <Text style={styles.instructionsText}>
                    🫧 Лопай пузыри! 🫧
                </Text>
                <Text style={styles.instructionsSubText}>
                    Нажимай на пузыри, чтобы лопнуть их и заработать очки
                </Text>
            </View>

            {gameFinished && (
                <View style={styles.gameOverContainer}>
                    <Text style={styles.gameOverText}>Игра окончена!</Text>
                    <Text style={styles.finalScoreText}>🎯 Итоговый счет: {score}</Text>
                    <Text style={styles.rewardText}>
                        🎁 Награда: +{Math.floor(score / 5)} дополнительных монет
                    </Text>
                    <TouchableOpacity
                        style={styles.playAgainButton}
                        onPress={() => onGameEnd(score)}
                    >
                        <Text style={styles.playAgainButtonText}>Забрать награду</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F4FE',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#4A90E2',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    scoreContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    scoreText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    timerContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    timerText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    gameArea: {
        flex: 1,
    },
    bubble: {
        position: 'absolute',
        borderRadius: 50,
        opacity: 0.8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    instructions: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        margin: 20,
        borderRadius: 15,
    },
    instructionsText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4A90E2',
        marginBottom: 5,
    },
    instructionsSubText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    gameOverContainer: {
        position: 'absolute',
        top: '30%',
        left: '10%',
        right: '10%',
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    gameOverText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4A90E2',
        marginBottom: 10,
    },
    finalScoreText: {
        fontSize: 24,
        color: '#FF6B6B',
        marginBottom: 10,
    },
    rewardText: {
        fontSize: 18,
        color: '#4CAF50',
        marginBottom: 20,
    },
    playAgainButton: {
        backgroundColor: '#4A90E2',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
    },
    playAgainButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});