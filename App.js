import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';


class LoginInput extends Component {
  render(){
    return (
      <Text>Enter your {this.props.label}!</Text>
    );
  }

}

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.headerText}>Login MOVES</Text>
        </View>
        <View style={styles.content}>
          <LoginInput label='email' />
          <LoginInput label='password' />
        </View>
        <View>
          <Text style={styles.footerText}>Register</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#205166'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 15,
    fontWeight: 'bold',
  }
});
