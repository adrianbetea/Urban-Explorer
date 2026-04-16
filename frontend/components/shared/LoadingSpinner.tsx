import { ActivityIndicator, StyleSheet, View } from 'react-native';

type LoadingSpinnerProps = {
	size?: 'small' | 'large';
};

export function LoadingSpinner({ size = 'large' }: LoadingSpinnerProps) {
	return (
		<View style={styles.container}>
			<ActivityIndicator size={size} color="#1A73E8" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 80,
	},
});
