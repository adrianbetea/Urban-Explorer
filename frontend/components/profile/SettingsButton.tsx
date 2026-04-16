import { Pressable, StyleSheet, Text } from 'react-native';

type SettingsButtonProps = {
	onPress: () => void;
};

export function SettingsButton({ onPress }: SettingsButtonProps) {
	return (
		<Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
			<Text style={styles.text}>Settings</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: '#FFFFFF',
		borderColor: '#D8E3EE',
		borderRadius: 999,
		borderWidth: 1,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	pressed: {
		opacity: 0.85,
	},
	text: {
		color: '#0E2238',
		fontSize: 12,
		fontWeight: '700',
	},
});
