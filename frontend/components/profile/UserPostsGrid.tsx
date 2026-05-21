import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ImageGallery } from '@/components/explore/ImageGallery';
import { InteractionBar } from '@/components/explore/InteractionBar';
import { PostDescription } from '@/components/explore/PostDescription';
import { PostHeader } from '@/components/explore/PostHeader';

export type UserPost = {
	postId: string;
	username?: string;
	description?: string;
	imageUrl?: string;
	imageUrls?: string[];
	location?: { city?: string };
	upvotes?: number;
	downvotes?: number;
};

type UserPostsGridProps = {
	posts: UserPost[];
	onEditPress: (postId: string) => void;
	onVote?: (postId: string, delta: 1 | -1) => void;
};

export function UserPostsGrid({ posts, onEditPress, onVote }: UserPostsGridProps) {
	return (
		<View style={styles.list}>
			{posts.map((post) => {
				const score = (post.upvotes || 0) - (post.downvotes || 0);
				return (
					<View key={post.postId} style={styles.card}>
						<View style={styles.cardHeader}>
							<PostHeader username={post.username || 'You'} city={post.location?.city || ''} />
							<Pressable onPress={() => onEditPress(post.postId)} style={styles.editButton}>
								<Text style={styles.editIcon}>✏️</Text>
							</Pressable>
						</View>
						<ImageGallery imageUrls={post.imageUrls?.length ? post.imageUrls : post.imageUrl ? [post.imageUrl] : []} />
						<PostDescription description={post.description || ''} />
						<InteractionBar
							score={score}
							onUpvote={() => onVote?.(post.postId, 1)}
							onDownvote={() => onVote?.(post.postId, -1)}
						/>
					</View>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	list: {
		gap: 16,
		paddingHorizontal: 16,
		paddingTop: 12,
	},
	card: {
		backgroundColor: '#FFFFFF',
		borderColor: '#D8E3EE',
		borderRadius: 16,
		borderWidth: 1,
		gap: 12,
		padding: 12,
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	editButton: {
		padding: 4,
	},
	editIcon: {
		fontSize: 18,
	},
});
