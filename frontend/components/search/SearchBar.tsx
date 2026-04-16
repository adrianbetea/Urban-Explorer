import { StyleSheet, TextInput, View } from 'react-native';

type SearchBarProps = {
	value: string;
	onChangeText: (value: string) => void;
};

export function SearchBar({ value, onChangeText }: SearchBarProps) {
	return (
		<View style={styles.container}>
			<TextInput
				value={value}
				onChangeText={onChangeText}
				placeholder="Search city"
				placeholderTextColor="#8D99A8"
				style={styles.input}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 16,
		marginTop: 10,
	},
	input: {
		backgroundColor: '#FFFFFF',
		borderColor: '#D8E3EE',
		borderRadius: 12,
		borderWidth: 1,
		color: '#0E2238',
		fontSize: 16,
		paddingHorizontal: 14,
		paddingVertical: 12,
	},
});
