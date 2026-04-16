import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { ExplorePost, PostCard } from '@/components/explore/PostCard';

type FeedListProps = {
	posts: ExplorePost[];
	onVote: (postId: string, delta: 1 | -1) => void;
	refreshing?: boolean;
	onRefresh?: () => void;
	onEndReached?: () => void;
	loadingMore?: boolean;
	emptyMessage?: string;
};

export function FeedList({
	posts,
	onVote,
	refreshing = false,
	onRefresh,
	onEndReached,
	loadingMore = false,
	emptyMessage = 'No posts yet.',
}: FeedListProps) {
	return (
		<FlatList
			data={posts}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => <PostCard post={item} onVote={onVote} />}
			contentContainerStyle={styles.content}
			ItemSeparatorComponent={() => <View style={styles.separator} />}
			showsVerticalScrollIndicator={false}
			refreshing={refreshing}
			onRefresh={onRefresh}
			onEndReached={onEndReached}
			onEndReachedThreshold={0.2}
			ListEmptyComponent={<Text style={styles.emptyText}>{emptyMessage}</Text>}
			ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#1A73E8" /> : null}
		/>
	);
}

const styles = StyleSheet.create({
	content: {
		padding: 16,
		paddingBottom: 36,
	},
	separator: {
		height: 12,
	},
	emptyText: {
		color: '#526273',
		fontSize: 14,
		paddingTop: 30,
		textAlign: 'center',
	},
});
