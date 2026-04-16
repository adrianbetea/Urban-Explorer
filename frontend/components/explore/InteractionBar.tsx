import { StyleSheet, View } from 'react-native';

import { DownvoteButton } from '@/components/explore/DownvoteButton';
import { ScoreDisplay } from '@/components/explore/ScoreDisplay';
import { UpvoteButton } from '@/components/explore/UpvoteButton';

type InteractionBarProps = {
	score: number;
	onUpvote: () => void;
	onDownvote: () => void;
};

export function InteractionBar({ score, onUpvote, onDownvote }: InteractionBarProps) {
	return (
		<View style={styles.row}>
			<View style={styles.actions}>
				<UpvoteButton onPress={onUpvote} />
				<DownvoteButton onPress={onDownvote} />
			</View>
			<ScoreDisplay score={score} />
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	actions: {
		flexDirection: 'row',
		gap: 8,
	},
});
