import { StyleSheet, Text, TextInput, View } from 'react-native';

type UpdatePasswordInputProps = {
	currentPassword: string;
	newPassword: string;
	onCurrentPasswordChange: (value: string) => void;
	onNewPasswordChange: (value: string) => void;
};

export function UpdatePasswordInput({
	currentPassword,
	newPassword,
	onCurrentPasswordChange,
	onNewPasswordChange,
}: UpdatePasswordInputProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.label}>Password</Text>
			<TextInput
				value={currentPassword}
				onChangeText={onCurrentPasswordChange}
				placeholder="Current password"
				placeholderTextColor="#8D99A8"
				secureTextEntry
				style={styles.input}
			/>
			<TextInput
				value={newPassword}
				onChangeText={onNewPasswordChange}
				placeholder="New password"
				placeholderTextColor="#8D99A8"
				secureTextEntry
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
