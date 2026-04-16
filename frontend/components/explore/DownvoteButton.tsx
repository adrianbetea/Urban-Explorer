import { Pressable, StyleSheet, Text } from 'react-native';

type DownvoteButtonProps = {
	onPress: () => void;
};

export function DownvoteButton({ onPress }: DownvoteButtonProps) {
	return (
		<Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
			<Text style={styles.text}>Downvote</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: '#FEEFF0',
		borderColor: '#F6C3C8',
		borderRadius: 999,
		borderWidth: 1,
		paddingHorizontal: 10,
		paddingVertical: 6,
	},
	pressed: {
		opacity: 0.85,
	},
	text: {
		color: '#C73A4A',
		fontSize: 12,
		fontWeight: '700',
	},
});

