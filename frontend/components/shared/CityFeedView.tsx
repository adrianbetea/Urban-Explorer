import { StyleSheet, Text, View } from 'react-native';

import { FeedList } from '@/components/explore/FeedList';
import { ExplorePost } from '@/components/explore/PostCard';

type CityFeedViewProps = {
	cityName: string;
	posts: ExplorePost[];
	onVote: (postId: string, delta: 1 | -1) => void;
};

export function CityFeedView({ cityName, posts, onVote }: CityFeedViewProps) {
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>{cityName}</Text>
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
	title: {
		color: '#0E2238',
		fontSize: 30,
		fontWeight: '800',
	},
	subtitle: {
		color: '#526273',
		marginTop: 4,
	},
});
