import { useState } from 'react';
import { FlatList, Image, StyleSheet, useWindowDimensions, View } from 'react-native';

type ImageGalleryProps = {
	imageUrls?: string[];
	imageCount?: number;
};

export function ImageGallery({ imageUrls = [], imageCount = 1 }: ImageGalleryProps) {
	const urls = imageUrls.filter(Boolean);
	const shouldRenderUrls = urls.length > 0;
	const fallbackCount = shouldRenderUrls ? 0 : imageCount;
	const [activeIndex, setActiveIndex] = useState(0);
	const { width: screenWidth } = useWindowDimensions();
	const imageWidth = screenWidth - 56;

	const totalImages = shouldRenderUrls ? urls.length : fallbackCount;

	return (
		<View style={styles.container}>
			<FlatList
				data={shouldRenderUrls ? urls : Array.from({ length: fallbackCount })}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onMomentumScrollEnd={(e) => {
					const index = Math.round(e.nativeEvent.contentOffset.x / imageWidth);
					setActiveIndex(index);
				}}
				snapToInterval={imageWidth}
				decelerationRate="fast"
				keyExtractor={(_, idx) => `img-${idx}`}
				renderItem={({ item, index }) =>
					shouldRenderUrls ? (
						<Image source={{ uri: item as string }} style={[styles.image, { width: imageWidth }]} resizeMode="cover" />
					) : (
						<View style={[styles.imageMock, { width: imageWidth }, index % 2 === 0 ? styles.imageDark : styles.imageLight]} />
					)
				}
			/>
			{totalImages > 1 && (
				<View style={styles.dots}>
					{Array.from({ length: totalImages }).map((_, idx) => (
						<View key={`dot-${idx}`} style={[styles.dot, idx === activeIndex && styles.dotActive]} />
					))}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 12,
		overflow: 'hidden',
	},
	image: {
		borderRadius: 12,
		height: 220,
		overflow: 'hidden',
	},
	imageMock: {
		borderRadius: 12,
		height: 220,
	},
	imageDark: {
		backgroundColor: '#A9C3DE',
	},
	imageLight: {
		backgroundColor: '#C5D9EE',
	},
	dots: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 6,
		justifyContent: 'center',
		marginTop: 8,
	},
	dot: {
		backgroundColor: '#C5D9EE',
		borderRadius: 4,
		height: 8,
		width: 8,
	},
	dotActive: {
		backgroundColor: '#1A73E8',
	},
});

