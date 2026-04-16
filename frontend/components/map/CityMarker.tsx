import { Pressable, StyleSheet, Text } from 'react-native';

type CityMarkerProps = {
	city: string;
	onPress: () => void;
};

export function CityMarker({ city, onPress }: CityMarkerProps) {
	return (
		<Pressable onPress={onPress} style={({ pressed }) => [styles.pin, pressed && styles.pressed]}>
			<Text style={styles.text}>{city}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	pin: {
		backgroundColor: '#1A73E8',
		borderRadius: 999,
		paddingHorizontal: 10,
		paddingVertical: 6,
	},
	pressed: {
		opacity: 0.85,
	},
	text: {
		color: '#FFFFFF',
		fontSize: 12,
		fontWeight: '700',
	},
});
