import { Image, ScrollView, StyleSheet, View } from 'react-native';

type ImageGalleryProps = {
	imageUrls?: string[];
	imageCount?: number;
};


export function ImageGallery({ imageUrls = [], imageCount = 3 }: ImageGalleryProps) {
	const urls = imageUrls.filter(Boolean);
	const shouldRenderUrls = urls.length > 0;
	const fallbackCount = shouldRenderUrls ? 0 : imageCount;

	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
			{shouldRenderUrls
				? urls.map((uri, idx) => (
					<Image key={`image-${idx}`} source={{ uri }} style={styles.image} resizeMode="cover" />
				))
				: Array.from({ length: fallbackCount }).map((_, idx) => (
					<View key={`image-${idx}`} style={[styles.imageMock, idx % 2 === 0 ? styles.imageDark : styles.imageLight]} />
				))}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	content: {
		gap: 10,
	},
	image: {
		borderRadius: 12,
		height: 180,
		width: 260,
	},
	imageMock: {
		borderRadius: 12,
		height: 180,
		width: 260,
	},
	imageDark: {
		backgroundColor: '#A9C3DE',
	},
	imageLight: {
		backgroundColor: '#C5D9EE',
	},
});

