import { Pressable, StyleSheet, Text, View } from 'react-native';

type ProfileShortcutProps = {
	initials: string;
	onPress: () => void;
};

export function ProfileShortcut({ initials, onPress }: ProfileShortcutProps) {
	return (
		<Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
			<View style={styles.avatar}>
				<Text style={styles.initials}>{initials}</Text>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		borderRadius: 22,
	},
	buttonPressed: {
		opacity: 0.85,
	},
	avatar: {
		alignItems: 'center',
		backgroundColor: '#0E2238',
		borderColor: '#FFFFFF',
		borderRadius: 22,
		borderWidth: 2,
		height: 44,
		justifyContent: 'center',
		width: 44,
	},
	initials: {
		color: '#FFFFFF',
		fontSize: 14,
		fontWeight: '700',
		letterSpacing: 0.6,
	},
});
