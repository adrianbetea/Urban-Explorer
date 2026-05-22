import { StyleSheet, Text, View } from 'react-native';

type PostHeaderProps = {
	username: string;
	city: string;
	createdAt?: string | number | null;
};

function formatDate(value: string | number | null | undefined): string {
	if (!value) return '';
	let date: Date;
	if (typeof value === 'number') {
		date = new Date(value);
	} else if (typeof value === 'object' && 'seconds' in (value as any)) {
		date = new Date((value as any).seconds * 1000);
	} else {
		date = new Date(value);
	}
	if (isNaN(date.getTime())) return '';

	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMin = Math.floor(diffMs / 60000);
	const diffHrs = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMin < 1) return 'Just now';
	if (diffMin < 60) return `${diffMin}m ago`;
	if (diffHrs < 24) return `${diffHrs}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;

	return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function PostHeader({ username, city, createdAt }: PostHeaderProps) {
	const dateText = formatDate(createdAt);

	return (
		<View style={styles.row}>
			<View style={styles.avatar}>
				<Text style={styles.avatarText}>{username.slice(0, 1).toUpperCase()}</Text>
			</View>
			<View style={styles.infoColumn}>
				<Text style={styles.username}>{username}</Text>
				<View style={styles.metaRow}>
					<Text style={styles.city}>{city}</Text>
					{dateText ? <Text style={styles.date}> · {dateText}</Text> : null}
				</View>
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
	infoColumn: {
		flex: 1,
	},
	username: {
		color: '#0E2238',
		fontSize: 15,
		fontWeight: '700',
	},
	metaRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 2,
	},
	city: {
		color: '#5A6F85',
		fontSize: 12,
	},
	date: {
		color: '#8A9BB0',
		fontSize: 12,
	},
});
