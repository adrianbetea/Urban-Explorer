import { Pressable, StyleSheet, Text } from 'react-native';

type PostMarkerProps = {
	label: string;
	onPress: () => void;
};

export function PostMarker({ label, onPress }: PostMarkerProps) {
	return (
		<Pressable onPress={onPress} style={({ pressed }) => [styles.marker, pressed && styles.pressed]}>
			<Text style={styles.text}>{label}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	marker: {
		backgroundColor: '#FFFFFF',
		borderColor: '#C5D9EE',
		borderRadius: 999,
		borderWidth: 1,
		paddingHorizontal: 9,
		paddingVertical: 5,
	},
	pressed: {
		opacity: 0.85,
	},
	text: {
		color: '#0E2238',
		fontSize: 12,
		fontWeight: '600',
	},
});
