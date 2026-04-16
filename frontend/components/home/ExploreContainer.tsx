import { Pressable, StyleSheet, Text, View } from 'react-native';

type ExploreContainerProps = {
	onPress: () => void;
};

export function ExploreContainer({ onPress }: ExploreContainerProps) {
	return (
		<Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
			<View style={styles.badge}>
				<Text style={styles.badgeText}>TRENDING</Text>
			</View>

			<Text style={styles.title}>Explore Feed</Text>
			<Text style={styles.description}>See the newest hidden gems and top-rated discoveries.</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#0E2238',
		borderRadius: 18,
		minHeight: 188,
		padding: 18,
	},
	pressed: {
		opacity: 0.92,
	},
	badge: {
		alignSelf: 'flex-start',
		backgroundColor: '#1A73E8',
		borderRadius: 999,
		paddingHorizontal: 10,
		paddingVertical: 5,
	},
	badgeText: {
		color: '#FFFFFF',
		fontSize: 11,
		fontWeight: '700',
		letterSpacing: 0.5,
	},
	title: {
		color: '#FFFFFF',
		fontSize: 24,
		fontWeight: '800',
		marginTop: 18,
	},
	description: {
		color: '#D6E1EE',
		fontSize: 14,
		lineHeight: 20,
		marginTop: 8,
	},
});
