import { Pressable, StyleSheet, Text, View } from 'react-native';

type SearchContainerProps = {
	onPress: () => void;
};

export function SearchContainer({ onPress }: SearchContainerProps) {
	return (
		<Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
			<View style={styles.icon} />
			<Text style={styles.title}>Search</Text>
			<Text style={styles.description}>Find cities and browse discoveries by place.</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#EAF5ED',
		borderColor: '#D2E8D9',
		borderRadius: 16,
		borderWidth: 1,
		flex: 1,
		gap: 6,
		minHeight: 130,
		padding: 14,
	},
	pressed: {
		opacity: 0.85,
	},
	icon: {
		alignSelf: 'flex-start',
		backgroundColor: '#1B8A5A',
		borderRadius: 999,
		height: 12,
		width: 12,
	},
	title: {
		color: '#0E2238',
		fontSize: 20,
		fontWeight: '800',
		marginTop: 6,
	},
	description: {
		color: '#4D6277',
		fontSize: 13,
		lineHeight: 18,
	},
});
