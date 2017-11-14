import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {email: '', password: ''};
  }

  _login(email, password){
    Alert.alert(email + ", " + password);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Login MOVES</Text>
        </View>
        <View style={styles.content}>
          <TextInput
            style={styles.loginInput}
            placeholder="Enter your email"
            onChangeText={(text) => this.setState({email:text})}
          />
          <TextInput
            style={styles.loginInput}
            placeholder="Enter your password"
            onChangeText={(text) => this.setState({password:text})}
          />
          <Button
            onPress={() => this._login(this.state.email, this.state.password)}
            title="Login"
            color="#841584"
            accessibilityLabel="Login"
          />
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Register</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontSize: 18,
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  footerText: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
