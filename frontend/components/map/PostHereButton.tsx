import { Pressable, StyleSheet, Text } from 'react-native';

type PostHereButtonProps = {
	cityName: string;
	onPress: () => void;
};

export function PostHereButton({ cityName, onPress }: PostHereButtonProps) {
	return (
		<Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
			<Text style={styles.text}>Add a Spot in {cityName}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		backgroundColor: '#1A73E8',
		borderRadius: 12,
		paddingVertical: 12,
	},
	pressed: {
		opacity: 0.9,
	},
	text: {
		color: '#FFFFFF',
		fontWeight: '700',
	},
});
