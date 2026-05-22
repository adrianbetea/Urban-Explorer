import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { ExplorePost } from '@/components/explore/PostCard';
import { CityFeedView } from '@/components/shared/CityFeedView';
import { getPostsByCity, votePost } from '@/services/api';

type BackendPost = {
	postId?: string;
	id?: string;
	username?: string;
	description?: string;
	imageUrl?: string;
	imageUrls?: string[];
	location?: {
		city?: string;
	};
	city?: string;
	upvotes?: number;
	downvotes?: number;
	score?: number;
	createdAt?: any;
};

function toExplorePost(post: BackendPost): ExplorePost {
	const upvotes = post.upvotes || 0;
	const downvotes = post.downvotes || 0;

	let createdAt: string | number | null = null;
	if (post.createdAt) {
		if (typeof post.createdAt === 'object' && '_seconds' in post.createdAt) {
			createdAt = post.createdAt._seconds * 1000;
		} else if (typeof post.createdAt === 'object' && 'seconds' in post.createdAt) {
			createdAt = post.createdAt.seconds * 1000;
		} else {
			createdAt = post.createdAt;
		}
	}

	return {
		id: post.postId || post.id || `${Date.now()}-${Math.random()}`,
		username: post.username || 'Explorer',
		city: post.location?.city || post.city || 'Unknown Location',
		description: post.description || '',
		imageUrl: post.imageUrl,
		imageUrls: post.imageUrls,
		score: post.score ?? upvotes - downvotes,
		createdAt,
	};
}

export default function CityFeedScreen() {
	const params = useLocalSearchParams<{ city?: string }>();
	const cityName = params.city ?? 'Bucharest';
	const [posts, setPosts] = useState<ExplorePost[]>([]);

	useEffect(() => {
		const loadPosts = async () => {
			try {
				const payload = await getPostsByCity(cityName);
				setPosts((payload?.data || []).map((item: BackendPost) => toExplorePost(item)));
			} catch {
				setPosts([]);
			}
		};

		loadPosts();
	}, [cityName]);

	const handleVote = async (postId: string, delta: 1 | -1) => {
		const previousPosts = posts;
		setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, score: post.score + delta } : post)));

		try {
			const result = await votePost(postId, delta);
			const nextScore = result?.data?.score;
			if (typeof nextScore === 'number') {
				setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, score: nextScore } : post)));
			}
		} catch {
			setPosts(previousPosts);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<CityFeedView
				cityName={cityName}
				posts={posts}
				onVote={handleVote}
				onSeeOnMap={() => router.push({ pathname: '/(tabs)/map', params: { city: cityName } })}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		backgroundColor: '#F4F8FD',
		flex: 1,
	},
});
