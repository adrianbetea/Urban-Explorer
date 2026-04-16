import { router } from 'expo-router';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { SaveSettingsButton } from '@/components/profile/SaveSettingsButton';
import { ImageUploader } from '@/components/shared/ImageUploader';
import { LocationFetcher } from '@/components/shared/LocationFetcher';
import { createPost } from '@/services/api';
import { getSession } from '@/services/session';

export default function CreatePostModalScreen() {
	const [description, setDescription] = useState('');
	const [city, setCity] = useState('Bucharest');
	const [imageUri, setImageUri] = useState<string | null>(null);
	const [coords, setCoords] = useState({ latitude: 44.4268, longitude: 26.1025 });

	const session = getSession();

	const handlePickImage = async () => {
		const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!permission.granted) {
			Alert.alert('Permission required', 'Allow photo library access to upload a post image.');
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			quality: 0.8,
		});

		if (!result.canceled && result.assets?.[0]?.uri) {
			setImageUri(result.assets[0].uri);
		}
	};

	const handleSubmit = async () => {
		if (!imageUri) {
			Alert.alert('Image required', 'Please choose an image before posting.');
			return;
		}

		try {
			await createPost({
				imageUri,
				description,
				latitude: coords.latitude,
				longitude: coords.longitude,
				city,
				userId: session.uid || undefined,
				username: session.user?.username || session.user?.email || 'Explorer',
			});

			Alert.alert('Success', 'Post created successfully.');
			router.back();
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to create post.';
			Alert.alert('Create post failed', message);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView contentContainerStyle={styles.content}>
				<Text style={styles.title}>Create Post</Text>
				<Text style={styles.subtitle}>Share a hidden gem with the community.</Text>

				<View style={styles.card}>
					<ImageUploader onPickImage={handlePickImage} />
					{imageUri ? <Text style={styles.selectedImageText}>Selected image ready for upload.</Text> : null}

					<View style={styles.fieldGroup}>
						<Text style={styles.label}>City</Text>
						<TextInput value={city} onChangeText={setCity} placeholder="City" placeholderTextColor="#8D99A8" style={styles.input} />
					</View>

					<View style={styles.fieldGroup}>
						<Text style={styles.label}>Description</Text>
						<TextInput
							value={description}
							onChangeText={setDescription}
							placeholder="Describe the place"
							placeholderTextColor="#8D99A8"
							multiline
							style={styles.textArea}
						/>
					</View>

					<SaveSettingsButton onPress={handleSubmit} />
				</View>
			</ScrollView>

			<LocationFetcher onLocationDetected={setCoords} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		backgroundColor: '#F4F8FD',
		flex: 1,
	},
	content: {
		paddingHorizontal: 16,
		paddingTop: 14,
	},
	title: {
		color: '#0E2238',
		fontSize: 31,
		fontWeight: '800',
	},
	subtitle: {
		color: '#526273',
		marginTop: 4,
	},
	card: {
		backgroundColor: '#FFFFFF',
		borderColor: '#D8E3EE',
		borderRadius: 14,
		borderWidth: 1,
		gap: 14,
		marginTop: 14,
		padding: 12,
	},
	fieldGroup: {
		gap: 8,
	},
	label: {
		color: '#0E2238',
		fontSize: 13,
		fontWeight: '700',
	},
	input: {
		backgroundColor: '#F5F8FC',
		borderColor: '#D8E3EE',
		borderRadius: 12,
		borderWidth: 1,
		color: '#0E2238',
		paddingHorizontal: 12,
		paddingVertical: 12,
	},
	textArea: {
		backgroundColor: '#F5F8FC',
		borderColor: '#D8E3EE',
		borderRadius: 12,
		borderWidth: 1,
		color: '#0E2238',
		minHeight: 90,
		paddingHorizontal: 12,
		paddingTop: 10,
		textAlignVertical: 'top',
	},
	selectedImageText: {
		color: '#1B8A5A',
		fontSize: 12,
	},
});
