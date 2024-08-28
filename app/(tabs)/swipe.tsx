import React, { useState } from "react";
import { View } from "react-native";
import CardItem from "@/components/swiper/CardItem";
import styles from "../../assets/styles";
import DEMO, { DataT } from "../../assets/data/demo";
import Swiper from "react-native-deck-swiper";

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

    return (
        <View style={styles.containerHome}>
            <View style={styles.top}>
            </View>

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
                backgroundColor={'#4FD0E9'}
                stackSize={3}>
            </Swiper>
        </View>
    );
};
