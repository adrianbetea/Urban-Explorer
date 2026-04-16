import { StyleSheet, Text, TextInput, View } from 'react-native';

type UpdateUsernameInputProps = {
	value: string;
	onChangeText: (value: string) => void;
};

export function UpdateUsernameInput({ value, onChangeText }: UpdateUsernameInputProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.label}>Username</Text>
			<TextInput
				value={value}
				onChangeText={onChangeText}
				placeholder="Your display name"
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
		borderRadius: 12,
		borderWidth: 1,
		color: '#0E2238',
		paddingHorizontal: 12,
		paddingVertical: 12,
	},
});
