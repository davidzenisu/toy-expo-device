import React from 'react';
import { View, Text, Alert, TouchableOpacity, Linking } from 'react-native';
import { Ndef, NdefRecord, TagEvent, TNF } from 'react-native-nfc-manager';
import { ExternalLink } from './ExternalLink';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

const TNF_MAP: { [key: string]: number } = {
    EMPTY: 0x0,
    WELL_KNOWN: 0x01,
    MIME_MEDIA: 0x02,
    ABSOLUTE_URI: 0x03,
    EXTERNAL_TYPE: 0x04,
    UNKNOWN: 0x05,
    UNCHANGED: 0x06,
    RESERVED: 0x07,
};

const RTD_MAP: { [key: string]: string } = {
    TEXT: 'T', // [0x54]
    URI: 'U', // [0x55]
    SMART_POSTER: 'Sp', // [0x53, 0x70]
    ALTERNATIVE_CARRIER: 'ac', //[0x61, 0x63]
    HANDOVER_CARRIER: 'Hc', // [0x48, 0x63]
    HANDOVER_REQUEST: 'Hr', // [0x48, 0x72]
    HANDOVER_SELECT: 'Hs', // [0x48, 0x73]
};

function tnfValueToName(value: TNF) {
    for (let name in TNF_MAP) {
        if (value === TNF_MAP[name]) {
            return name;
        }
    }
    return null;
}

function rtdValueToName(value: number[] | string) {
    let rtdString: string;
    if (typeof value === 'string') {
        rtdString = value;
    } else {
        rtdString = value.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    }
    for (let name in RTD_MAP) {
        if (rtdString === RTD_MAP[name]) {
            return name;
        }
    }
    return null;
}

export function NdefMessage({ ndef }: { ndef: NdefRecord }) {
    const tnfName = tnfValueToName(ndef.tnf);
    const rtdName = rtdValueToName(ndef.type);

    return (
        <ThemedView>
            {tnfName && <ThemedText>{`TNF: ${tnfName}`}</ThemedText>}
            {rtdName && <ThemedText>{`RTD: ${rtdName}`}</ThemedText>}

            <NdefPayload ndef={ndef} rtdName={rtdName}></NdefPayload>
        </ThemedView>
    );
}

function NdefPayload({ ndef, rtdName }: { ndef: NdefRecord, rtdName: string | null }) {
    if (ndef.tnf === Ndef.TNF_WELL_KNOWN) {
        if (rtdName === 'URI') {
            return <RtdUriPayload ndef={ndef} />;
        } else if (rtdName === 'TEXT') {
            return <RtdTextPayload ndef={ndef} />;
        }
    } else {
        let mimeTypeStr: string;
        if (typeof ndef.type === 'string') {
            mimeTypeStr = ndef.type;
        } else {
            mimeTypeStr = String.fromCharCode(...ndef.type);
        }
        if (mimeTypeStr === Ndef.MIME_WFA_WSC) {
            return <WifiSimplePayload ndef={ndef} />;
        } else if (mimeTypeStr.indexOf('text') === 0) {
            return <TextBasedMimePayload ndef={ndef} mimeType={mimeTypeStr} />;
        } else {
            return <ThemedText>{mimeTypeStr}</ThemedText>;
        }
    }
    return null;
}

function RtdTextPayload({ ndef }: { ndef: NdefRecord }) {
    let text = Ndef.text.decodePayload(ndef.payload as unknown as Uint8Array);
    console.log(ndef.payload)
    console.log(text)
    return <ThemedText style={{ fontSize: 18 }}>{text}</ThemedText>;
}

function RtdUriPayload({ ndef }: { ndef: NdefRecord }) {
    let uri = Ndef.uri.decodePayload(ndef.payload as unknown as Uint8Array);
    return (
        <ExternalLink href={uri}>
            <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
    );
}

function WifiSimplePayload({ ndef }: { ndef: NdefRecord }) {
    let credentials = Ndef.wifiSimple.decodePayload(ndef.payload as unknown as Uint8Array);
    return (
        <ThemedView style={{ marginTop: 10 }}>
            <ThemedText style={{ marginBottom: 5 }}>WIFI_SIMPLE</ThemedText>
            <ThemedView style={{ flexDirection: 'row', marginBottom: 5 }}>
                <ThemedText style={{ marginRight: 5 }}>SSID:</ThemedText>
                <ThemedText style={{ fontSize: 16, flex: 1 }}>
                    {credentials.ssid || '---'}
                </ThemedText>
            </ThemedView>
            <ThemedView style={{ flexDirection: 'row', marginBottom: 5 }}>
                <ThemedText style={{ marginRight: 5 }}>Network Key:</ThemedText>
                <ThemedText style={{ fontSize: 16, flex: 1 }}>
                    {credentials.networkKey || '---'}
                </ThemedText>
            </ThemedView>
        </ThemedView>
    );
}

function TextBasedMimePayload({ ndef, mimeType }: { ndef: NdefRecord, mimeType: string }) {
    let text = Ndef.util.bytesToString(ndef.payload);
    return (
        <ThemedView>
            <ThemedText style={{ fontSize: 16 }}>{mimeType}</ThemedText>
            <ThemedText style={{ fontSize: 16 }}>{text}</ThemedText>
        </ThemedView>
    );
}

export default NdefMessage;