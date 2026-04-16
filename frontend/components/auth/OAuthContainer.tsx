import { Pressable, StyleSheet, Text, View } from 'react-native';

type OAuthContainerProps = {
	onGooglePress: () => void;
	onApplePress: () => void;
};

function OAuthButton({ label, onPress }: { label: string; onPress: () => void }) {
	return (
		<Pressable onPress={onPress} style={({ pressed }) => [styles.oauthButton, pressed && styles.oauthButtonPressed]}>
			<Text style={styles.oauthText}>{label}</Text>
		</Pressable>
	);
}

export function OAuthContainer({ onGooglePress, onApplePress }: OAuthContainerProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.caption}>or continue with</Text>
			<View style={styles.buttons}>
				<OAuthButton label="Google" onPress={onGooglePress} />
				<OAuthButton label="Apple" onPress={onApplePress} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 10,
	},
	caption: {
		color: '#526273',
		fontSize: 13,
		textAlign: 'center',
	},
	buttons: {
		flexDirection: 'row',
		gap: 10,
	},
	oauthButton: {
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderColor: '#D8E3EE',
		borderRadius: 12,
		borderWidth: 1,
		flex: 1,
		paddingVertical: 12,
	},
	oauthButtonPressed: {
		opacity: 0.85,
	},
	oauthText: {
		color: '#0E2238',
		fontSize: 14,
		fontWeight: '700',
	},
});
