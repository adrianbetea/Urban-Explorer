import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type PasswordInputProps = {
	value: string;
	onChangeText: (value: string) => void;
	label?: string;
};

export function PasswordInput({ value, onChangeText, label = 'Password' }: PasswordInputProps) {
	const [isHidden, setIsHidden] = useState(true);

	return (
		<View style={styles.container}>
			<Text style={styles.label}>{label}</Text>
			<View style={styles.row}>
				<TextInput
					value={value}
					onChangeText={onChangeText}
					placeholder="Enter your password"
					placeholderTextColor="#8D99A8"
					secureTextEntry={isHidden}
					autoCapitalize="none"
					autoCorrect={false}
					textContentType="password"
					style={styles.input}
				/>
				<Pressable onPress={() => setIsHidden((prev) => !prev)} hitSlop={8}>
					<Text style={styles.toggleText}>{isHidden ? 'Show' : 'Hide'}</Text>
				</Pressable>
			</View>
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
	row: {
		alignItems: 'center',
		backgroundColor: '#F5F8FC',
		borderColor: '#D8E3EE',
		borderRadius: 12,
		borderWidth: 1,
		flexDirection: 'row',
		paddingRight: 14,
	},
	input: {
		color: '#0E2238',
		flex: 1,
		fontSize: 16,
		paddingHorizontal: 14,
		paddingVertical: 12,
	},
	toggleText: {
		color: '#1A73E8',
		fontSize: 13,
		fontWeight: '700',
	},
});
