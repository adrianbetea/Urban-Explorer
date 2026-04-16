import { Pressable, StyleSheet, Text, View } from 'react-native';

type MapContainerProps = {
	onPress: () => void;
};

export function MapContainer({ onPress }: MapContainerProps) {
	return (
		<Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
			<View style={styles.pin} />
			<Text style={styles.title}>Map</Text>
			<Text style={styles.description}>Open the interactive city map.</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#E6F4FE',
		borderColor: '#C6E1F8',
		borderRadius: 16,
		borderWidth: 1,
		flex: 1,
		gap: 6,
		minHeight: 130,
		padding: 14,
	},
	pressed: {
		opacity: 0.85,
	},
	pin: {
		alignSelf: 'flex-start',
		backgroundColor: '#1A73E8',
		borderRadius: 6,
		height: 12,
		width: 12,
	},
	title: {
		color: '#0E2238',
		fontSize: 20,
		fontWeight: '800',
		marginTop: 6,
	},
	description: {
		color: '#4D6277',
		fontSize: 13,
		lineHeight: 18,
	},
});
