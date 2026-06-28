import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useSignUp } from '../hooks/useSignUp';
import { Link } from 'expo-router';

export default function SignUpScreen() {
  const { form, onSubmit } = useSignUp();
  const {
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder='Email'
        autoCapitalize='none'
        keyboardType='email-address'
        onChangeText={(t) => setValue('email', t)}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
      <TextInput
        style={styles.input}
        placeholder='Password (min. 6 chars)'
        secureTextEntry
        onChangeText={(t) => setValue('password', t)}
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}
      {errors.root && <Text style={styles.error}>{errors.root.message}</Text>}
      <TouchableOpacity
        style={styles.button}
        onPress={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color='#fff' />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
      <Link href='/sign-in' style={styles.link}>
        Already have an account? Sign In
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  error: { color: 'red', marginBottom: 10 },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 180,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  link: { marginTop: 20, color: '#007AFF' },
});
