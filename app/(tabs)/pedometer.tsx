import { Alert, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState } from 'react';

import { Pedometer } from 'expo-sensors';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Ionicons } from '@expo/vector-icons';

import {
    initialize,
    requestPermission,
    getGrantedPermissions,
    readRecords,
    Permission,
} from 'react-native-health-connect';

export default function TabPedometerScreen() {
    // region: pedometer

    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [pastStepCount, setPastStepCount] = useState(0);
    const [currentStepCount, setCurrentStepCount] = useState(0);

    const handlePedometerPermission = async () => {
        const permissions = await Pedometer.getPermissionsAsync();
        if (!permissions.granted) {
            await Pedometer.requestPermissionsAsync();
            const updatedPermissions = await Pedometer.getPermissionsAsync();
            if (!updatedPermissions.granted) {
                Alert.alert("You cannot test takes steps unless you grant permission!")
                handlePedometerPermission();
            }
        }
    }

    const subscribe = async () => {
        try {
            await handlePedometerPermission();
        } catch (error) {
            console.log("Error fetching permissions!");
        }
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
                console.log(`Past 24 steps not available: ${error}`);
            }


            return Pedometer.watchStepCount(result => {
                setCurrentStepCount(result.steps);
            });
        }
    };

    // region: Health Connect

    const [healtConnectStepCount, setHealtConnectStepCount] = useState(0);

    const setupHealthConnect = async () => {
        try {
            await initialize();
            await handleHealthConnectPermission();
            await getStepsCounter();
        } catch (error) {
            console.log(`Error while setting up Health Connect: ${error}`);
        }
    }

    const handleHealthConnectPermission = async () => {
        const requiredPermissions: Permission[] = [
            {
                accessType: "read",
                recordType: "Steps",
            }
        ];

        const checkPermissionsGranted = (requestedPermissions: Permission[], grantedPermissions: Permission[]): boolean => {
            const arePermissionsMissing = requestedPermissions.some((rp) => {
                const isInGrantedPermissions = grantedPermissions.some((gp) => {
                    return gp.accessType === rp.accessType && gp.accessType === rp.accessType;
                });
                return !isInGrantedPermissions;
            });
            return arePermissionsMissing;
        };
        const grantedPermissions = await getGrantedPermissions();
        const permissionsGranted = checkPermissionsGranted(requiredPermissions, grantedPermissions);

        if (!permissionsGranted) {
            await requestPermission(requiredPermissions);
            const updatedgrantedPermissions = await getGrantedPermissions();
            const updatedPermissionsGranted = checkPermissionsGranted(requiredPermissions, updatedgrantedPermissions);
            if (!updatedPermissionsGranted) {
                Alert.alert("You cannot test takes steps unless you grant permission!")
                handleHealthConnectPermission();
            }
        }
    };

    const getStepsCounter = async () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 1);
        const stepRecords = await readRecords("Steps", {
            timeRangeFilter: {
                operator: "between",
                startTime: start.toISOString(),
                endTime: end.toISOString(),
            },
        });
        const stepSum = stepRecords.records.reduce((sum, step) => {
            return sum + step.count;
        }, 0);
        setHealtConnectStepCount(stepSum);
    }

    useEffect(() => {
        setupHealthConnect();
        const subscription = subscribe();
        return () => subscription && subscription.remove();
    }, []);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<Ionicons size={310} name="barbell" style={styles.headerImage} />}>
            <ThemedView>
                <ThemedText type="subtitle">This is the output of the built in Expo Pedometer:</ThemedText>
                <ThemedText>Pedometer.isAvailableAsync(): {isPedometerAvailable}</ThemedText>
                <ThemedText>Steps taken in the last 24 hours (only work on iOS): {pastStepCount}</ThemedText>
                <ThemedText>Walk! And watch this go up: {currentStepCount}</ThemedText>
            </ThemedView>
            <ThemedView>
                <ThemedText type="subtitle">This is the output of the Health Connect Plugin (Android):</ThemedText>
                <ThemedText>Steps taken in the last 24 hours (only works on Android): {healtConnectStepCount}</ThemedText>
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
