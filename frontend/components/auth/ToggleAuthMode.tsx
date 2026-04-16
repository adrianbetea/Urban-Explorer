import { Pressable, StyleSheet, Text, View } from 'react-native';

type ToggleAuthModeProps = {
	questionText: string;
	linkText: string;
	onPress: () => void;
};

export function ToggleAuthMode({ questionText, linkText, onPress }: ToggleAuthModeProps) {
	return (
		<View style={styles.row}>
			<Text style={styles.question}>{questionText}</Text>
			<Pressable onPress={onPress} hitSlop={6}>
				<Text style={styles.link}>{linkText}</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 6,
		justifyContent: 'center',
	},
	question: {
		color: '#526273',
		fontSize: 14,
	},
	link: {
		color: '#1A73E8',
		fontSize: 14,
		fontWeight: '700',
	},
});
