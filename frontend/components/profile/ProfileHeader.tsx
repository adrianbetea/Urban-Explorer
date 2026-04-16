import { StyleSheet, Text, View } from 'react-native';

import { SettingsButton } from '@/components/profile/SettingsButton';

type ProfileHeaderProps = {
	username: string;
	score: number;
	onSettingsPress: () => void;
};

export function ProfileHeader({ username, score, onSettingsPress }: ProfileHeaderProps) {
	return (
		<View style={styles.row}>
			<View style={styles.left}>
				<View style={styles.avatar}>
					<Text style={styles.avatarText}>{username.slice(0, 2).toUpperCase()}</Text>
				</View>
				<View>
					<Text style={styles.username}>{username}</Text>
					<Text style={styles.score}>Discovery score {score}</Text>
				</View>
			</View>
			<SettingsButton onPress={onSettingsPress} />
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingTop: 14,
	},
	left: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 10,
	},
	avatar: {
		alignItems: 'center',
		backgroundColor: '#D9EAFE',
		borderRadius: 24,
		height: 48,
		justifyContent: 'center',
		width: 48,
	},
	avatarText: {
		color: '#0E2238',
		fontWeight: '700',
	},
	username: {
		color: '#0E2238',
		fontSize: 19,
		fontWeight: '800',
	},
	score: {
		color: '#526273',
		fontSize: 13,
		marginTop: 2,
	},
});
