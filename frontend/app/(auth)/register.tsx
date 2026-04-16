import { router } from 'expo-router';
import { useState } from 'react';
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { AppLogo } from '@/components/auth/AppLogo';
import { AuthForm } from '@/components/auth/AuthForm';
import { ToggleAuthMode } from '@/components/auth/ToggleAuthMode';
import { auth } from '@/firebaseConfig';
import { oauthSignIn, syncUserProfile, verifyAuthToken } from '@/services/api';
import { setSession } from '@/services/session';

export default function RegisterScreen() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleRegister = async () => {
		try {
			setIsSubmitting(true);
			const trimmedEmail = email.trim();
			const finalUsername = username.trim() || trimmedEmail.split('@')[0] || 'explorer';

			const credential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
			await updateProfile(credential.user, { displayName: finalUsername });
			const idToken = await credential.user.getIdToken();
			const verification = await verifyAuthToken(idToken);

			await syncUserProfile({
				uid: credential.user.uid,
				email: credential.user.email || trimmedEmail,
				username: finalUsername,
				avatarUrl: credential.user.photoURL || '',
			});

			setSession({
				idToken,
				uid: credential.user.uid,
				user: verification?.user || null,
			});

			router.replace('/(tabs)/home');
		} catch (error) {
			let message = error instanceof Error ? error.message : 'Register failed.';
			if (message.includes('auth/configuration-not-found')) {
				message =
					'Firebase Email/Password provider is not enabled or Auth configuration is missing for this project. Enable Email/Password in Firebase Console > Authentication > Sign-in method.';
			}
			Alert.alert('Register failed', message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleGoogleAuth = async () => {
		const idToken = process.env.EXPO_PUBLIC_GOOGLE_ID_TOKEN;
		if (!idToken) {
			Alert.alert('Missing token', 'Set EXPO_PUBLIC_GOOGLE_ID_TOKEN in frontend .env for backend OAuth testing.');
			return;
		}

		try {
			const result = await oauthSignIn('google', idToken);
			setSession({
				idToken,
				uid: result?.decodedToken?.uid || result?.user?.uid || null,
				user: result?.user || null,
			});
			router.replace('/(tabs)/home');
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Google OAuth failed.';
			Alert.alert('Google OAuth failed', message);
		}
	};

	const handleAppleAuth = async () => {
		const idToken = process.env.EXPO_PUBLIC_APPLE_ID_TOKEN;
		if (!idToken) {
			Alert.alert('Missing token', 'Set EXPO_PUBLIC_APPLE_ID_TOKEN in frontend .env for backend OAuth testing.');
			return;
		}

		try {
			const result = await oauthSignIn('apple', idToken);
			setSession({
				idToken,
				uid: result?.decodedToken?.uid || result?.user?.uid || null,
				user: result?.user || null,
			});
			router.replace('/(tabs)/home');
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Apple OAuth failed.';
			Alert.alert('Apple OAuth failed', message);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.backgroundOrbTop} />
			<View style={styles.backgroundOrbBottom} />

			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
				<ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
					<AppLogo size={130} />

					<View style={styles.titleWrap}>
						<Text style={styles.title}>Create account</Text>
						<Text style={styles.subtitle}>Join Urban Explorer and share your discoveries.</Text>
					</View>

					<View style={styles.card}>
						<AuthForm
							mode="register"
							username={username}
							email={email}
							password={password}
							onUsernameChange={setUsername}
							onEmailChange={setEmail}
							onPasswordChange={setPassword}
							onSubmit={handleRegister}
							onGooglePress={handleGoogleAuth}
							onApplePress={handleAppleAuth}
						/>
						{isSubmitting ? <Text style={styles.loadingText}>Creating account...</Text> : null}

						<ToggleAuthMode
							questionText="Already have an account?"
							linkText="Log in"
							onPress={() => router.push('/(auth)/login')}
						/>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		backgroundColor: '#F2F8FF',
		flex: 1,
	},
	backgroundOrbTop: {
		backgroundColor: '#CFE7FF',
		borderRadius: 260,
		height: 300,
		position: 'absolute',
		right: -120,
		top: -90,
		width: 300,
	},
	backgroundOrbBottom: {
		backgroundColor: '#DDF2EA',
		borderRadius: 220,
		bottom: -80,
		height: 240,
		left: -120,
		position: 'absolute',
		width: 240,
	},
	container: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: 'center',
		paddingHorizontal: 22,
		paddingVertical: 28,
	},
	titleWrap: {
		marginBottom: 18,
		marginTop: 10,
	},
	title: {
		color: '#0E2238',
		fontSize: 30,
		fontWeight: '800',
		letterSpacing: 0.2,
		textAlign: 'center',
	},
	subtitle: {
		color: '#526273',
		fontSize: 15,
		lineHeight: 22,
		marginTop: 6,
		textAlign: 'center',
	},
	card: {
		backgroundColor: '#FFFFFF',
		borderColor: '#D8E3EE',
		borderRadius: 22,
		borderWidth: 1,
		elevation: 1,
		gap: 18,
		padding: 18,
	},
	loadingText: {
		color: '#526273',
		fontSize: 13,
		textAlign: 'center',
	},
});
