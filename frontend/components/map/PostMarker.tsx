import { StyleSheet, Text, View } from 'react-native';
import { LatLng, Marker } from 'react-native-maps';

type PostMarkerProps = {
	coordinate: LatLng;
	label: string;
	onPress: () => void;
};

export function PostMarker({ coordinate, label, onPress }: PostMarkerProps) {
	return (
		<Marker coordinate={coordinate} onPress={onPress} tracksViewChanges={false}>
			<View style={styles.marker}>
				<Text style={styles.text}>{label}</Text>
			</View>
		</Marker>
	);
}

const styles = StyleSheet.create({
	marker: {
		backgroundColor: '#FFFFFF',
		borderColor: '#C5D9EE',
		borderRadius: 999,
		borderWidth: 1,
		paddingHorizontal: 9,
		paddingVertical: 5,
	},
	text: {
		color: '#0E2238',
		fontSize: 12,
		fontWeight: '600',
	},
});
