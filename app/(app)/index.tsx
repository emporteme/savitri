import { Redirect, useRouter } from "expo-router";
import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const App: React.FC = () => {

	// State to track if this is first app launch
	const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

	// useRouter variable
	const router = useRouter()

	useEffect(() => {

		// Get alreadyLaunched value from AsyncStorage
		AsyncStorage.getItem('alreadyLaunched').then(value => {

			// If null, this is first launch
			if (value == null) {

				// Set value in AsyncStorage
				AsyncStorage.setItem('alreadyLaunched', 'true');

				// Update state
				setIsFirstLaunch(true);
			} else {

				// Not first launch
				setIsFirstLaunch(false);
			}
		});
	}, []);

	return (
		<View>

			{/* Show loading text if state not populated yet */}
			{isFirstLaunch === null ? (
				<Text>Loading...</Text>
			) : (

				/* If first launch, redirect to onboarding */
				isFirstLaunch ? (
					<Redirect href="/onboarding" />
					// router.push("/onboarding")
				) : (

					/* Else redirect to main pages */
					<Redirect href="/wallet" />
					// router.push("/")
				)
			)}
		</View>
	);
}
export default App;