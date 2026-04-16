import { Pressable, StyleSheet, Text } from 'react-native';

type SubmitButtonProps = {
	title: string;
	onPress: () => void;
	disabled?: boolean;
};

export function SubmitButton({ title, onPress, disabled = false }: SubmitButtonProps) {
	return (
		<Pressable
			onPress={onPress}
			disabled={disabled}
			style={({ pressed }) => [styles.button, pressed && !disabled && styles.buttonPressed, disabled && styles.buttonDisabled]}>
			<Text style={styles.text}>{title}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		backgroundColor: '#1A73E8',
		borderRadius: 14,
		paddingVertical: 14,
	},
	buttonPressed: {
		opacity: 0.9,
		transform: [{ scale: 0.99 }],
	},
	buttonDisabled: {
		backgroundColor: '#8AAFE2',
	},
	text: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '700',
		letterSpacing: 0.2,
	},
});
