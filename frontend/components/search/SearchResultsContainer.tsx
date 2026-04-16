import { Pressable, StyleSheet, Text, View } from 'react-native';

type SearchResultsContainerProps = {
	cities: string[];
	onCityPress: (city: string) => void;
};

export function SearchResultsContainer({ cities, onCityPress }: SearchResultsContainerProps) {
	if (!cities.length) {
		return (
			<View style={styles.container}>
				<Text style={styles.emptyText}>No city found. Try another query.</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{cities.map((city) => (
				<Pressable key={city} onPress={() => onCityPress(city)} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
					<Text style={styles.city}>{city}</Text>
					<Text style={styles.arrow}>View</Text>
				</Pressable>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 8,
		marginHorizontal: 16,
		marginTop: 14,
	},
	row: {
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderColor: '#D8E3EE',
		borderRadius: 12,
		borderWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 14,
		paddingVertical: 13,
	},
	pressed: {
		opacity: 0.85,
	},
	city: {
		color: '#0E2238',
		fontSize: 15,
		fontWeight: '600',
	},
	arrow: {
		color: '#1A73E8',
		fontSize: 13,
		fontWeight: '700',
	},
	emptyText: {
		color: '#526273',
		fontSize: 14,
		paddingVertical: 10,
	},
});
