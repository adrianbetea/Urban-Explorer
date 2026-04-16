import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

type TrendingCitiesListProps = {
	cities: string[];
	onCityPress: (city: string) => void;
};

export function TrendingCitiesList({ cities, onCityPress }: TrendingCitiesListProps) {
	return (
		<ScrollView horizontal contentContainerStyle={styles.content} showsHorizontalScrollIndicator={false}>
			{cities.map((city) => (
				<Pressable key={city} onPress={() => onCityPress(city)} style={({ pressed }) => [styles.chip, pressed && styles.pressed]}>
					<Text style={styles.text}>{city}</Text>
				</Pressable>
			))}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	content: {
		gap: 8,
		paddingHorizontal: 16,
		paddingTop: 10,
	},
	chip: {
		backgroundColor: '#E6F4FE',
		borderRadius: 999,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	pressed: {
		opacity: 0.85,
	},
	text: {
		color: '#0E2238',
		fontSize: 13,
		fontWeight: '700',
	},
});
