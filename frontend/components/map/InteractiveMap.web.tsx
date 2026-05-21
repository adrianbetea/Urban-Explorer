import { StyleSheet, View, Text } from 'react-native';

type InteractiveMapProps = {
	activeCity: string;
	cities: string[];
	cityCoordinates?: Record<string, { latitude: number; longitude: number }>;
	onCityPress: (city: string) => void;
};

export function InteractiveMap({ activeCity, cities, onCityPress }: InteractiveMapProps) {
	return (
		<View style={styles.mapContainer}>
			<View style={styles.placeholder}>
				<Text style={styles.title}>Map View</Text>
				<Text style={styles.subtitle}>Maps are only available on native devices.</Text>
				<View style={styles.cityList}>
					{cities.map((city) => (
						<Text
							key={city}
							onPress={() => onCityPress(city)}
							style={[styles.cityItem, city === activeCity && styles.activeCity]}
						>
							{city}
						</Text>
					))}
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	mapContainer: {
		borderRadius: 20,
		flex: 1,
		marginHorizontal: 16,
		marginTop: 12,
		overflow: 'hidden',
	},
	placeholder: {
		alignItems: 'center',
		backgroundColor: '#e0e0e0',
		flex: 1,
		justifyContent: 'center',
		padding: 24,
	},
	title: {
		fontSize: 20,
		fontWeight: '700',
		marginBottom: 8,
	},
	subtitle: {
		color: '#666',
		fontSize: 14,
		marginBottom: 16,
	},
	cityList: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
		justifyContent: 'center',
	},
	cityItem: {
		backgroundColor: '#fff',
		borderRadius: 12,
		fontSize: 14,
		paddingHorizontal: 12,
		paddingVertical: 6,
	},
	activeCity: {
		backgroundColor: '#4A90D9',
		color: '#fff',
	},
});
