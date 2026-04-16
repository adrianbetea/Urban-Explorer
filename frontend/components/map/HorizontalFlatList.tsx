import { ScrollView, StyleSheet, Text, View } from 'react-native';

type HorizontalFlatListProps = {
	items: string[];
};

export function HorizontalFlatList({ items }: HorizontalFlatListProps) {
	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
			{items.map((item) => (
				<View key={item} style={styles.card}>
					<View style={styles.imageMock} />
					<Text numberOfLines={2} style={styles.text}>
						{item}
					</Text>
				</View>
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
});
