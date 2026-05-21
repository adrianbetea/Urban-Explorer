import { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { FeedList } from '@/components/explore/FeedList';
import { ExplorePost } from '@/components/explore/PostCard';
import { getPosts, votePost } from '@/services/api';

const FEED_PAGE_SIZE = 10;

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
};

function toExplorePost(post: BackendPost): ExplorePost {
  const upvotes = post.upvotes || 0;
  const downvotes = post.downvotes || 0;

  return {
    id: post.postId || post.id || `${Date.now()}-${Math.random()}`,
    username: post.username || 'Explorer',
    city: post.location?.city || post.city || 'Unknown Location',
    description: post.description || '',
    imageUrl: post.imageUrl,
    imageUrls: post.imageUrls,
    score: post.score ?? upvotes - downvotes,
  };
}

export default function ExploreScreen() {
  const [posts, setPosts] = useState<ExplorePost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canLoadMore = page < totalPages;

  const fetchPage = useCallback(async (targetPage: number, mode: 'replace' | 'append') => {
    const payload = await getPosts({ page: targetPage, limit: FEED_PAGE_SIZE });
    const mappedPosts = (payload?.data || []).map((item: BackendPost) => toExplorePost(item));

    setPosts((prev) => (mode === 'replace' ? mappedPosts : [...prev, ...mappedPosts]));
    setPage(payload?.page || targetPage);
    setTotalPages(payload?.totalPages || 1);
  }, []);

  useEffect(() => {
    const loadInitialFeed = async () => {
      setLoading(true);
      setError(null);

      try {
        await fetchPage(1, 'replace');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load posts.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialFeed();
  }, [fetchPage]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    try {
      await fetchPage(1, 'replace');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh posts.';
      setError(message);
    } finally {
      setRefreshing(false);
    }
  }, [fetchPage]);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || refreshing || loading || !canLoadMore) {
      return;
    }

    setLoadingMore(true);
    try {
      await fetchPage(page + 1, 'append');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load more posts.';
      setError(message);
    } finally {
      setLoadingMore(false);
    }
  }, [canLoadMore, fetchPage, loading, loadingMore, page, refreshing]);

  const handleVote = useCallback(async (postId: string, delta: 1 | -1) => {
    const previousPosts = posts;
    setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, score: post.score + delta } : post)));

    try {
      const result = await votePost(postId, delta);
      const nextScore = result?.data?.score;

      if (typeof nextScore === 'number') {
        setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, score: nextScore } : post)));
      }
    } catch (err) {
      setPosts(previousPosts);
      const message = err instanceof Error ? err.message : 'Failed to submit vote.';
      setError(message);
    }
  }, [posts]);

  const emptyMessage = useMemo(() => {
    if (loading) {
      return 'Loading posts...';
    }
    if (error) {
      return `Could not load feed: ${error}`;
    }
    return 'No posts available yet.';
  }, [error, loading]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Discover hidden spots shared by the community.</Text>
      </View>

      <FeedList
        posts={posts}
        onVote={handleVote}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        loadingMore={loadingMore}
        emptyMessage={emptyMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F4F8FD',
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  title: {
    color: '#0E2238',
    fontSize: 31,
    fontWeight: '800',
  },
  subtitle: {
    color: '#526273',
    fontSize: 14,
    marginTop: 4,
  },
});
