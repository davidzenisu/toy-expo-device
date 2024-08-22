import React from 'react';
import { StyleSheet, Pressable, PressableProps } from 'react-native';
import { ThemedText } from './ThemedText';

export type ThemedButtonProps = PressableProps & {
    label: string;
    lightColor?: string;
    darkColor?: string;
};

export default function ThemedButton({
    label,
    lightColor,
    darkColor,
    disabled,
    ...rest
}: ThemedButtonProps) {
    const styleList = disabled ? [styles.button, styles.button_disabled] : styles.button;
    return (
        <Pressable style={styleList}
            disabled={disabled}
            {...rest}>
            <ThemedText style={styles.text}>{label}</ThemedText>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
    },
    button_disabled: {
        opacity: 0.3,
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});