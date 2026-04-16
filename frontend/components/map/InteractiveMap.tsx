import { StyleSheet, View } from 'react-native';

import { CityMarker } from '@/components/map/CityMarker';
import { PostMarker } from '@/components/map/PostMarker';

type InteractiveMapProps = {
	cities: string[];
	onCityPress: (city: string) => void;
};

export function InteractiveMap({ cities, onCityPress }: InteractiveMapProps) {
	return (
		<View style={styles.map}>
			<View style={styles.cityRow}>
				{cities.map((city) => (
					<CityMarker key={city} city={city} onPress={() => onCityPress(city)} />
				))}
			</View>
			<View style={styles.postRow}>
				<PostMarker label="Top Spot" onPress={() => undefined} />
				<PostMarker label="New" onPress={() => undefined} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	map: {
		backgroundColor: '#DCEBFA',
		borderRadius: 20,
		flex: 1,
		marginHorizontal: 16,
		marginTop: 12,
		padding: 16,
	},
	cityRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
	postRow: {
		bottom: 18,
		flexDirection: 'row',
		gap: 8,
		position: 'absolute',
		right: 18,
	},
});
