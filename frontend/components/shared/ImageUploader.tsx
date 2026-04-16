import { Pressable, StyleSheet, Text, View } from 'react-native';

type ImageUploaderProps = {
	onPickImage: () => void;
};

export function ImageUploader({ onPickImage }: ImageUploaderProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.label}>Upload photos</Text>
			<Pressable onPress={onPickImage} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
				<Text style={styles.buttonText}>Choose from gallery</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 8,
	},
	label: {
		color: '#0E2238',
		fontSize: 14,
		fontWeight: '600',
	},
	button: {
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderColor: '#D8E3EE',
		borderRadius: 12,
		borderWidth: 1,
		paddingVertical: 12,
	},
	pressed: {
		opacity: 0.85,
	},
	buttonText: {
		color: '#1A73E8',
		fontWeight: '700',
	},
});
