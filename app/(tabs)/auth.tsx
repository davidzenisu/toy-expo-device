import { StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';

// import statusCodes along with GoogleSignin
import {
    GoogleSignin,
    isErrorWithCode,
    isSuccessResponse,
    statusCodes,
    User,
} from '@react-native-google-signin/google-signin';
import { useState } from 'react';
import ThemedButton from '@/components/ThemedButton';

interface UserData {
    userInfo: User
}

export default function AuthScreen() {
    const [user, setUser] = useState<UserData | null>(null);

    GoogleSignin.configure({ webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEBCLIENT_ID });

    const signOut = async () => {
        try {
            await GoogleSignin.signOut();
            setUser(null);
        } catch (error) {
            console.error(`There was an error during logout: ${error}`);
        }
    }

    // Somewhere in your code
    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            if (isSuccessResponse(response)) {
                const userData = {
                    userInfo: response.data
                }
                setUser(userData);
                console.log(`Access token is: ${userData.userInfo.idToken ? "set" : "not set"}`);
            } else {
                // sign in was cancelled by user
            }
        } catch (error) {
            console.error(`There was an error during login: ${error}`);
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.IN_PROGRESS:
                        // operation (eg. sign in) already in progress
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        // Android only, play services not available or outdated
                        break;
                    default:
                    // some other error happened
                }
            } else {
                // an error that's not related to google sign in occurred
            }
        }
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<Ionicons size={310} name="key" style={styles.headerImage} />}>
            <ThemedView style={styles.column}>
                <ThemedText type="title">Authentication</ThemedText>
                <ThemedText > {user ? `Hello ${user?.userInfo.user.givenName}!` : "Not logged in..."} </ThemedText>
                <ThemedButton onPress={user ? signOut : signIn} label={user ? "Logout" : "Login"}>
                    <ThemedText>Login</ThemedText>
                </ThemedButton>
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
    column: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        gap: 24,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 8,
    },
});
