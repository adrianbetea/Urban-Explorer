import { useEffect } from 'react';

type Location = {
	latitude: number;
	longitude: number;
};

type LocationFetcherProps = {
	onLocationDetected: (location: Location) => void;
};

export function LocationFetcher({ onLocationDetected }: LocationFetcherProps) {
	useEffect(() => {
		onLocationDetected({ latitude: 44.4268, longitude: 26.1025 });
	}, [onLocationDetected]);

	return null;
}
