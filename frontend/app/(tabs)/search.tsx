import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

import { SearchBar } from '@/components/search/SearchBar';
import { SearchResultsContainer } from '@/components/search/SearchResultsContainer';
import { TrendingCitiesList } from '@/components/search/TrendingCitiesList';
import { getPosts } from '@/services/api';

const FALLBACK_CITIES = ['Bucharest', 'Cluj-Napoca', 'Timisoara', 'Iasi', 'Brasov', 'Constanta'];

export default function SearchScreen() {
	const [query, setQuery] = useState('');
	const [cities, setCities] = useState<string[]>(FALLBACK_CITIES);

	useEffect(() => {
		const loadCities = async () => {
			try {
				const payload = await getPosts({ page: 1, limit: 50 });
				const citySet = new Set<string>();

				(payload?.data || []).forEach((item: { location?: { city?: string }; city?: string }) => {
					const city = item.location?.city || item.city;
					if (city) {
						citySet.add(city);
					}
				});

				if (citySet.size) {
					setCities(Array.from(citySet));
				}
			} catch {
				setCities(FALLBACK_CITIES);
			}
		};

		loadCities();
	}, []);

	const filteredCities = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) {
			return cities;
		}
		return cities.filter((city) => city.toLowerCase().includes(q));
	}, [cities, query]);

	const goToCityFeed = (city: string) => {
		router.push({ pathname: '/city-feed', params: { city } });
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<Text style={styles.title}>Search</Text>
			<Text style={styles.subtitle}>Find discoveries by city.</Text>

			<SearchBar value={query} onChangeText={setQuery} />

			<Text style={styles.sectionTitle}>Trending Cities</Text>
			<TrendingCitiesList cities={cities.slice(0, 4)} onCityPress={goToCityFeed} />

			<Text style={styles.sectionTitle}>Results</Text>
			<SearchResultsContainer cities={filteredCities} onCityPress={goToCityFeed} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		backgroundColor: '#F4F8FD',
		flex: 1,
	},
	title: {
		color: '#0E2238',
		fontSize: 31,
		fontWeight: '800',
		paddingHorizontal: 16,
		paddingTop: 12,
	},
	subtitle: {
		color: '#526273',
		fontSize: 14,
		paddingHorizontal: 16,
		paddingTop: 2,
	},
	sectionTitle: {
		color: '#24384E',
		fontSize: 13,
		fontWeight: '700',
		marginTop: 14,
		paddingHorizontal: 16,
	},
});
