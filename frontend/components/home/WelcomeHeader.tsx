import { StyleSheet, Text, View } from 'react-native';

import { ProfileShortcut } from '@/components/home/ProfileShortcut';

type WelcomeHeaderProps = {
	userName: string;
	locationStatus: string;
	initials: string;
	onProfilePress: () => void;
};

export function WelcomeHeader({ userName, locationStatus, initials, onProfilePress }: WelcomeHeaderProps) {
	return (
		<View style={styles.row}>
			<View>
				<Text style={styles.greeting}>Hello, {userName}</Text>
				<Text style={styles.location}>{locationStatus}</Text>
			</View>

			<ProfileShortcut initials={initials} onPress={onProfilePress} />
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	greeting: {
		color: '#0E2238',
		fontSize: 30,
		fontWeight: '800',
		letterSpacing: 0.2,
	},
	location: {
		color: '#526273',
		fontSize: 14,
		marginTop: 4,
	},
});
