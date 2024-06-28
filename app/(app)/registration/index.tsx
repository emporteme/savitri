import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {Services} from "@/services/Services";

export default function Index() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [bin, setBin] = useState('');
    const [type, setType] = useState('CLIENT');
    const [companyName, setCompanyName] = useState('');
    const [country, setCountry] = useState('');

    const services = new Services();

    const handleRegister = async () => {
        try {
            const data = await services.PostResource('api/v1/companies/registration-request', JSON.stringify({
                founder: {
                    email,
                    first_name: firstName,
                    last_name: lastName,
                    password,
                },
                company: {
                    bin,
                    type,
                    name: companyName,
                    main_address: {
                        country,
                    },
                },
            }));

            Alert.alert("Index Successful", "Your company has been registered successfully!");
        } catch (error) {
            Alert.alert("Index Error", "Something went wrong. Please try again later.");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="BIN"
                value={bin}
                onChangeText={setBin}
            />
            <Picker
                selectedValue={type}
                style={styles.input}
                onValueChange={(itemValue) => setType(itemValue)}
            >
                <Picker.Item label="CLIENT" value="CLIENT" />
                <Picker.Item label="EXPEDITOR" value="EXPEDITOR" />
                <Picker.Item label="CARRIER" value="CARRIER" />
            </Picker>
            <TextInput
                style={styles.input}
                placeholder="Company Name"
                value={companyName}
                onChangeText={setCompanyName}
            />
            <TextInput
                style={styles.input}
                placeholder="Country"
                value={country}
                onChangeText={setCountry}
            />
            <Button title="Register" onPress={handleRegister} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});
