import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { CityBottomSheet } from '@/components/map/CityBottomSheet';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { getPostsByCity } from '@/services/api';

const CITY_PREVIEWS: Record<string, string[]> = {
	Bucharest: ['Industrial Hall', 'Graffiti Passage', 'Riverside Depot'],
	Cluj: ['Old Rail Roof', 'Factory Atrium', 'Underground Gallery'],
	Timisoara: ['Bridge Tunnel', 'Glass Warehouse', 'Brick Yard'],
};

export default function MapScreen() {
	const [activeCity, setActiveCity] = useState('Bucharest');
	const [previews, setPreviews] = useState<string[]>([]);

	useEffect(() => {
		const loadCityPosts = async () => {
			try {
				const payload = await getPostsByCity(activeCity);
				const descriptions = (payload?.data || [])
					.map((item: { description?: string; location?: { city?: string } }) => item.description || 'Untitled spot')
					.slice(0, 5);

				setPreviews(descriptions.length ? descriptions : CITY_PREVIEWS[activeCity] || []);
			} catch {
				setPreviews(CITY_PREVIEWS[activeCity] || []);
			}
		};

		loadCityPosts();
	}, [activeCity]);

	const cities = useMemo(() => {
		return Object.keys(CITY_PREVIEWS);
	}, []);

	useEffect(() => {
		if (!cities.includes(activeCity)) {
			setActiveCity(cities[0]);
		}
	}, [activeCity, cities]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.header}>
				<Text style={styles.title}>Map</Text>
				<Text style={styles.subtitle}>Tap a city marker to see local top posts.</Text>
			</View>

			<InteractiveMap
				cities={cities}
				onCityPress={setActiveCity}
			/>

			<CityBottomSheet
				cityName={activeCity}
				previews={previews}
				onPostHere={() => router.push('/create-post-modal')}
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
});
