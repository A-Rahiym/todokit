import { ConversionRecord } from "@/store/converterStore";
import { Category, UNITS } from "@/utils/conversions";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../utils/theme";


interface HistoryItemProps extends ConversionRecord {
    From: string;
    To: string;
    category: Category;
    result: string;
    timestamp: number;
    UNIT: typeof UNITS;
    setCategory: (cat: Category) => void;
    setFromUnit: (unit: any) => void;
    setToUnit: (unit: any) => void;
    setInputValue: (val: string) => void;
}

export function HistoryItem({ id, From, To, category, result, timestamp, UNIT, setCategory, setFromUnit, setToUnit, setInputValue }: HistoryItemProps) {
    return (
        <TouchableOpacity
            key={id}
            style={styles.historyItem}
            onPress={() => {
                const units = UNITS[category as Category];
                const from = units.find((u) => u.value === From);
                const to = units.find((u) => u.value === To);
                if (from && to) {
                    setCategory(category as Category);
                    setTimeout(() => {
                        setFromUnit(from);
                        setToUnit(to);
                        setInputValue(result);
                    }, 50);
                }
            }}
            activeOpacity={0.7}
        >
            <Text style={styles.historyIcon}>🕐</Text>
            <Text style={styles.historyText}>
                {result} {From} → {result} {To}
            </Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    historyItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: Colors.bgElevated,
    },
    historyIcon: {
        fontSize: 16,
    },
    historyText: {
        fontSize: 14,
        color: Colors.textPrimary,
    },
})

