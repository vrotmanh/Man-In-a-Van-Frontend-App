import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { StackNavigator } from 'react-navigation';

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login',
  };
  constructor(props) {
    super(props);
    this.state = {email: '', password: ''};
  }
  _login(email, password){
    if (!email || !password){
      Alert.alert('Email or Password is missing');
    }
    else{
      const { navigate } = this.props.navigation;
      fetch('https://maniavan-18000.appspot.com/users/login/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        //Login successfully
        if (responseJson.user_id){
          navigate('Home', { user_id: responseJson.user_id })
        }
        //Login error
        else{
          Alert.alert(responseJson.error+'');
        }
      })
      .catch((error) => {
          console.error(error);
      });
    }

  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Login</Text>
        </View>
        <View style={styles.content}>
          <TextInput
            style={styles.loginInput}
            placeholder="Enter your email"
            onChangeText={(text) => this.setState({email:text})}
          />
          <TextInput
            secureTextEntry={true}
            style={styles.loginInput}
            placeholder="Enter your password"
            onChangeText={(text) => this.setState({password:text})}
          />
          <Button
            onPress={() => this._login(this.state.email, this.state.password)}
            title="Login"
            color="#205166"
            accessibilityLabel="Login"
          />
        </View>
        <View style={styles.footer}>
          <Button
            onPress={() => navigate('Register')}
            title="Register"
            color="#205166"
            accessibilityLabel="Register"
          />
        </View>
      </View>
    );
  }
}

class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'RegisterScreen',
  };
  constructor(props) {
    super(props);
    this.state = {email: '', password: '', password_confirmation: ''};
  }
  _register(email, password, password_confirmation){
    if (!email || !password || !password_confirmation){
      Alert.alert('Fill all the inputs');
    }
    else if (password != password_confirmation){
      Alert.alert('Password and Confirmation does not match');
    }
    else{
      const { navigate } = this.props.navigation;
      fetch('https://maniavan-18000.appspot.com/users/register/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          password_confirmation: password_confirmation,
          kind: 'customer',
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        //Login successfully
        if (responseJson.user_id){
          navigate('Home', { user_id: responseJson.user_id })
        }
        //Login error
        else{
          Alert.alert(responseJson.error+'');
        }
      })
      .catch((error) => {
          console.error(error);
      });
    }

  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Register</Text>
        </View>
        <View style={styles.content}>
          <TextInput
            style={styles.loginInput}
            placeholder="Enter your email"
            onChangeText={(text) => this.setState({email:text})}
          />
          <TextInput
            secureTextEntry={true}
            style={styles.loginInput}
            placeholder="Enter your password"
            onChangeText={(text) => this.setState({password:text})}
          />
          <TextInput
            secureTextEntry={true}
            style={styles.loginInput}
            placeholder="Confirm your password"
            onChangeText={(text) => this.setState({password_confirmation:text})}
          />
          <Button
            onPress={() => this._register(this.state.email, this.state.password, this.state.password_confirmation)}
            title="Register"
            color="#205166"
            accessibilityLabel="Register"
          />
        </View>
        <View style={styles.footer}>
          <Button
            onPress={() => navigate('Login')}
            title="Go to Login"
            color="#205166"
            accessibilityLabel="Go to Login"
          />
        </View>
      </View>
    );
  }
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
        <Text>MOVES</Text>
    );
  }
}

const App = StackNavigator({
  Login: { screen: LoginScreen },
  Home: { screen: HomeScreen },
  Register: { screen: RegisterScreen },
});

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignSelf: "center"
  },
  header : {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 26,
    alignItems: 'center',
    fontWeight: 'bold',
    color: '#205166'
  },
  content: {
    flex: 2,
    marginTop: 50,
    alignItems: 'center',
    flexDirection: 'column',
  },
  loginInput: {
    width: 200,
    height: 50,
    fontSize: 18,
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
});
