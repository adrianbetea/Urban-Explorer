import { Pressable, StyleSheet, Text, View } from 'react-native';

type UserPostsGridProps = {
	posts: string[];
	onPostPress: (postId: string) => void;
};

export function UserPostsGrid({ posts, onPostPress }: UserPostsGridProps) {
	return (
		<View style={styles.grid}>
			{posts.map((post) => (
				<Pressable key={post} onPress={() => onPostPress(post)} style={({ pressed }) => [styles.tile, pressed && styles.pressed]}>
					<Text style={styles.text}>{post}</Text>
				</Pressable>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
		paddingHorizontal: 16,
		paddingTop: 12,
	},
	tile: {
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderColor: '#D8E3EE',
		borderRadius: 10,
		borderWidth: 1,
		height: 92,
		justifyContent: 'center',
		width: '31%',
	},
	pressed: {
		opacity: 0.85,
	},
	text: {
		color: '#0E2238',
		fontSize: 12,
		textAlign: 'center',
	},
});
