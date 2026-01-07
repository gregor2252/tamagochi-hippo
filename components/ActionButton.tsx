// components/ActionButton.tsx
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';

// Определяем тип для доступных иконок
type AvailableIcon =
    | 'fork.knife'      // кормление
    | 'drop.fill'       // чистка
    | 'gamecontroller.fill' // игра
    | 'moon.zzz.fill'   // сон
    | 'house.fill'      // дом
    | 'paperplane.fill' // отправка
    | 'chevron.left.forwardslash.chevron.right' // код
    | 'chevron.right';  // стрелка

interface ActionButtonProps {
    title: string;
    icon: AvailableIcon; // Используем конкретный тип
    onPress: () => void;
    disabled?: boolean;
}

export default function ActionButton({
    title,
    icon,
    onPress,
    disabled = false
}: ActionButtonProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={styles.container}
        >
            <ThemedView style={[
                styles.button,
                disabled && styles.disabled
            ]}>
                <IconSymbol name={icon} size={32} color="#fff" />
                <ThemedText style={styles.text}>{title}</ThemedText>
            </ThemedView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '48%',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#4A90E2',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        color: '#fff',
        marginTop: 8,
        fontWeight: '600',
    },
});