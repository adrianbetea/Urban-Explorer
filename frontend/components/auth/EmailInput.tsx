import { StyleSheet, Text, TextInput, View } from 'react-native';

type EmailInputProps = {
	value: string;
	onChangeText: (value: string) => void;
};

export function EmailInput({ value, onChangeText }: EmailInputProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.label}>Email</Text>
			<TextInput
				value={value}
				onChangeText={onChangeText}
				placeholder="name@example.com"
				placeholderTextColor="#8D99A8"
				keyboardType="email-address"
				autoCapitalize="none"
				autoCorrect={false}
				textContentType="emailAddress"
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
		fontSize: 14,
		fontWeight: '600',
		letterSpacing: 0.2,
	},
	input: {
		backgroundColor: '#F5F8FC',
		borderColor: '#D8E3EE',
		borderRadius: 12,
		borderWidth: 1,
		color: '#0E2238',
		fontSize: 16,
		paddingHorizontal: 14,
		paddingVertical: 12,
	},
});
