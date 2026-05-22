import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { LatLng, Region } from 'react-native-maps';

import { CityMarker } from '@/components/map/CityMarker';
import { PostMarker } from '@/components/map/PostMarker';

type MapPost = {
	postId: string;
	description: string;
	imageUrl?: string;
	score: number;
	coordinate: LatLng;
};

type InteractiveMapProps = {
	activeCity: string;
	cities: string[];
	cityCoordinates?: Record<string, LatLng>;
	onCityPress: (city: string) => void;
	posts?: MapPost[];
	onPostPress?: (postId: string) => void;
};

const CITY_COORDINATES: Record<string, LatLng> = {
	Bucharest: { latitude: 44.4268, longitude: 26.1025 },
	Cluj: { latitude: 46.7712, longitude: 23.6236 },
	Timisoara: { latitude: 45.7489, longitude: 21.2087 },
};

const DEFAULT_REGION: Region = {
	latitude: 45.9432,
	latitudeDelta: 4.8,
	longitude: 24.9668,
	longitudeDelta: 4.8,
};

export function InteractiveMap({ activeCity, cities, cityCoordinates = {}, onCityPress, posts = [], onPostPress }: InteractiveMapProps) {
	const mapRef = useRef<MapView | null>(null);

	const allCoordinates = useMemo(() => {
		return {
			...CITY_COORDINATES,
			...cityCoordinates,
		};
	}, [cityCoordinates]);

	const cityPoints = useMemo(() => {
		return cities.map((city) => ({
			city,
			coordinate: allCoordinates[city] || DEFAULT_REGION,
		}));
	}, [allCoordinates, cities]);

	const focusRegion = useMemo<Region>(() => {
		const coordinate = allCoordinates[activeCity] || DEFAULT_REGION;

		return {
			latitude: coordinate.latitude,
			latitudeDelta: 0.55,
			longitude: coordinate.longitude,
			longitudeDelta: 0.55,
		};
	}, [activeCity, allCoordinates]);

	const postMarkers = useMemo(() => {
		if (posts.length > 0) {
			return posts.map((post) => ({
				coordinate: post.coordinate,
				label: post.score > 5 ? '🔥 Hot' : post.score > 0 ? '⭐ Popular' : '📍 New',
				postId: post.postId,
			}));
		}
		const coordinate = allCoordinates[activeCity] || DEFAULT_REGION;
		return [
			{
				coordinate: {
					latitude: coordinate.latitude + 0.03,
					longitude: coordinate.longitude + 0.02,
				},
				label: 'Top Spot',
				postId: '',
			},
			{
				coordinate: {
					latitude: coordinate.latitude - 0.025,
					longitude: coordinate.longitude - 0.018,
				},
				label: 'New',
				postId: '',
			},
		];
	}, [activeCity, allCoordinates, posts]);

	useEffect(() => {
		mapRef.current?.animateToRegion(focusRegion, 450);
	}, [focusRegion]);

	return (
		<View style={styles.mapContainer}>
			<MapView
				initialRegion={focusRegion}
				ref={mapRef}
				showsCompass={false}
				showsMyLocationButton={false}
				style={styles.map}
			>
				{cityPoints.map((point) => (
					<CityMarker
						city={point.city}
						coordinate={point.coordinate}
						key={point.city}
						onPress={() => onCityPress(point.city)}
						selected={point.city === activeCity}
					/>
				))}

				{postMarkers.map((marker) => (
					<PostMarker key={`${activeCity}-${marker.label}-${marker.postId}`} label={marker.label} coordinate={marker.coordinate} onPress={() => marker.postId && onPostPress?.(marker.postId)} />
				))}
			</MapView>
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
	map: {
		...StyleSheet.absoluteFillObject,
	},
});
