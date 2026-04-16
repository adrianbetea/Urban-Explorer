import { StyleSheet, Text } from 'react-native';

type PostDescriptionProps = {
	description: string;
};

export function PostDescription({ description }: PostDescriptionProps) {
	return <Text style={styles.text}>{description}</Text>;
}

const styles = StyleSheet.create({
	text: {
		color: '#1D3147',
		fontSize: 14,
		lineHeight: 20,
	},
});
