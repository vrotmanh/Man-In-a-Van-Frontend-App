import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableHighlight, FlatList, StatusBar,Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import MapView from 'react-native-maps';

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
          navigate('Home', { user_id: responseJson.user_id,  user_email: this.state.email})
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
          <Button
            onPress={() => navigate('Home', { user_id: 16, user_email: 'mb2589@cornell.edu' })}
            title="Bypass"
            color="#205166"
            accessibilityLabel="Bypass"
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
          navigate('Home', { user_id: responseJson.user_id, user_email: this.state.email})
        }
        //Login error
        else if (responseJson.message){
          Alert.alert(
              'Message',
              responseJson.message+'',
              [
                {text: 'OK', onPress: () => navigate('Login')},
              ],
              { cancelable: false }
            )
        }else if (responseJson.error){
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

class CreateMoveScreen extends React.Component {
  static navigationOptions = {
    title: 'New Move'
  };
  constructor(props) {
    super(props)
    user_id = this.props.navigation.state.params.user_id;
    user_email = this.props.navigation.state.params.user_email;
    this.state = {
      TextInputFrom: '',
      TextInputTo: '',
      TextInputDate: '',
      TextInputRooms:'',
      user_id: user_id,
      user_email: user_email
    }
  }
  CheckTextInputIsEmptyOrNot = () =>{
    const { TextInputFrom }  = this.state ;
    const { TextInputTo }  = this.state ;
    const { TextInputDate }  = this.state ;
    const { TextInputRooms }  = this.state ;


    if(TextInputFrom == '' || TextInputTo == '' ||
        TextInputDate == '' || TextInputRooms==''){
          Alert.alert("You need to complete all the fields.");
        }
    else{
      // Do something here which you want to if all the Text Input is filled.
      const { navigate } = this.props.navigation;
      fetch('https://maniavan-18000.appspot.com/moves', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "start_place": TextInputFrom,
          "end_place": TextInputTo,
          "date": TextInputDate,
          "user_id": this.state.user_id,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.move_id){
          navigate('MatchingScreen', { user_id: this.state.user_id, user_email: this.state.user_email, driver_email: responseJson.driver_email,
          driver_image: responseJson.driver_image, customer_image: responseJson.customer_image })
        }
      })
      .catch((error) => {
          console.error(error);
      });
     //navigate('MatchingScreen')
    }

  }
  render() {
    const {navigate} =this.props.navigation;
    return   <View style={styles.MainContainer}>
      <Text style={[styles.headline]}>New Move</Text>
            <TextInput
              // Adding hint in Text Input using Place holder.
              placeholder="Enter Starting Place"
              onChangeText={TextInputFrom=> this.setState({TextInputFrom})}
              // Making the Under line Transparent.
              underlineColorAndroid='transparent'
              style={styles.TextInputStyleClass}
            />
            <TextInput
              // Adding hint in Text Input using Place holder.
              placeholder="Enter Arriving Place"
              onChangeText={TextInputTo => this.setState({TextInputTo})}
              // Making the Under line Transparent.
              underlineColorAndroid='transparent'
              style={styles.TextInputStyleClass}
            />
            <TextInput
              // Adding hint in Text Input using Place holder.
              placeholder="Enter Date"
              onChangeText={TextInputDate => this.setState({TextInputDate})}
              // Making the Under line Transparent.
              underlineColorAndroid='transparent'
              style={styles.TextInputStyleClass}
            />
            <TextInput
              // Adding hint in Text Input using Place holder.
              placeholder="Enter Number of Rooms"
              onChangeText={TextInputRooms => this.setState({TextInputRooms})}
              // Making the Under line Transparent.
              underlineColorAndroid='transparent'
              style={styles.TextInputStyleClass}
            />
            <Button
              onPress={() => navigate('EstimatePrice')}
              title="Check your Price"
            />
            <Button title="CONFIRM" onPress={this.CheckTextInputIsEmptyOrNot} color="#2196F3" />
      </View>;
  }
}

class EstimatePriceScreen extends React.Component {
  static navigationOptions = {
    title: 'New Move'
  };
  render() {
    return    <View style={styles.MainContainer}>
              <MapView style={[styles.map]} showsUserLocation={true} />
              <Text style={[styles.headline]}>Estimated Price</Text>
              <Text style={[styles.headline]}>42$</Text>

      </View>
  }
}
class MatchingScreen extends React.Component {
  static navigationOptions = {
    title: 'MatchingScreen'
  };
  constructor(props) {
    super(props)
    user_id = this.props.navigation.state.params.user_id;
    user_email = this.props.navigation.state.params.user_email;
    driver_email = this.props.navigation.state.params.driver_email;
    customer_image = this.props.navigation.state.params.customer_image;
    driver_image = this.props.navigation.state.params.driver_image;
    this.state = {
      user_id: user_id,
      user_email: user_email,
      driverEmail: driver_email,
      driverPicture: driver_image,
      userPicture: driver_image
    }
  }
  render() {
    const {navigate} =this.props.navigation;

    return  <View style={styles.MainContainer}>
    <Text style={[styles.headline]}>You have been matched!</Text>
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
      <Image source={{uri: this.state.driverPicture}} style={{width: 100, height: 100}} />
      <Image source={{uri: this.state.userPicture}} style={{width: 100, height: 100}} />
      </View>
      <Text style={[styles.body]}>Feel free to contact your driver at {this.state.driverEmail}</Text>
      <Button
        onPress={() => navigate('Home', { user_id: this.state.user_id,  user_email: this.state.user_email})}
        title="Confirm"
        color="#2196F3"
        accessibilityLabel="Confirm"
      />
    </View>
  }
}

class Move extends Component {
  render() {
    return (
      <View style = {styles.test2}>
        <Text style = {[styles.move_time]}>DateOfMove: {this.props.dateofmove}</Text>
        <Text>Price: {this.props.price}</Text>
        <Text>Start Point: {this.props.start_pt}</Text>
        <Text>End Pt: {this.props.end_pt}</Text>
      </View>
    )
  }
}

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    user_id = this.props.navigation.state.params.user_id;
    user_email = this.props.navigation.state.params.user_email;
    this.state = {
      dataSource: '',
      user_id: user_id,
      user_email: user_email
    }
  }

  renderRow({item}) {
    const dateofmove = `${item.date}`;
    const price = `${item.price}`;
    const start_pt = `${item.start_place}`
    const end_pt = `${item.end_place}`

    let actualRowComponent =
      <View style = {styles.test}>
        <Move dateofmove = {dateofmove} price = {price} start_pt = {start_pt} end_pt = {end_pt} />
      </View>;

    return (
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor = '#FFFFFF00'
        onPress = {() => {
          this.props.navigation.navigate('MoveDetails', {...item, user_email: this.state.user_email});
        }}>
        {actualRowComponent}
      </TouchableHighlight>
    );
  }

  _keyExtractor = (item, index) => index;

  componentDidMount() {
    return fetch('https://maniavan-18000.appspot.com/moves?user_id='+this.state.user_id)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          dataSource: responseJson.moves
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style = {styles.container2}>
        <Text style = {styles.headline2}>Your Moves</Text>
        <StatusBar hidden={false} translucent={false} animated={true} />
        <FlatList
        style = {styles.container2}
        data={this.state.dataSource}
        renderItem = {this.renderRow.bind(this)}
        keyExtractor = {this._keyExtractor} />
        <Button
          onPress={() => navigate('CreateMove', { user_id: this.state.user_id, user_email: this.state.user_email })}
          title="Publish your move"
          color="#205166"
          accessibilityLabel="Go to create move"
        />
      </View>
    );

  }
}

class MoveDetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'New Move'
  };


  render() {
    const {customer_id, user_email, date, end_place, price, start_place} = this.props.navigation.state.params
    return (
      <View style={styles.MainContainer}>
        <MapView style={[styles.map]} showsUserLocation={true} />
        <Text>Hi, {user_email}!</Text>
        <Text>Start Place: {start_place}</Text>
        <Text>End Place: {end_place}</Text>
        <Text>Date: {date}</Text>
        <Text>Price: {price}</Text>
        <Button
          onPress = {() => {
            Alert.alert('Call driver!')
          }}
          title = "Contact Driver"
          color = "#ff0000"
        />
        <Button
          onPress = {() => {
            Alert.alert('Ride canceled!')
          }}
          title = "Cancel Move"
          color = "#ff0000"
        />
      </View>
    )
  }
}

const App = StackNavigator({
  Login: { screen: LoginScreen },
  Home: { screen: HomeScreen },
  Register: { screen: RegisterScreen },
  CreateMove: { screen: CreateMoveScreen },
  MoveDetails: { screen: MoveDetailsScreen },
  EstimatePrice: { screen: EstimatePriceScreen} ,
  MatchingScreen: { screen: MatchingScreen}
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

  body: {
    textAlign: 'left', // <-- the magic
    fontSize: 20,
    marginLeft: 20,
    width: 390,
  },
  MainContainer :{
    justifyContent: 'center',
    flex:1,
    margin: 0
  },
  headline: {
    textAlign: 'center', // <-- the magic
    fontWeight: 'bold',
    fontSize: 48,
    marginTop: -20,
    marginBottom: 40,

    width: 390,
  },
  map:{
    marginTop: -120,
    height: 400,
    margin: 0,
  },
  TextInputStyleClass: {
    textAlign: 'center',
    marginBottom: 7,
    height: 40,
    borderWidth: 1,
    // Set border Hex Color Code Here.
    borderColor: '#FF5722',
  },
  test: {
    //flex: 1,
    flex: 1,
    padding: 8,
    flexDirection: 'row', // main axis
    // justifyContent: 'center', // main axis
    // alignItems: 'center', // cross axis
    // backgroundColor: '#fff000', //colors.background_dark,
  },
  move_time: {
    color: "#ff0000",
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    flex: 0,
  },
  test2: {
    flex: 1,
    // backgroundColor: '#0000ff',
    borderStyle: 'solid',
    borderColor: '#000000',
    borderWidth: 3,
    borderRadius: 5,
    elevation: 1,
  },
  headline2: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 48,
    marginTop: 30,
    marginBottom: 30,
  },
  container2: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  map: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#222'
  },
  centeredView: {
    flex:1,
    alignItems:'stretch',
    justifyContent:'center'
  },

  // Probably this style should get moved into a dedicated PhoneValidation component.
  phoneNumberInput: {
    marginTop: 20,
    fontSize: 45,
    color: 'white',
    textAlign: 'center',
    backgroundColor: '#222'
  }
});
