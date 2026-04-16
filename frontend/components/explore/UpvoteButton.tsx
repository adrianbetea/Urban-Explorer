import { Pressable, StyleSheet, Text } from 'react-native';

type UpvoteButtonProps = {
	onPress: () => void;
};

export function UpvoteButton({ onPress }: UpvoteButtonProps) {
	return (
		<Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
			<Text style={styles.text}>Upvote</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: '#E7F5EC',
		borderColor: '#B9E2C8',
		borderRadius: 999,
		borderWidth: 1,
		paddingHorizontal: 10,
		paddingVertical: 6,
	},
	pressed: {
		opacity: 0.85,
	},
	text: {
		color: '#1B8A5A',
		fontSize: 12,
		fontWeight: '700',
	},
});
