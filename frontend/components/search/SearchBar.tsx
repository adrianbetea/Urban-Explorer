import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

type SearchBarProps = {
	value: string;
	onChangeText: (value: string) => void;
	onSubmitEditing?: TextInputProps['onSubmitEditing'];
	placeholder?: string;
};

export function SearchBar({ value, onChangeText, onSubmitEditing, placeholder = 'Search city' }: SearchBarProps) {
	return (
		<View style={styles.container}>
			<TextInput
				value={value}
				onChangeText={onChangeText}
				onSubmitEditing={onSubmitEditing}
				placeholder={placeholder}
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
