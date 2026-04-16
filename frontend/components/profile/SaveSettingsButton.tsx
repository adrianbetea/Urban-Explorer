import { Pressable, StyleSheet, Text } from 'react-native';

type SaveSettingsButtonProps = {
	onPress: () => void;
};

export function SaveSettingsButton({ onPress }: SaveSettingsButtonProps) {
	return (
		<Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
			<Text style={styles.text}>Save settings</Text>
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
