import { ScrollView, StyleSheet, View } from 'react-native';

type ImageGalleryProps = {
	imageCount?: number;
};

export function ImageGallery({ imageCount = 3 }: ImageGalleryProps) {
	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
			{Array.from({ length: imageCount }).map((_, idx) => (
				<View key={`image-${idx}`} style={[styles.imageMock, idx % 2 === 0 ? styles.imageDark : styles.imageLight]} />
			))}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	content: {
		gap: 10,
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

