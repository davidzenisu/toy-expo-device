import { Alert, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState } from 'react';

import { Pedometer } from 'expo-sensors';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Ionicons } from '@expo/vector-icons';

export default function TabPedometerScreen() {
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [pastStepCount, setPastStepCount] = useState(0);
    const [currentStepCount, setCurrentStepCount] = useState(0);

    const handlePedometerPermission = async () => {
        const permissions = await Pedometer.getPermissionsAsync()
        if (!permissions.granted) {
            await Pedometer.requestPermissionsAsync()
            const updatedPermissions = await Pedometer.getPermissionsAsync()
            if (!updatedPermissions.granted) {
                Alert.alert("You cannot test takes steps unless you grant permission!")
                handlePedometerPermission();
            }
        }
    }

    const subscribe = async () => {
        await handlePedometerPermission();
        const isAvailable = await Pedometer.isAvailableAsync();

        setIsPedometerAvailable(String(isAvailable));

        if (isAvailable) {
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - 1);

            try {
                const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
                if (pastStepCountResult) {
                    setPastStepCount(pastStepCountResult.steps);
                }
            } catch (error) {
                console.log(`Past 24 steps not available: ${error}`)
            }


            return Pedometer.watchStepCount(result => {
                setCurrentStepCount(result.steps);
            });
        }
    };

    useEffect(() => {
        const subscription = subscribe();
        return () => subscription && subscription.remove();
    }, []);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<Ionicons size={310} name="barbell" style={styles.headerImage} />}>
            <ThemedView>
                <ThemedText>Pedometer.isAvailableAsync(): {isPedometerAvailable}</ThemedText>
                <ThemedText>Steps taken in the last 24 hours: {pastStepCount}</ThemedText>
                <ThemedText>Walk! And watch this go up: {currentStepCount}</ThemedText>
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});
