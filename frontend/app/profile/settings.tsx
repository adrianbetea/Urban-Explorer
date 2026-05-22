import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SaveSettingsButton } from '@/components/profile/SaveSettingsButton';
import { UpdatePasswordInput } from '@/components/profile/UpdatePasswordInput';
import { UpdateUsernameInput } from '@/components/profile/UpdateUsernameInput';
import { getSession } from '@/services/session';

export default function SettingsScreen() {
	const session = getSession();
	const [username, setUsername] = useState(session.user?.username || session.user?.email || '');
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');

	const handleSave = () => {
		Alert.alert('Saved', 'Profile settings sync will be connected next.');
		router.back();
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView contentContainerStyle={styles.content}>
				<Text style={styles.title}>Settings</Text>
				<Text style={styles.subtitle}>Update your account details.</Text>

				<View style={styles.card}>
					<UpdateUsernameInput value={username} onChangeText={setUsername} />
					<UpdatePasswordInput
						currentPassword={currentPassword}
						newPassword={newPassword}
						onCurrentPasswordChange={setCurrentPassword}
						onNewPasswordChange={setNewPassword}
					/>
					<SaveSettingsButton onPress={handleSave} />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		backgroundColor: '#F4F8FD',
		flex: 1,
	},
	content: {
		paddingHorizontal: 16,
		paddingTop: 14,
	},
	title: {
		color: '#0E2238',
		fontSize: 31,
		fontWeight: '800',
	},
	subtitle: {
		color: '#526273',
		marginTop: 4,
	},
	card: {
		backgroundColor: '#FFFFFF',
		borderColor: '#D8E3EE',
		borderRadius: 14,
		borderWidth: 1,
		gap: 14,
		marginTop: 14,
		padding: 12,
	},
});
