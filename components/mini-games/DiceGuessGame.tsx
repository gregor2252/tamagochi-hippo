// components/mini-games/DiceGuessGame.tsx
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

interface DiceGuessGameProps {
    onGameEnd: (score: number) => void;
    onClose: () => void;
}

const DICE_EMOJIS = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
const DICE_NUMBERS = [1, 2, 3, 4, 5, 6];

export default function DiceGuessGame({ onGameEnd, onClose }: DiceGuessGameProps) {
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [totalRounds] = useState(10);
    const [targetNumber, setTargetNumber] = useState(1);
    const [playerGuess, setPlayerGuess] = useState<number | null>(null);
    const [gameActive, setGameActive] = useState(true);
    const [isRolling, setIsRolling] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [streak, setStreak] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [resultWin, setResultWin] = useState(false);
    const [roundsPlayed, setRoundsPlayed] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false); // Новое состояние для завершения игры

    // Завершение игры - теперь просто показываем экран завершения
    useEffect(() => {
        if (roundsPlayed >= totalRounds && gameActive && !gameCompleted) {
            setGameActive(false);
            setGameCompleted(true); // Устанавливаем флаг завершения игры
        }
    }, [roundsPlayed, gameActive, totalRounds, gameCompleted]);

    const rollDice = () => {
        return Math.floor(Math.random() * 6) + 1;
    };

    const startNewRound = () => {
        // Бросаем кубик для нового раунда
        const newTarget = rollDice();
        setTargetNumber(newTarget);
        setPlayerGuess(null);
        setResultMessage('');
    };

    // Инициализация первого раунда
    useEffect(() => {
        const initialTarget = rollDice();
        setTargetNumber(initialTarget);
    }, []);

    const handleGuess = (number: number) => {
        if (isRolling || showResult || !gameActive || playerGuess !== null) return;

        // Сохраняем выбор игрока
        setPlayerGuess(number);
        setIsRolling(true);

        // Анимация броска
        let rollCount = 0;
        const maxRolls = 8;

        // Генерируем финальный результат заранее
        const finalResult = rollDice();

        const interval = setInterval(() => {
            setTargetNumber(prev => {
                let newNum = prev + 1;
                if (newNum > 6) newNum = 1;
                return newNum;
            });
            rollCount++;

            if (rollCount >= maxRolls) {
                clearInterval(interval);
                // Устанавливаем финальный результат после анимации
                setTargetNumber(finalResult);
                setTimeout(() => {
                    checkResult(number, finalResult); // Передаем выбор игрока напрямую
                }, 100);
            }
        }, 150);
    };

    const checkResult = (guess: number, finalNumber: number) => {
        setIsRolling(false);

        const win = guess === finalNumber;

        if (win) {
            const newStreak = streak + 1;
            setStreak(newStreak);
            const points = 15 + Math.floor(newStreak * 3);
            setScore(prev => prev + points);
            setResultWin(true);
            setResultMessage(`🎉 Угадали! Выпало ${finalNumber}`);
        } else {
            setStreak(0);
            setResultWin(false);
            setResultMessage(`😢 Не угадали! Выпало ${finalNumber}, а вы выбрали ${guess}`);
        }

        setShowResult(true);
    };

    const handleContinue = () => {
        setShowResult(false);
        setRoundsPlayed(prev => prev + 1);

        if (roundsPlayed + 1 < totalRounds) {
            // Увеличиваем раунд и начинаем новый
            setRound(prev => prev + 1);
            setTimeout(() => {
                startNewRound();
            }, 500);
        } else {
            // Завершаем игру, но не закрываем автоматически
            setGameActive(false);
            setGameCompleted(true);
        }
    };

    const handleEndGame = () => {
        setGameActive(false);
        onGameEnd(score);
    };

    const handleFinishGame = () => {
        // Вызывается при нажатии на кнопку "Забрать награду"
        onGameEnd(score);
    };

    return (
        <View style={styles.container}>
            {/* Шапка игры */}
            <View style={styles.header}>
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>🏆 Очки: {score}</Text>
                </View>
                <View style={styles.roundContainer}>
                    <Text style={styles.roundText}>🎯 Раунд: {round}/{totalRounds}</Text>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={handleEndGame}>
                    <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
            </View>

            {/* Серия побед */}
            {streak > 1 && (
                <View style={styles.streakContainer}>
                    <Text style={styles.streakText}>🔥 Серия побед: {streak}!</Text>
                </View>
            )}

            {/* Основной экран игры */}
            {gameActive && !gameCompleted && (
                <View style={styles.gameArea}>
                    <Text style={styles.title}>🎲 Угадай число на кубике!</Text>
                    <Text style={styles.subtitle}>
                        Угадайте какое число выпадет на кубике
                    </Text>

                    {/* Показываем текущий кубик */}
                    <View style={styles.diceContainer}>
                        <Text style={styles.diceLabel}>
                            {isRolling ? 'Крутим кубик...' : 'Ваш кубик:'}
                        </Text>
                        <View style={[styles.dice, isRolling && styles.rollingDice]}>
                            <Text style={styles.diceEmoji}>{DICE_EMOJIS[targetNumber - 1]}</Text>
                            <Text style={styles.diceValue}>{targetNumber}</Text>
                        </View>
                        <Text style={styles.diceHint}>
                            {isRolling ? 'Дождитесь остановки...' :
                                playerGuess ? `Вы выбрали: ${playerGuess}` : 'Выберите число ниже!'}
                        </Text>
                    </View>

                    {/* Кнопки для выбора числа */}
                    <View style={styles.guessContainer}>
                        <Text style={styles.guessTitle}>Выберите число:</Text>

                        <View style={styles.numbersGrid}>
                            {DICE_NUMBERS.map(number => (
                                <TouchableOpacity
                                    key={number}
                                    style={[
                                        styles.numberButton,
                                        playerGuess === number && styles.numberButtonSelected,
                                        (isRolling || showResult || playerGuess !== null) && styles.numberButtonDisabled
                                    ]}
                                    onPress={() => handleGuess(number)}
                                    disabled={isRolling || showResult || playerGuess !== null || !gameActive}
                                >
                                    <Text style={styles.numberEmoji}>{DICE_EMOJIS[number - 1]}</Text>
                                    <Text style={styles.numberText}>{number}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Правила */}
                    <View style={styles.rulesContainer}>
                        <Text style={styles.rulesTitle}>📖 Правила:</Text>
                        <Text style={styles.rule}>• Угадайте, какое число выпадет на кубике</Text>
                        <Text style={styles.rule}>• Нажмите на число от 1 до 6</Text>
                        <Text style={styles.rule}>• Если угадали - получаете 18+ очков</Text>
                        <Text style={styles.rule}>• Серия побед даёт бонусные очки</Text>
                    </View>
                </View>
            )}

            {/* Модальное окно результата раунда */}
            {showResult && !gameCompleted && (
                <View style={styles.resultModal}>
                    <View style={[
                        styles.resultContent,
                        resultWin ? styles.resultWin : styles.resultLose
                    ]}>
                        <Text style={styles.resultTitle}>
                            {resultWin ? '🎉 ПОБЕДА!' : '😢 ПОРАЖЕНИЕ'}
                        </Text>

                        <Text style={styles.resultMessage}>{resultMessage}</Text>

                        <View style={styles.resultComparison}>
                            <View style={styles.resultItem}>
                                <Text style={styles.resultLabel}>Ваш выбор:</Text>
                                <Text style={styles.resultEmoji}>{DICE_EMOJIS[(playerGuess || 1) - 1]}</Text>
                                <Text style={styles.resultNumber}>{playerGuess || '—'}</Text>
                            </View>

                            <Text style={styles.vsText}>VS</Text>

                            <View style={styles.resultItem}>
                                <Text style={styles.resultLabel}>Выпало:</Text>
                                <Text style={styles.resultEmoji}>{DICE_EMOJIS[targetNumber - 1]}</Text>
                                <Text style={styles.resultNumber}>{targetNumber}</Text>
                            </View>
                        </View>

                        <Text style={styles.resultScore}>
                            {resultWin ? `+${15 + Math.floor(streak * 3)} очков` : '+0 очков'}
                        </Text>

                        {streak > 1 && resultWin && (
                            <Text style={styles.resultStreak}>
                                🔥 Серия побед: {streak}!
                            </Text>
                        )}

                        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                            <Text style={styles.continueButtonText}>
                                {roundsPlayed + 1 < totalRounds ? 'Следующий раунд' : 'Завершить игру'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Экран завершения игры */}
            {gameCompleted && (
                <View style={styles.gameOverContainer}>
                    <Text style={styles.gameOverTitle}>🏁 Игра окончена!</Text>
                    <Text style={styles.finalScore}>Итоговый счет: {score} очков</Text>
                    <Text style={styles.rewardText}>
                        🎁 Награда: {Math.floor(score / 2)} дополнительных монет
                    </Text>
                    <TouchableOpacity style={styles.playAgainButton} onPress={handleFinishGame}>
                        <Text style={styles.playAgainText}>Забрать награду</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#6D4C41',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        flexWrap: 'wrap',
    },
    scoreContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginVertical: 4,
    },
    scoreText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    roundContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginVertical: 4,
    },
    roundText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    streakContainer: {
        backgroundColor: 'rgba(255, 87, 34, 0.2)',
        padding: 10,
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FF5722',
        alignItems: 'center',
    },
    streakText: {
        color: '#FF5722',
        fontSize: 16,
        fontWeight: 'bold',
    },
    gameArea: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFD54F',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#BDBDBD',
        textAlign: 'center',
        marginBottom: 20,
    },
    diceContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    diceLabel: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 10,
        fontWeight: '600',
    },
    dice: {
        width: 120,
        height: 120,
        backgroundColor: '#fff',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 4,
        borderColor: '#6D4C41',
        marginBottom: 10,
    },
    rollingDice: {
        transform: [{ rotate: '360deg' }],
    },
    diceEmoji: {
        fontSize: 56,
        marginBottom: 5,
    },
    diceValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6D4C41',
    },
    diceHint: {
        fontSize: 14,
        color: '#BDBDBD',
        fontStyle: 'italic',
    },
    guessContainer: {
        marginBottom: 25,
    },
    guessTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 15,
    },
    numbersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
    },
    numberButton: {
        width: 70,
        height: 70,
        backgroundColor: '#424242',
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    numberButtonSelected: {
        backgroundColor: '#388E3C',
        borderColor: '#4CAF50',
        transform: [{ scale: 1.1 }],
    },
    numberButtonDisabled: {
        opacity: 0.5,
    },
    numberEmoji: {
        fontSize: 32,
        marginBottom: 2,
    },
    numberText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    rulesContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    rulesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD54F',
        marginBottom: 10,
    },
    rule: {
        fontSize: 14,
        color: '#E0E0E0',
        marginBottom: 5,
        marginLeft: 10,
    },
    resultModal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    resultContent: {
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
    },
    resultWin: {
        backgroundColor: '#E8F5E9',
        borderWidth: 3,
        borderColor: '#4CAF50',
    },
    resultLose: {
        backgroundColor: '#FFEBEE',
        borderWidth: 3,
        borderColor: '#F44336',
    },
    resultTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    resultMessage: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        color: '#424242',
    },
    resultComparison: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        gap: 25,
    },
    resultItem: {
        alignItems: 'center',
    },
    resultLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    resultEmoji: {
        fontSize: 48,
        marginBottom: 5,
    },
    resultNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6D4C41',
    },
    vsText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF5722',
    },
    resultScore: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF9800',
        marginTop: 10,
    },
    resultStreak: {
        fontSize: 16,
        color: '#FF5722',
        marginTop: 5,
        fontWeight: '600',
    },
    continueButton: {
        backgroundColor: '#6D4C41',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
        marginTop: 25,
    },
    continueButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    gameOverContainer: {
        position: 'absolute',
        top: '25%',
        left: '10%',
        right: '10%',
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    gameOverTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#6D4C41',
        marginBottom: 15,
    },
    finalScore: {
        fontSize: 24,
        color: '#FF9800',
        marginBottom: 10,
        fontWeight: '600',
    },
    streakBonus: {
        fontSize: 18,
        color: '#FF5722',
        marginBottom: 10,
        fontWeight: '600',
    },
    accuracy: {
        fontSize: 18,
        color: '#2196F3',
        marginBottom: 10,
        fontWeight: '600',
    },
    rewardText: {
        fontSize: 18,
        color: '#4CAF50',
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: '600',
    },
    playAgainButton: {
        backgroundColor: '#6D4C41',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
    },
    playAgainText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});