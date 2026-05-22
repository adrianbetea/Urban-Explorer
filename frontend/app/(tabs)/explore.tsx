import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FeedList } from '@/components/explore/FeedList';
import { ExplorePost } from '@/components/explore/PostCard';
import { getPosts, votePost } from '@/services/api';

const FEED_PAGE_SIZE = 10;

type SortOption = 'recent' | 'hot' | 'oldest';

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'recent', label: 'Most Recent' },
  { key: 'hot', label: 'Most Liked' },
  { key: 'oldest', label: 'Oldest' },
];

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

export default function ExploreScreen() {
  const [posts, setPosts] = useState<ExplorePost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const canLoadMore = page < totalPages;

  const fetchPage = useCallback(async (targetPage: number, mode: 'replace' | 'append', sort: SortOption) => {
    const payload = await getPosts({ page: targetPage, limit: FEED_PAGE_SIZE, sort });
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
        await fetchPage(1, 'replace', sortBy);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load posts.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialFeed();
  }, [fetchPage, sortBy]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);

    try {
      await fetchPage(1, 'replace', sortBy);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh posts.';
      setError(message);
    } finally {
      setRefreshing(false);
    }
  }, [fetchPage, sortBy]);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || refreshing || loading || !canLoadMore) {
      return;
    }

    setLoadingMore(true);
    try {
      await fetchPage(page + 1, 'append', sortBy);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load more posts.';
      setError(message);
    } finally {
      setLoadingMore(false);
    }
  }, [canLoadMore, fetchPage, loading, loadingMore, page, refreshing, sortBy]);

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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {SORT_OPTIONS.map((option) => (
            <Pressable
              key={option.key}
              onPress={() => setSortBy(option.key)}
              style={[styles.filterChip, sortBy === option.key && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, sortBy === option.key && styles.filterTextActive]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
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
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingBottom: 4,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D8E3EE',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  filterChipActive: {
    backgroundColor: '#1A73E8',
    borderColor: '#1A73E8',
  },
  filterText: {
    color: '#526273',
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
});
