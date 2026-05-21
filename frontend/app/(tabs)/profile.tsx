import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';

import { PostOptionsModal } from '@/components/profile/PostOptionsModal';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { UserPostsGrid, UserPost } from '@/components/profile/UserPostsGrid';
import { getPostsByUser } from '@/services/api';
import { getSession } from '@/services/session';

type BackendPost = {
	postId?: string;
	description?: string;
	imageUrl?: string;
	imageUrls?: string[];
	location?: {
		city?: string;
	};
	upvotes?: number;
	downvotes?: number;
};

export default function ProfileScreen() {
	const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
	const [editedDescription, setEditedDescription] = useState('Great urban viewpoint near old station.');
	const [userPosts, setUserPosts] = useState<BackendPost[]>([]);

	const session = getSession();
	const uid = session.uid || process.env.EXPO_PUBLIC_TEST_UID || '';

	useEffect(() => {
		const loadUserPosts = async () => {
			if (!uid) {
				setUserPosts([]);
				return;
			}

			try {
				const payload = await getPostsByUser(uid);
				setUserPosts(payload?.data || []);
			} catch {
				setUserPosts([]);
			}
		};

		loadUserPosts();
	}, [uid]);

	const postTiles = useMemo(() => {
		return userPosts.map((post, index) => ({
			postId: post.postId || String(index),
			username: session.user?.username || session.user?.email || 'Explorer',
			description: post.description,
			imageUrl: post.imageUrl,
			imageUrls: post.imageUrls,
			location: post.location,
			upvotes: post.upvotes,
			downvotes: post.downvotes,
		}));
	}, [userPosts, session.user]);

	const discoveryScore = useMemo(() => {
		return userPosts.reduce((acc, post) => acc + (post.upvotes || 0) - (post.downvotes || 0), 0);
	}, [userPosts]);

	const handleEditPress = (postId: string) => {
		const post = userPosts.find((p) => p.postId === postId);
		setSelectedPostId(postId);
		setEditedDescription(post?.description || '');
	};

	const handleSave = () => {
		Alert.alert('Saved', 'Description updated.');
		setSelectedPostId(null);
	};

	const closeAndDelete = () => {
		Alert.alert('Post removed', 'Delete logic will be connected to backend in the next step.');
		setSelectedPostId(null);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
				<ProfileHeader
					username={session.user?.username || session.user?.email || 'Explorer'}
					score={discoveryScore}
					onSettingsPress={() => router.push('/profile/settings')}
				/>

				<Text style={styles.sectionTitle}>Your discoveries</Text>
				<UserPostsGrid posts={postTiles} onEditPress={handleEditPress} />
			</ScrollView>

			<PostOptionsModal
				visible={Boolean(selectedPostId)}
				description={editedDescription}
				onDescriptionChange={setEditedDescription}
				onSave={handleSave}
				onDeletePress={closeAndDelete}
				onClose={() => setSelectedPostId(null)}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		backgroundColor: '#F4F8FD',
		flex: 1,
	},
	content: {
		paddingBottom: 28,
	},
	sectionTitle: {
		color: '#24384E',
		fontSize: 13,
		fontWeight: '700',
		marginTop: 14,
		paddingHorizontal: 16,
	},
});
