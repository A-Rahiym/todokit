import { Category } from '@/utils/conversions';
import * as Haptics from "expo-haptics";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../utils/theme';

interface CategoryItemProps {
    value: string;
    label: string;
    icon: string;
    selected: Category;
    Press: () => void;
}


export function CategoryItem({ value, label, icon, selected, Press }: CategoryItemProps) {
    return (
        <TouchableOpacity
            onPress={
                () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Press();
                    console.log("pressed", value);
                }
            }
            style={[styles.tab, selected === value && styles.tabActive]}
            activeOpacity={0.7}
        >
            <Text style={styles.icon}>{icon}</Text>
            <Text style={[styles.label, selected === value && styles.labelActive]}>
                {label}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    tab: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 50,
        backgroundColor: Colors.bgElevated,
        borderWidth: 1,
        borderColor: Colors.border,
        flexShrink: 0,
        alignSelf: "flex-start",
    },
    tabActive: {
        backgroundColor: `${Colors.accentPurple}22`,
        borderColor: Colors.accentPurple,
    },
    icon: {
        fontSize: 14,
    },

    labelActive: {
        color: Colors.accentPurple,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.textSecondary,
    },
})
