import { Pressable, StyleSheet, Text } from 'react-native';

type DeletePostButtonProps = {
	onPress: () => void;
};

export function DeletePostButton({ onPress }: DeletePostButtonProps) {
	return (
		<Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
			<Text style={styles.text}>Delete post</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		backgroundColor: '#FEEFF0',
		borderColor: '#F6C3C8',
		borderRadius: 10,
		borderWidth: 1,
		paddingVertical: 11,
	},
	pressed: {
		opacity: 0.85,
	},
	text: {
		color: '#C73A4A',
		fontWeight: '700',
	},
});
