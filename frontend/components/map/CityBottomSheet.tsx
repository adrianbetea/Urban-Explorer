import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HorizontalFlatList } from '@/components/map/HorizontalFlatList';
import { PostHereButton } from '@/components/map/PostHereButton';

type MapPost = {
	postId: string;
	description: string;
	imageUrl?: string;
	score: number;
};

type CityBottomSheetProps = {
	cityName: string;
	posts: MapPost[];
	onPostHere: () => void;
	onViewAll?: () => void;
	onPostPress?: (postId: string) => void;
};

export function CityBottomSheet({ cityName, posts, onPostHere, onViewAll, onPostPress }: CityBottomSheetProps) {
	return (
		<View style={styles.sheet}>
			<View style={styles.headerRow}>
				<Text style={styles.title}>{cityName}</Text>
				{onViewAll && (
					<Pressable onPress={onViewAll} style={({ pressed }) => [styles.viewAllButton, pressed && styles.viewAllPressed]}>
						<Text style={styles.viewAllText}>View All</Text>
					</Pressable>
				)}
			</View>
			<Text style={styles.subtitle}>
				{posts.length > 0 ? 'Hottest spots in this city' : 'No posts yet. Be the first to explore!'}
			</Text>
			<HorizontalFlatList posts={posts} onPostPress={onPostPress} />
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
	headerRow: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
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
	viewAllButton: {
		backgroundColor: '#1A73E8',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 6,
	},
	viewAllPressed: {
		opacity: 0.85,
	},
	viewAllText: {
		color: '#FFFFFF',
		fontSize: 12,
		fontWeight: '700',
	},
});
