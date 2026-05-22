import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type MapPost = {
	postId: string;
	description: string;
	imageUrl?: string;
	score: number;
};

type HorizontalFlatListProps = {
	posts: MapPost[];
	onPostPress?: (postId: string) => void;
};

export function HorizontalFlatList({ posts, onPostPress }: HorizontalFlatListProps) {
	if (posts.length === 0) {
		return null;
	}

	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
			{posts.map((post) => (
				<Pressable
					key={post.postId}
					style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
					onPress={() => onPostPress?.(post.postId)}
				>
					{post.imageUrl ? (
						<Image source={{ uri: post.imageUrl }} style={styles.image} />
					) : (
						<View style={styles.imageMock} />
					)}
					<Text numberOfLines={2} style={styles.text}>
						{post.description}
					</Text>
					<Text style={styles.score}>🔥 {post.score}</Text>
				</Pressable>
			))}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	content: {
		gap: 10,
	},
	card: {
		backgroundColor: '#FFFFFF',
		borderColor: '#D8E3EE',
		borderRadius: 12,
		borderWidth: 1,
		padding: 8,
		width: 150,
	},
	cardPressed: {
		opacity: 0.85,
	},
	image: {
		borderRadius: 8,
		height: 66,
		width: '100%',
	},
	imageMock: {
		backgroundColor: '#CADBEE',
		borderRadius: 8,
		height: 66,
	},
	text: {
		color: '#0E2238',
		fontSize: 12,
		marginTop: 8,
	},
	score: {
		color: '#5A6F85',
		fontSize: 11,
		marginTop: 4,
	},
});
