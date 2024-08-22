import Ionicons from '@expo/vector-icons/Ionicons';
import { FlatList, Pressable, ScrollView, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Collapsible } from '@/components/Collapsible';
import ThemedButton from '@/components/ThemedButton';

export default function TabLocationScreen() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    useEffect(() => {
        fetchLocation();
    }, []);

    function timeout(delay: number) {
        return new Promise(res => setTimeout(res, delay));
    }

    async function fetchLocation() {
        setLoading(true);
        setLocation(null);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied!');
            return;
        }

        await timeout(1000); //for 1 sec delay

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setLoading(false);
    }

    let text = 'Searching...';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        const locationDate = new Date(location.timestamp);
        text = `Found (last update: ${locationDate.toLocaleTimeString()})!`;
    }

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<Ionicons size={310} name="location" style={styles.headerImage} />}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Location Service</ThemedText>
            </ThemedView>
            <ThemedText>This tab should show your location.</ThemedText>
            <ThemedText>{text}</ThemedText>
            <ThemedButton onPress={fetchLocation} label={'Fetch again'} disabled={loading}>
                <ThemedText>This tab should show your location.</ThemedText>
            </ThemedButton>
            <LocationInfo location={location}></LocationInfo>
        </ParallaxScrollView>
    );
}

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function LocationInfo({ location }: { location: Location.LocationObject | null }) {
    if (!location) {
        return null;
    }

    const locationObject = Array.from(Object.entries(location.coords), ([key, value]) => { return { label: capitalizeFirstLetter(key), value: value }; });

    return <Collapsible title="Location" expanded={true}>
        <ScrollView horizontal={true}>
            <FlatList
                data={locationObject}
                renderItem={({ item }) => (
                    <ThemedText>
                        <ThemedText type="defaultSemiBold">{item.label}:</ThemedText>
                        <ThemedText> {item.value}</ThemedText>
                    </ThemedText>
                )}
            />
        </ScrollView>
    </Collapsible>;
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
