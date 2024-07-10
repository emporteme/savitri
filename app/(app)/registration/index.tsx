import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Services } from '@/services/services';
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text style={styles.title}>Register</Text>
            <Image source={require("../../../assets/images/splash.png")} style={styles.logo} />
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email address</Text>
                <TextInput
                    style={styles.mailInput}
                    placeholder="Email address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    placeholderTextColor={"#BEBDBD"}
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        placeholderTextColor={"#BEBDBD"}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        placeholderTextColor={"#BEBDBD"}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="gray" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.spacer} />
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
            <Text style={styles.privacyPolicy}>
                By clicking on the "Register" button, you accept the terms of the <Text style={styles.privacyPolicyLink}>privacy policy</Text>
            </Text>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#9E3FFE',
        marginTop: "30%",
        marginBottom: 10,
    },
    logo: {
        width: 300,
        height: 270,
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        lineHeight: 22,
        fontWeight: "500",
        color: '#2A2831',
        marginBottom: 4,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        paddingHorizontal: 16,
        width: '100%',
    },
    mailInput:{
        height: 50,
        paddingHorizontal: 16,
        width: '100%',
        borderColor:"#E8E6E6",
        borderWidth: 1,
        borderRadius: 8,
    },
    passwordContainer: {
        borderColor:"#E8E6E6",
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingHorizontal: 12,
        justifyContent: 'space-around',
    },
    picker: {
        height: 50,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
    },
    registerButton: {
        backgroundColor: '#9E3FFE',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 12,
        marginBottom: 20,
        width: "95%",
        alignItems: "center",
        alignSelf: "center",
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    privacyPolicy: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 16,
        marginBottom:45
    },
    privacyPolicyLink: {
        color: '#9E3FFE',
        textDecorationLine: 'underline',
    },
    spacer: {
        flex: 1,
    },
});

