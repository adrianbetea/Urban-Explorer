import { StyleSheet, Text } from 'react-native';
import { Callout, LatLng, Marker } from 'react-native-maps';

type CityMarkerProps = {
	city: string;
	coordinate: LatLng;
	onPress: () => void;
	selected: boolean;
};

export function CityMarker({ city, coordinate, onPress, selected }: CityMarkerProps) {
	return (
		<Marker coordinate={coordinate} onPress={onPress} pinColor={selected ? '#1A73E8' : '#5A6B7D'} title={city}>
			<Callout tooltip>
				<Text style={styles.callout}>{city}</Text>
			</Callout>
		</Marker>
	);
}

const styles = StyleSheet.create({
	callout: {
		backgroundColor: '#0E2238',
		borderRadius: 8,
		color: '#FFFFFF',
		fontSize: 12,
		fontWeight: '700',
		overflow: 'hidden',
		paddingHorizontal: 8,
		paddingVertical: 6,
	},
});
