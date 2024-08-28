import React, { useState } from "react";
import CardItem from "@/components/swiper/CardItem";
import DEMO, { DataT } from "../../assets/data/demo";
import Swiper from "react-native-deck-swiper";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, useColorScheme } from 'react-native';
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Animated from "react-native-reanimated";

export default function Swipe() {
    const [swiper, setSwiper] = useState<Swiper<DataT> | null>(null);

    function swipe(direction: "up" | "down" | "left" | "right") {
        switch (direction) {
            case "up":
                swiper?.swipeTop();
                break;
            case "down":
                swiper?.swipeBottom();
                break;
            case "left":
                swiper?.swipeLeft();
                break;
            case "right":
                swiper?.swipeRight();
                break;
        }
    }

    const colorScheme = useColorScheme() ?? 'light';
    const headerBackgroundColor = { light: '#D0D0D0', dark: '#353636' };

    return (
        <ThemedView>
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                headerImage={<Ionicons size={310} name="heart-circle" style={styles.headerImage} />}>
            </ParallaxScrollView>
            <Swiper
                ref={(newSwiper): void => setSwiper(newSwiper)}
                cards={DEMO}
                renderCard={(item) => {
                    return (
                        <CardItem
                            hasActions
                            image={item.image}
                            name={item.name}
                            description={item.description}
                            matches={item.match}
                            swipeRight={() => { swipe("right") }}
                            swipeLeft={() => { swipe("left") }}
                            swipeTop={() => { swipe("up") }}
                        />
                    )
                }}
                infinite={true}
                onSwiped={(cardIndex) => { console.log(cardIndex); }}
                onSwipedAll={() => { console.log('onSwipedAll') }}
                cardIndex={0}
                backgroundColor={headerBackgroundColor[colorScheme]}
                stackSize={3}>
            </Swiper>
        </ThemedView >
    );
};

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    header: {
        height: 250,
        overflow: 'hidden',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});
