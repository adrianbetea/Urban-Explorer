import { StyleSheet, View } from 'react-native';

import { DeletePostButton } from '@/components/profile/DeletePostButton';
import { EditPostForm } from '@/components/profile/EditPostForm';

type PostOptionsModalProps = {
	visible: boolean;
	description: string;
	onDescriptionChange: (value: string) => void;
	onDeletePress: () => void;
};

export function PostOptionsModal({
	visible,
	description,
	onDescriptionChange,
	onDeletePress,
}: PostOptionsModalProps) {
	if (!visible) {
		return null;
	}

	return (
		<View style={styles.modalCard}>
			<EditPostForm description={description} onDescriptionChange={onDescriptionChange} />
			<DeletePostButton onPress={onDeletePress} />
		</View>
	);
}

const styles = StyleSheet.create({
	modalCard: {
		backgroundColor: '#FFFFFF',
		borderColor: '#D8E3EE',
		borderRadius: 14,
		borderWidth: 1,
		gap: 12,
		marginHorizontal: 16,
		marginTop: 14,
		padding: 12,
	},
});
