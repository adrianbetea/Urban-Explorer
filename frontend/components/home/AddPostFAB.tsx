import { Pressable, StyleSheet, Text } from 'react-native';

type AddPostFABProps = {
	onPress: () => void;
};

export function AddPostFAB({ onPress }: AddPostFABProps) {
	return (
		<Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
			<Text style={styles.plus}>+</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		backgroundColor: '#1A73E8',
		borderRadius: 30,
		bottom: 22,
		elevation: 5,
		height: 60,
		justifyContent: 'center',
		position: 'absolute',
		right: 18,
		width: 60,
	},
	buttonPressed: {
		opacity: 0.9,
		transform: [{ scale: 0.97 }],
	},
	plus: {
		color: '#FFFFFF',
		fontSize: 33,
		fontWeight: '300',
		marginTop: -2,
	},
});
