import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { LatLng } from 'react-native-maps';

import { CityBottomSheet } from '@/components/map/CityBottomSheet';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { SearchBar } from '@/components/search/SearchBar';
import { getPlaceDetails, getPostsByCity, searchCitySuggestions } from '@/services/api';

export type MapPost = {
	postId: string;
	description: string;
	imageUrl?: string;
	score: number;
	coordinate: LatLng;
};

const CITY_PREVIEWS: Record<string, string[]> = {
	Bucharest: ['Industrial Hall', 'Graffiti Passage', 'Riverside Depot'],
	Cluj: ['Old Rail Roof', 'Factory Atrium', 'Underground Gallery'],
	Timisoara: ['Bridge Tunnel', 'Glass Warehouse', 'Brick Yard'],
};

type CitySuggestion = {
	description: string;
	mainText: string;
	placeId: string;
};

function normalizeCountryCode(rawValue: string | undefined) {
	const value = (rawValue || '').trim();
	return /^[a-zA-Z]{2}$/.test(value) ? value.toLowerCase() : '';
}

export default function MapScreen() {
	const params = useLocalSearchParams<{ city?: string }>();
	const [activeCity, setActiveCity] = useState('Bucharest');
	const [cityCoordinates, setCityCoordinates] = useState<Record<string, LatLng>>({});
	const [knownCities, setKnownCities] = useState<string[]>(Object.keys(CITY_PREVIEWS));
	const [mapQuery, setMapQuery] = useState('');
	const [mapSuggestions, setMapSuggestions] = useState<CitySuggestion[]>([]);
	const [previews, setPreviews] = useState<MapPost[]>([]);
	const countryCode = normalizeCountryCode(process.env.EXPO_PUBLIC_GOOGLE_PLACES_COUNTRY);

	useEffect(() => {
		if (params.city) {
			const city = params.city.trim();
			setActiveCity(city);
			setKnownCities((prev) => (prev.includes(city) ? prev : [city, ...prev]));
		}
	}, [params.city]);

	useEffect(() => {
		const loadCityPosts = async () => {
			try {
				const payload = await getPostsByCity(activeCity, { sort: 'hot' });
				const posts = (payload?.data || [])
					.filter((item: any) => item.location?.latitude && item.location?.longitude)
					.slice(0, 10)
					.map((item: any) => ({
						postId: item.postId || item.id || '',
						description: item.description || 'Untitled spot',
						imageUrl: item.imageUrl || (item.imageUrls && item.imageUrls[0]) || undefined,
						score: item.score ?? ((item.upvotes || 0) - (item.downvotes || 0)),
						coordinate: {
							latitude: Number(item.location.latitude),
							longitude: Number(item.location.longitude),
						},
					}));

				setPreviews(posts.length ? posts : []);
			} catch {
				setPreviews([]);
			}
		};

		loadCityPosts();
	}, [activeCity]);

	useEffect(() => {
		if (!knownCities.includes(activeCity)) {
			setKnownCities((previous) => [activeCity, ...previous]);
		}
	}, [activeCity, knownCities]);

	useEffect(() => {
		const trimmedQuery = mapQuery.trim();

		if (trimmedQuery.length < 2) {
			setMapSuggestions([]);
			return;
		}

		const timeoutId = setTimeout(async () => {
			try {
				const payload = await searchCitySuggestions(trimmedQuery, {
					country: countryCode,
					types: '(cities)',
				});

				const suggestions = (payload?.data || []).map((item: CitySuggestion & { secondaryText?: string }) => ({
					description: item.description || item.mainText || '',
					mainText: item.mainText || item.description || '',
					placeId: item.placeId,
				}));

				setMapSuggestions(suggestions.filter((item) => item.placeId && item.mainText));
			} catch {
				setMapSuggestions([]);
			}
		}, 320);

		return () => clearTimeout(timeoutId);
	}, [countryCode, mapQuery]);

	const cities = useMemo(() => {
		return Array.from(new Set(knownCities));
	}, [knownCities]);

	const selectCitySuggestion = async (suggestion: CitySuggestion) => {
		const cityName = suggestion.mainText.trim();

		setMapQuery(cityName);
		setMapSuggestions([]);
		setActiveCity(cityName);
		setKnownCities((previous) => (previous.includes(cityName) ? previous : [cityName, ...previous]));

		try {
			const payload = await getPlaceDetails(suggestion.placeId);
			const location = payload?.data?.location;

			if (location?.latitude && location?.longitude) {
				setCityCoordinates((previous) => ({
					...previous,
					[cityName]: {
						latitude: location.latitude,
						longitude: location.longitude,
					},
				}));
			}
		} catch {
			// Keep the city selected even if details fetch fails.
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.header}>
				<Text style={styles.title}>Map</Text>
				<Text style={styles.subtitle}>Tap a city marker to see local top posts.</Text>

				<SearchBar
					onChangeText={setMapQuery}
					onSubmitEditing={() => {
						if (mapSuggestions.length) {
							void selectCitySuggestion(mapSuggestions[0]);
						}
					}}
					placeholder="Search city on map"
					value={mapQuery}
				/>

				{mapSuggestions.length > 0 && (
					<View style={styles.suggestionsCard}>
						{mapSuggestions.slice(0, 5).map((suggestion) => (
							<Pressable key={suggestion.placeId} onPress={() => void selectCitySuggestion(suggestion)} style={({ pressed }) => [styles.suggestionRow, pressed && styles.suggestionPressed]}>
							<Text style={styles.suggestionMain}>{suggestion.description}</Text>
							</Pressable>
						))}
					</View>
				)}
			</View>

			<InteractiveMap
				activeCity={activeCity}
				cities={cities}
				cityCoordinates={cityCoordinates}
				onCityPress={setActiveCity}
				posts={previews}
				onPostPress={(postId) => router.push({ pathname: '/city-feed', params: { city: activeCity } })}
			/>

			<CityBottomSheet
				cityName={activeCity}
				posts={previews}
				onPostHere={() => router.push('/create-post-modal')}
				onViewAll={() => router.push({ pathname: '/city-feed', params: { city: activeCity } })}
				onPostPress={(postId) => router.push({ pathname: '/city-feed', params: { city: activeCity } })}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		backgroundColor: '#F4F8FD',
		flex: 1,
	},
	header: {
		paddingHorizontal: 16,
		paddingTop: 12,
		zIndex: 3,
	},
	title: {
		color: '#0E2238',
		fontSize: 31,
		fontWeight: '800',
	},
	subtitle: {
		color: '#526273',
		fontSize: 14,
		marginTop: 4,
	},
	suggestionsCard: {
		backgroundColor: '#FFFFFF',
		borderColor: '#D8E3EE',
		borderRadius: 12,
		borderWidth: 1,
		marginHorizontal: 16,
		marginTop: 6,
		overflow: 'hidden',
	},
	suggestionRow: {
		paddingHorizontal: 14,
		paddingVertical: 10,
	},
	suggestionPressed: {
		backgroundColor: '#F1F6FC',
	},
	suggestionMain: {
		color: '#0E2238',
		fontSize: 14,
		fontWeight: '700',
	},
	suggestionSecondary: {
		color: '#526273',
		fontSize: 12,
		marginTop: 2,
	},
});
