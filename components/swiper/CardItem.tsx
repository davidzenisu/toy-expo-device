import React from "react";
import { Text, View, Image, Dimensions, TouchableOpacity } from "react-native";
import Icon from "./Icon";
import styles, {
    DISLIKE_ACTIONS,
    FLASH_ACTIONS,
    LIKE_ACTIONS,
    STAR_ACTIONS,
    WHITE,
} from "../../assets/styles";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

export type CardItemT = {
    description?: string;
    hasActions?: boolean;
    hasVariant?: boolean;
    image?: any;
    isOnline?: boolean;
    matches?: string;
    name: string;
    swipeRight?(): void;
    swipeLeft?(): void;
    swipeTop?(): void;
};

const CardItem = ({
    description,
    hasActions,
    hasVariant,
    image,
    isOnline,
    matches,
    name,
    swipeRight,
    swipeLeft,
    swipeTop
}: CardItemT) => {
    // Custom styling
    const fullWidth = Dimensions.get("window").width;

    const imageStyle = [
        {
            borderRadius: 8,
            width: hasVariant ? fullWidth / 2 - 30 : fullWidth - 80,
            height: hasVariant ? 170 : 350,
            margin: hasVariant ? 0 : 20,
        },
    ];

    const nameStyle = [
        {
            paddingTop: hasVariant ? 10 : 15,
            paddingBottom: hasVariant ? 5 : 7,
            fontSize: hasVariant ? 15 : 25,
        },
    ];

    return (
        <ThemedView style={styles.containerCardItem}>
            {/* IMAGE */}
            {image && <Image source={image} style={imageStyle} />}

            {/* MATCHES */}
            {matches && (
                <ThemedView style={styles.matchesCardItem}>
                    <ThemedText style={styles.matchesTextCardItem}>
                        <Icon name="heart" color={WHITE} size={13} /> {matches}% Match!
                    </ThemedText>
                </ThemedView>
            )}

            {/* NAME */}
            <ThemedText style={nameStyle}>{name}</ThemedText>

            {/* DESCRIPTION */}
            {description && (
                <ThemedText style={styles.descriptionCardItem}>{description}</ThemedText>
            )}

            {/* STATUS */}
            {!description && (
                <ThemedView style={styles.status}>
                    <View style={isOnline ? styles.online : styles.offline} />
                    <ThemedText style={styles.statusText}>
                        {isOnline ? "Online" : "Offline"}
                    </ThemedText>
                </ThemedView>
            )}

            {/* ACTIONS */}
            {hasActions && (
                <ThemedView style={styles.actionsCardItem}>
                    <TouchableOpacity style={styles.miniButton} onPress={swipeTop}>
                        <Icon name="star" color={STAR_ACTIONS} size={14} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={swipeRight}>
                        <Icon name="heart" color={LIKE_ACTIONS} size={25} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={swipeLeft}>
                        <Icon name="close" color={DISLIKE_ACTIONS} size={25} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.miniButton} onPress={swipeTop}>
                        <Icon name="flash" color={FLASH_ACTIONS} size={14} />
                    </TouchableOpacity>
                </ThemedView>
            )}
        </ThemedView>
    );
};

export default CardItem;
