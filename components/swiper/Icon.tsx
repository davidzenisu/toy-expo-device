import React from "react";
import { Ionicons } from "@expo/vector-icons";

export type IconT = {
    name: any;
    size: number;
    color: string;
    style?: any;
};

const Icon = ({ color, name, size, style }: IconT) => (
    <Ionicons name={name} size={size} color={color} style={style} />
);

export default Icon;
