import { StyleSheet, View } from 'react-native';

import { ExploreContainer } from '@/components/home/ExploreContainer';
import { MapContainer } from '@/components/home/MapContainer';
import { SearchContainer } from '@/components/home/SearchContainer';

type DashboardGridProps = {
	onExplorePress: () => void;
	onMapPress: () => void;
	onSearchPress: () => void;
};

export function DashboardGrid({ onExplorePress, onMapPress, onSearchPress }: DashboardGridProps) {
	return (
		<View style={styles.container}>
			<ExploreContainer onPress={onExplorePress} />
			<View style={styles.row}>
				<MapContainer onPress={onMapPress} />
				<SearchContainer onPress={onSearchPress} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 12,
	},
	row: {
		flexDirection: 'row',
		gap: 12,
	},
});
