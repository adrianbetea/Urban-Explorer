import { StyleSheet, View } from 'react-native';

import { EmailInput } from '@/components/auth/EmailInput';
import { OAuthContainer } from '@/components/auth/OAuthContainer';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { UsernameInput } from '@/components/auth/UsernameInput';

type AuthMode = 'login' | 'register';

type AuthFormProps = {
	mode: AuthMode;
	username?: string;
	email: string;
	password: string;
	onUsernameChange?: (value: string) => void;
	onEmailChange: (value: string) => void;
	onPasswordChange: (value: string) => void;
	onSubmit: () => void;
	onGooglePress: () => void;
	onApplePress: () => void;
};

export function AuthForm({
	mode,
	username = '',
	email,
	password,
	onUsernameChange,
	onEmailChange,
	onPasswordChange,
	onSubmit,
	onGooglePress,
	onApplePress,
}: AuthFormProps) {
	const submitLabel = mode === 'login' ? 'Log In' : 'Create Account';

	return (
		<View style={styles.container}>
			<View style={styles.formFields}>
				{mode === 'register' ? (
					<UsernameInput value={username} onChangeText={onUsernameChange || (() => undefined)} />
				) : null}
				<EmailInput value={email} onChangeText={onEmailChange} />
				<PasswordInput value={password} onChangeText={onPasswordChange} />
			</View>

			<SubmitButton
				title={submitLabel}
				onPress={onSubmit}
				disabled={mode === 'register' ? !username || !email || !password : !email || !password}
			/>

			<OAuthContainer onGooglePress={onGooglePress} onApplePress={onApplePress} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 18,
	},
	formFields: {
		gap: 14,
	},
});
