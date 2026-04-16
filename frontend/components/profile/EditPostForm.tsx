import { StyleSheet, Text, TextInput, View } from 'react-native';

type EditPostFormProps = {
	description: string;
	onDescriptionChange: (value: string) => void;
};

export function EditPostForm({ description, onDescriptionChange }: EditPostFormProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.label}>Edit description</Text>
			<TextInput
				value={description}
				onChangeText={onDescriptionChange}
				placeholder="Update spot details"
				placeholderTextColor="#8D99A8"
				style={styles.input}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 8,
	},
	label: {
		color: '#0E2238',
		fontSize: 13,
		fontWeight: '700',
	},
	input: {
		backgroundColor: '#F5F8FC',
		borderColor: '#D8E3EE',
		borderRadius: 10,
		borderWidth: 1,
		color: '#0E2238',
		minHeight: 80,
		paddingHorizontal: 12,
		paddingTop: 10,
		textAlignVertical: 'top',
	},
});
