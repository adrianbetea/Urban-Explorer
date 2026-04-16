import { StyleSheet, Text, View } from 'react-native';

type PostHeaderProps = {
	username: string;
	city: string;
};

export function PostHeader({ username, city }: PostHeaderProps) {
	return (
		<View style={styles.row}>
			<View style={styles.avatar}>
				<Text style={styles.avatarText}>{username.slice(0, 1).toUpperCase()}</Text>
			</View>
			<View>
				<Text style={styles.username}>{username}</Text>
				<Text style={styles.city}>{city}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 10,
	},
	avatar: {
		alignItems: 'center',
		backgroundColor: '#D9EAFE',
		borderRadius: 18,
		height: 36,
		justifyContent: 'center',
		width: 36,
	},
	avatarText: {
		color: '#0E2238',
		fontWeight: '700',
	},
	username: {
		color: '#0E2238',
		fontSize: 15,
		fontWeight: '700',
	},
	city: {
		color: '#5A6F85',
		fontSize: 12,
		marginTop: 2,
	},
});
