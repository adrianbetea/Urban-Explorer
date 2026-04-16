import { router } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { AddPostFAB } from '@/components/home/AddPostFAB';
import { DashboardGrid } from '@/components/home/DashboardGrid';
import { WelcomeHeader } from '@/components/home/WelcomeHeader';

export default function HomeScreen() {
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.bgTop} />

			<ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
				<WelcomeHeader
					userName="Explorer"
					locationStatus="Location active in Bucharest"
					initials="UE"
					onProfilePress={() => router.push('/(tabs)/profile')}
				/>

				<DashboardGrid
					onExplorePress={() => router.push('/(tabs)/explore')}
					onMapPress={() => router.push('/(tabs)/map')}
					onSearchPress={() => router.push('/(tabs)/search')}
				/>
			</ScrollView>

			<AddPostFAB onPress={() => router.push('/create-post-modal')} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		backgroundColor: '#F2F8FF',
		flex: 1,
	},
	bgTop: {
		backgroundColor: '#D9EAFE',
		borderRadius: 220,
		height: 260,
		position: 'absolute',
		right: -80,
		top: -110,
		width: 260,
	},
	container: {
		gap: 18,
		paddingBottom: 110,
		paddingHorizontal: 18,
		paddingTop: 16,
	},
});
