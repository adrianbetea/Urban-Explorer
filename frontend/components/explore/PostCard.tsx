import { StyleSheet, View } from 'react-native';

import { ImageGallery } from '@/components/explore/ImageGallery';
import { InteractionBar } from '@/components/explore/InteractionBar';
import { PostDescription } from '@/components/explore/PostDescription';
import { PostHeader } from '@/components/explore/PostHeader';

export type ExplorePost = {
	id: string;
	username: string;
	city: string;
	description: string;
	imageUrl?: string;
	imageUrls?: string[];
	score: number;
};

type PostCardProps = {
	post: ExplorePost;
	onVote: (postId: string, delta: 1 | -1) => void;
};

export function PostCard({ post, onVote }: PostCardProps) {
	const urls = post.imageUrls?.length ? post.imageUrls : post.imageUrl ? [post.imageUrl] : [];

	return (
		<View style={styles.card}>
			<PostHeader username={post.username} city={post.city} />
			<ImageGallery imageUrls={urls} />
			<PostDescription description={post.description} />
			<InteractionBar score={post.score} onUpvote={() => onVote(post.id, 1)} onDownvote={() => onVote(post.id, -1)} />
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#FFFFFF',
		borderColor: '#D8E3EE',
		borderRadius: 16,
		borderWidth: 1,
		gap: 12,
		padding: 12,
	},
});

