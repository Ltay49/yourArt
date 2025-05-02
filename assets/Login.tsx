import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Toast from 'react-native-toast-message'; // Import react-native-toast-message

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(true); // Toggle between sign up and sign in
  const [user, setUser] = useState<any>(null); // Track signed-in user

  const handleAuth = async () => {
    // Check if email or password is empty
    if (!email || !password) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error',
        text2: 'Email and Password are required.',
        visibilityTime: 3000,
      });
      return; // Prevent submission if fields are empty
    }

    try {
      if (isSigningUp) {
        // Try creating a new user with email and password
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCred.user;

        // Save to Firestore (if needed, you can use Firestore to save user data)
        // await setDoc(doc(db, 'users', newUser.uid), {
        //   email: newUser.email,
        //   createdAt: new Date(),
        // });

        setUser(newUser); // Set user state after sign-up
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Success',
          text2: 'User registered!',
          visibilityTime: 3000,
        });
      } else {
        // Try signing in with the given email and password
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const newUser = userCred.user;

        setUser(newUser); // Set user state after sign-in
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Welcome Back',
          text2: 'Signed in successfully.',
          visibilityTime: 3000,
        });
      }
    } catch (error: any) {
      console.log('Firebase error code:', error.code);
      console.log('Firebase error message:', error.message);

      if (error.code === 'auth/email-already-in-use') {
        // Handle case where email is already in use
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error',
          text2: 'This email is already registered!',
          visibilityTime: 3000,
        });
      } else if (error.code === 'auth/wrong-password') {
        // Specific error for wrong password
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error',
          text2: 'Incorrect password. Please try again.',
          visibilityTime: 3000,
        });
      } else if (error.code === 'auth/user-not-found') {
        // Handle case where user is not found
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error',
          text2: 'No account found for this email.',
          visibilityTime: 3000,
        });
      } else {
        // Generic error handling for other issues
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error',
          text2: error.message,
          visibilityTime: 3000,
        });
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user state after sign-out
      Toast.show({
        type: 'info',
        position: 'bottom',
        text1: 'Info',
        text2: 'You have been signed out successfully!',
        visibilityTime: 3000,
      });
    } catch (error: any) {
      console.log('Sign-out error:', error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error',
        text2: 'Failed to sign out.',
        visibilityTime: 3000,
      });
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        // If user is signed in, show the sign-out button and signed-in message
        <View>
          <Text style={styles.signedInMessage}>You are signed in as {user.email}</Text>
          <Button title="Sign Out" onPress={handleSignOut} />
        </View>
      ) : (
        // If user is not signed in, show sign-up/sign-in forms
        <View>
          <Text style={styles.header}>{isSigningUp ? 'Sign Up' : 'Sign In'}</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button title={isSigningUp ? 'Register' : 'Log In'} onPress={handleAuth} />

          <TouchableOpacity onPress={() => setIsSigningUp(!isSigningUp)} style={styles.toggle}>
            <Text style={styles.toggleText}>
              {isSigningUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Toast container */}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 100 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderBottomWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
  signedInMessage: {
    fontSize: 18,
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  toggle: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    color: '#007BFF',
  },
});
