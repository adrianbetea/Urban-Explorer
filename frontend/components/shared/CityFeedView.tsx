import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FeedList } from '@/components/explore/FeedList';
import { ExplorePost } from '@/components/explore/PostCard';

type CityFeedViewProps = {
	cityName: string;
	posts: ExplorePost[];
	onVote: (postId: string, delta: 1 | -1) => void;
	onSeeOnMap?: () => void;
};

export function CityFeedView({ cityName, posts, onVote, onSeeOnMap }: CityFeedViewProps) {
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<Text style={styles.title}>{cityName}</Text>
					{onSeeOnMap && (
						<Pressable onPress={onSeeOnMap} style={({ pressed }) => [styles.mapButton, pressed && styles.mapButtonPressed]}>
							<Text style={styles.mapButtonText}>See on Map</Text>
						</Pressable>
					)}
				</View>
				<Text style={styles.subtitle}>Top spots in this city</Text>
			</View>
			<FeedList posts={posts} onVote={onVote} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		paddingHorizontal: 16,
		paddingTop: 14,
	},
	headerRow: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	title: {
		color: '#0E2238',
		fontSize: 30,
		fontWeight: '800',
	},
	subtitle: {
		color: '#526273',
		marginTop: 4,
	},
	mapButton: {
		backgroundColor: '#1A73E8',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	mapButtonPressed: {
		opacity: 0.85,
	},
	mapButtonText: {
		color: '#FFFFFF',
		fontSize: 13,
		fontWeight: '700',
	},
});
