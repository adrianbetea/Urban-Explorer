import { Image, StyleSheet, View } from 'react-native';

type AppLogoProps = {
	size?: number;
};

export function AppLogo({ size = 120 }: AppLogoProps) {
	return (
		<View style={styles.container}>
			<Image
				source={require('../../assets/images/app-logo.png')}
				style={[styles.logo, { width: size, height: size }]}
				resizeMode="contain"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	logo: {
		maxWidth: 220,
		maxHeight: 220,
	},
});
