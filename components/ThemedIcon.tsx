// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import { useThemeColor } from '@/hooks/useThemeColor';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';

export type ThemedIconProps = IconProps<ComponentProps<typeof Ionicons>['name']> & {
    lightColor?: string;
    darkColor?: string;
    type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};


export function ThemedIcon({
    lightColor,
    darkColor,
    type = 'default',
    ...rest
}: ThemedIconProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'icon');
    return <Ionicons size={28} color={color} {...rest} />;
}
