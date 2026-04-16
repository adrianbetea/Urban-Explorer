import { StyleSheet, Text } from 'react-native';

type ScoreDisplayProps = {
	score: number;
};

export function ScoreDisplay({ score }: ScoreDisplayProps) {
	return <Text style={styles.score}>Score {score >= 0 ? `+${score}` : score}</Text>;
}

const styles = StyleSheet.create({
	score: {
		color: '#0E2238',
		fontSize: 13,
		fontWeight: '700',
	},
});
