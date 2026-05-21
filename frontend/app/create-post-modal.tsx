import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { SaveSettingsButton } from '@/components/profile/SaveSettingsButton';
import { ImageUploader } from '@/components/shared/ImageUploader';
import { LocationFetcher } from '@/components/shared/LocationFetcher';
import { createPost, searchCitySuggestions } from '@/services/api';
import { getSession } from '@/services/session';

export default function CreatePostModalScreen() {
	const [description, setDescription] = useState('');
	const [city, setCity] = useState('Bucharest');
	const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
	const [imageUris, setImageUris] = useState<string[]>([]);
	const [coords, setCoords] = useState({ latitude: 44.4268, longitude: 26.1025 });

	const session = getSession();

	useEffect(() => {
		const trimmed = city.trim();
		if (trimmed.length < 2) {
			setCitySuggestions([]);
			return;
		}

		const timeoutId = setTimeout(async () => {
			try {
				const payload = await searchCitySuggestions(trimmed, { types: '(cities)' });
				const results = Array.from(new Set(
					(payload?.data || [])
						.map((item: { mainText?: string; description?: string }) => item.description || item.mainText || '')
						.filter(Boolean)
				));
				setCitySuggestions(results);
			} catch {
				setCitySuggestions([]);
			}
		}, 350);

		return () => clearTimeout(timeoutId);
	}, [city]);

	const selectCity = (selected: string) => {
		setCity(selected.split(',')[0].trim());
		setCitySuggestions([]);
	};

	const handlePickImage = async () => {
		const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!permission.granted) {
			Alert.alert('Permission required', 'Allow photo library access to upload a post image.');
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsMultipleSelection: true,
			selectionLimit: 10,
			quality: 0.8,
		});

		if (!result.canceled && result.assets?.length > 0) {
			setImageUris((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
		}
	};

	const handleRemoveImage = (index: number) => {
		setImageUris((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async () => {
		if (imageUris.length === 0) {
			Alert.alert('Image required', 'Please choose at least one image before posting.');
			return;
		}

		try {
			await createPost({
				imageUris,
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
					{imageUris.length > 0 && (
						<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnailRow}>
							{imageUris.map((uri, idx) => (
								<View key={`thumb-${idx}`} style={styles.thumbnailWrapper}>
									<Image source={{ uri }} style={styles.thumbnail} />
									<Pressable onPress={() => handleRemoveImage(idx)} style={styles.removeButton}>
										<Text style={styles.removeText}>✕</Text>
									</Pressable>
								</View>
							))}
						</ScrollView>
					)}
					{imageUris.length > 0 && (
						<Text style={styles.selectedImageText}>{imageUris.length} image{imageUris.length > 1 ? 's' : ''} selected</Text>
					)}

					<View style={styles.fieldGroup}>
						<Text style={styles.label}>City</Text>
						<TextInput value={city} onChangeText={setCity} placeholder="City" placeholderTextColor="#8D99A8" style={styles.input} />
						{citySuggestions.length > 0 && (
							<View style={styles.suggestionsBox}>
								{citySuggestions.map((s) => (
									<Pressable key={s} onPress={() => selectCity(s)} style={styles.suggestionItem}>
										<Text style={styles.suggestionText}>{s}</Text>
									</Pressable>
								))}
							</View>
						)}
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
	suggestionsBox: {
		backgroundColor: '#FFFFFF',
		borderColor: '#D8E3EE',
		borderRadius: 10,
		borderWidth: 1,
		marginTop: 4,
		overflow: 'hidden',
	},
	suggestionItem: {
		borderBottomColor: '#F0F3F7',
		borderBottomWidth: 1,
		paddingHorizontal: 12,
		paddingVertical: 10,
	},
	suggestionText: {
		color: '#0E2238',
		fontSize: 14,
	},
	thumbnailRow: {
		gap: 8,
	},
	thumbnailWrapper: {
		position: 'relative',
	},
	thumbnail: {
		borderRadius: 10,
		height: 80,
		width: 80,
	},
	removeButton: {
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.6)',
		borderRadius: 10,
		height: 20,
		justifyContent: 'center',
		position: 'absolute',
		right: 4,
		top: 4,
		width: 20,
	},
	removeText: {
		color: '#FFFFFF',
		fontSize: 12,
		fontWeight: '700',
	},
});
