import { StyleSheet, Text, View } from 'react-native';

import { HorizontalFlatList } from '@/components/map/HorizontalFlatList';
import { PostHereButton } from '@/components/map/PostHereButton';

type CityBottomSheetProps = {
	cityName: string;
	previews: string[];
	onPostHere: () => void;
};

export function CityBottomSheet({ cityName, previews, onPostHere }: CityBottomSheetProps) {
	return (
		<View style={styles.sheet}>
			<Text style={styles.title}>{cityName}</Text>
			<Text style={styles.subtitle}>Top discoveries in this city</Text>
			<HorizontalFlatList items={previews} />
			<PostHereButton cityName={cityName} onPress={onPostHere} />
		</View>
	);
}

const styles = StyleSheet.create({
	sheet: {
		backgroundColor: '#FFFFFF',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		gap: 12,
		padding: 16,
	},
	title: {
		color: '#0E2238',
		fontSize: 24,
		fontWeight: '800',
	},
	subtitle: {
		color: '#526273',
		fontSize: 13,
	},
});
