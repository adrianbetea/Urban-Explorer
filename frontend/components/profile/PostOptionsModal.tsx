import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { DeletePostButton } from '@/components/profile/DeletePostButton';
import { EditPostForm } from '@/components/profile/EditPostForm';

type PostOptionsModalProps = {
	visible: boolean;
	description: string;
	onDescriptionChange: (value: string) => void;
	onSave: () => void;
	onDeletePress: () => void;
	onClose: () => void;
};

export function PostOptionsModal({
	visible,
	description,
	onDescriptionChange,
	onSave,
	onDeletePress,
	onClose,
}: PostOptionsModalProps) {
	return (
		<Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
			<Pressable style={styles.backdrop} onPress={onClose}>
				<Pressable style={styles.modalCard} onPress={() => {}}>
					<Text style={styles.title}>Edit post</Text>
					<EditPostForm description={description} onDescriptionChange={onDescriptionChange} />
					<Pressable style={styles.saveButton} onPress={onSave}>
						<Text style={styles.saveText}>Save</Text>
					</Pressable>
					<DeletePostButton onPress={onDeletePress} />
				</Pressable>
			</Pressable>
		</Modal>
	);
}

const styles = StyleSheet.create({
	backdrop: {
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.4)',
		flex: 1,
		justifyContent: 'center',
	},
	modalCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		gap: 12,
		marginHorizontal: 24,
		padding: 20,
		width: '85%',
	},
	title: {
		color: '#0E2238',
		fontSize: 16,
		fontWeight: '700',
	},
	saveButton: {
		alignItems: 'center',
		backgroundColor: '#4A90D9',
		borderRadius: 10,
		paddingVertical: 10,
	},
	saveText: {
		color: '#FFFFFF',
		fontSize: 14,
		fontWeight: '600',
	},
});
