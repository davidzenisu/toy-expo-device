import Ionicons from '@expo/vector-icons/Ionicons';
import { FlatList, ScrollView, StyleSheet } from 'react-native';
import NfcManager, { NfcTech, TagEvent } from 'react-native-nfc-manager';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ThemedButton from '@/components/ThemedButton';

import Constants from 'expo-constants'
import { ExternalLink } from '@/components/ExternalLink';
import { useEffect, useState } from 'react';
import { Collapsible } from '@/components/Collapsible';

export default function TabNfcScreen() {
    const isRunningInExpoGo = Constants.appOwnership === 'expo'
    const [tag, setTag] = useState<TagEvent | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    useEffect(() => {
        readNdef();
    }, []);

    async function readNdef() {
        try {
            setLoading(true);
            setTag(null);
            // register for the NFC tag with NDEF in it
            await NfcManager.requestTechnology(NfcTech.Ndef);
            // the resolved tag object will contain `ndefMessage` property
            const tag = await NfcManager.getTag();
            setTag(tag);
        } catch (ex) {
            console.warn('Oops!', ex);
            setErrorMsg(ex as string);
        } finally {
            // stop the nfc scanning
            NfcManager.cancelTechnologyRequest();
            setLoading(false);
        }
    }

    let text = 'Searching...';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = `Found tag!`;
    }



    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<Ionicons size={310} name="hardware-chip" style={styles.headerImage} />}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">NFC Service</ThemedText>
            </ThemedView>
            <ThemedText>This tab should show your nfc tag contents.</ThemedText>
            <ThemedText>{text}</ThemedText>
            <ThemedButton onPress={readNdef} label={'Fetch tag'} disabled={isRunningInExpoGo || loading}></ThemedButton>
            <ExpoGoDisclaimer isRunningInExpoGo={isRunningInExpoGo}></ExpoGoDisclaimer>
            <TagInfo tag={tag}></TagInfo>
        </ParallaxScrollView>
    );
}

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function TagInfo({ tag }: { tag: TagEvent | null }) {
    if (!tag) {
        return null;
    }

    const tagObject = Array.from(Object.entries(tag), ([key, value]) => { return { label: capitalizeFirstLetter(key), value: value }; });

    return <Collapsible title="NFC" expanded={true}>
        <ScrollView horizontal={true}>
            <FlatList
                data={tagObject}
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

function ExpoGoDisclaimer({ isRunningInExpoGo }: { isRunningInExpoGo: boolean }) {
    if (!isRunningInExpoGo) {
        return null;
    }
    return (
        <ThemedView>
            <ThemedText type="defaultSemiBold">You are using Expo Go. </ThemedText>
            <ThemedText>Unfortunately, testing NFC via Expo Go is not possible.</ThemedText>
            <ExternalLink href="https://github.com/revtel/react-native-nfc-manager/wiki/Expo-Go">
                <ThemedText type="link">Learn more</ThemedText>
            </ExternalLink>
        </ThemedView>
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
