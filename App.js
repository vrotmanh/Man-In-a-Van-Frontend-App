import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Button,
  Alert,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  StatusBar,
  KeyboardAvoidingView,
  Image,
  Linking } from 'react-native';
import { StackNavigator } from 'react-navigation';
import {Button as RNButton, Icon} from 'react-native-elements';
import MapView from 'react-native-maps';
import Moment from 'moment';

const window = Dimensions.get('window');


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
        <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.background}></View>
          </TouchableWithoutFeedback>
          <View style={{flex:0.4}}>
            <Text style={styles.headline}>Man In A Van</Text>
          </View>
          <View style={styles.content}>
            <View style = {styles.inputTextView}>
              <TextInput
                style={styles.loginInput}
                placeholder="Enter your email"
                onChangeText={(text) => this.setState({email:text})}
              />
            </View>
            <View style={styles.inputTextView}>
              <TextInput
                secureTextEntry={true}
                style={styles.loginInput}
                placeholder="Enter your password"
                onChangeText={(text) => this.setState({password:text})}
              />
            </View>
            <RNButton
              buttonStyle={styles.buttonBasic}
              large
              icon = {{type:'entypo' , name:'login'}}
              title="Login"
              onPress={() => this._login(this.state.email, this.state.password)}
            />
            <View style={{height: 100, backgroundColor: '#1d5266'}}>
              <Button
                onPress={() => navigate('Home', { user_id: 16, user_email: 'mb2589@cornell.edu' })}
                title="Bypass"
                color="#fff000"
              />
            </View>
            <RNButton
              buttonStyle={styles.buttonBasic}
              icon = {{type:'MatrialIcons', name:'create'}}
              onPress={() => navigate('Register')}
              large
              title="Register"
            />
          </View>
        </KeyboardAvoidingView>
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
      <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.background}></View>
        </TouchableWithoutFeedback>
        <View style = {{flex:0.4}}>
          <Text style={styles.headline}>Register</Text>
        </View>
        <View style={styles.content}>
          <View style = {styles.inputTextView}>
            <TextInput
              style={styles.loginInput}
              placeholder="Enter your email"
              onChangeText={(text) => this.setState({email:text})}
            />
          </View>
          <View style = {styles.inputTextView}>
            <TextInput
              secureTextEntry={true}
              style={styles.loginInput}
              placeholder="Enter your password"
              onChangeText={(text) => this.setState({password:text})}
            />
          </View>
          <View style = {styles.inputTextView}>
            <TextInput
              secureTextEntry={true}
              style={styles.loginInput}
              placeholder="Confirm your password"
              onChangeText={(text) => this.setState({password_confirmation:text})}
            />
          </View>
          <RNButton
            onPress={() => this._register(this.state.email, this.state.password, this.state.password_confirmation)}
            buttonStyle= {styles.buttonBasic}
            large
            title="Sign Up"
            icon = {{type:'entypo', name:'add-user'}}
          />
        </View>
      </KeyboardAvoidingView>
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
          "num_rooms" : TextInputRooms,
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
    return (
      <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.background}></View>
        </TouchableWithoutFeedback>
        <View style={{flex:0.2}}>
          <Text style={styles.headline}>Create Move</Text>
        </View>
        <View style = {styles.content}>
          <View style = {styles.inputTextView}>
            <TextInput
              style={styles.loginInput}
              placeholder="Enter Starting Place"
              onChangeText={TextInputFrom=> this.setState({TextInputFrom})}
            />
          </View>
          <View style = {styles.inputTextView}>
            <TextInput
              style={styles.loginInput}
              placeholder="Enter Arriving Place"
              onChangeText={TextInputTo => this.setState({TextInputTo})}
            />
          </View>
          <View style = {styles.inputTextView}>
            <TextInput
              style={styles.loginInput}
              placeholder="Enter Date"
              onChangeText={TextInputDate => this.setState({TextInputDate})}
            />
          </View>
          <View style = {styles.inputTextView}>
            <TextInput
              style={styles.loginInput}
              placeholder="Enter Number of Rooms"
              onChangeText={TextInputRooms => this.setState({TextInputRooms})}
            />
          </View>
          <View style = {styles.moveRow}>
            <RNButton
              buttonStyle={styles.buttonBasic}
              icon = {{type:'entypo', name:'eye'}}
              onPress={() => navigate('EstimatePrice')}
              // large
              title="Check Price"
            />
            <RNButton
              buttonStyle={styles.buttonBasic}
              icon = {{type:'entypo', name:'check'}}
              onPress={this.CheckTextInputIsEmptyOrNot}
              // large
              title="Register"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
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
      userPicture: customer_image
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
    Moment.locale('en');
    var itemDate = this.props.dateofmove;
    console.log(itemDate)
    return (
      <View style = {styles.moveItem}>
        <View style = {styles.moveRow}>
          <Text style = {styles.moveDate}>{Moment(itemDate).format('MMM Do')}</Text>
          <Text style = {styles.movePrice}>${this.props.price}</Text>
        </View>
        <View style = {styles.moveRow}>
          <Text adjustsFontSizeToFit={true} style = {styles.placeDest}>{this.props.start_pt}</Text>
          <Icon
            color= '#fff'
            size={30}
            name='arrow-right'
            type='entypo'
          />
          <Text adjustsFontSizeToFit={true} style = {styles.placeDest}>{this.props.end_pt}</Text>
        </View>
      </View>
    )
  }
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

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
    const start_pt = `${item.start_place}`;
    const end_pt = `${item.end_place}`;

    let actualRowComponent =
      <View style = {styles.moveItemView}>
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
      <View style = {styles.container}>
        <Text style = {styles.headline}>Your Moves</Text>
        <FlatList
        style = {styles.flatListStyle}
        data={this.state.dataSource}
        renderItem = {this.renderRow.bind(this)}
        keyExtractor = {this._keyExtractor} />
        <View style = {styles.bottomButtonContainer}>
          <Icon
            color= '#1ccc31'
            size={40}
            backgroundColor = '#000000'
            raised
            name='add'
            type='MaterialIcons'
            onPress={() => navigate('CreateMove', { user_id: this.state.user_id, user_email: this.state.user_email })}
          />
        </View>
      </View>
    );
  }
}

class MoveDetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Move Details'
  };


  render() {
    const {customer_id, user_email, driver_email, move_id, date, end_place, price, start_place} = this.props.navigation.state.params
    console.log(this.props.navigation.state.params)
    return (
      <View style={styles.container}>
        <Text style = {styles.detailsHead}>Planned move for</Text>
        <Text style = {styles.detailsHead}>{user_email}</Text>
        <View style = {styles.mapView}>
          <MapView style={styles.map} showsUserLocation={true} />
        </View>
        <View style = {styles.detailsButtons}>
          <RNButton
            buttonStyle={styles.buttonBasicWithHeight}
            icon = {{type:'entypo', name:'mail'}}
            onPress = {() => {
              Linking.openURL('mailto:' + driver_email + '?subject=Planned Move Inquiry&body=Hello, \n I would like to reach out about my planned move. \n Thanks!')
            }}
            //large
            title="Contact Driver"
          />
          <RNButton
            buttonStyle={styles.buttonBasicWithHeight}
            icon = {{type:'feather', name:'x'}}
            onPress = {() => {
              const {navigate} = this.props.navigation;
              console.log(move_id + ' ' + customer_id + ' ' + user_email)
              fetch('https://maniavan-18000.appspot.com/moves?move_id=' + move_id, {
                method: 'delete'
              })
              .then((response) => navigate('Home', { user_id: customer_id, user_email: user_email }) );
            }}
            //large
            title="Cancel move"
          />
        </View>
        <View style = {styles.detailsContainer}>
          <Text style={styles.detailsFont}>Start Place: {start_place}</Text>
          <Text style={styles.detailsFont}>End Place: {end_place}</Text>
          <Text style={styles.detailsFont}>Date: {Moment(date).format('MMM DD, YYYY')}</Text>
          <Text style={styles.detailsFont}>Price: ${price}</Text>
        </View>
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
    backgroundColor: '#1d5266',
  },
  background: {
    backgroundColor: '#1d5266',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  headerLanding : {
    flex: 0.5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 42,
    alignItems: 'center',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    marginTop: 50,
    alignItems: 'center',
    flexDirection: 'column',
  },
  buttonBasic: {
    backgroundColor: '#1ccc31',
    borderRadius: 5,
  },
  buttonBasicWithHeight: {
    backgroundColor: '#1ccc31',
    borderRadius: 5,
    height: 60,
  },
  inputTextView: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderRadius: 8,
  },
  loginInput: {
    width: window.width - 150,
    height: 40,
    fontSize: 18,
    marginHorizontal: 10
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    height: window.height - 80,
  },
  flatListStyle: {
    flex: 1,
    backgroundColor: '#1d5266',
    width: window.width - 10,
  },
  moveItemView: {
    flex: 1,
    padding: 8,
    flexDirection: 'row',
  },
  moveItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#1ccc31',
    borderStyle: 'solid',
    borderColor: '#000000',
    borderWidth: 3,
    borderRadius: 5,
    elevation: 1,
  },
  moveDate: {
    flex: 1,
    textAlign: 'left',
    fontSize: 20,
  },
  movePrice: {
    flex: 1,
    fontSize: 20,
    textAlign: 'right',
  },
  moveRow: {
    flexDirection: 'row',
    padding: 4
  },
  placeDest: {
    flex:1,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  bottomButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 30
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
    color: '#FFFFFF',
    fontSize: 48,
    marginTop: 30,
    marginBottom: 30,
    width: window.width - 10,
  },
  mapView: {
    //flex:1,
    width: window.width,
    height: window.height / 3,
  },
  map: {
    flex:1,
  },
  detailsHead: {
    color: '#ffffff',
    fontSize: 32,
    marginTop: 5,
    marginBottom: 5,
    alignItems: 'center',
  },
  detailsFont: {
    color: '#ffffff',
    fontSize: 24,
    textAlign: 'left'
  },
  detailsContainer: {
    flex:1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 40,
    marginRight: 40,
    // justifyContent: 'left',
  },
  detailsButtons: {
    flexDirection: 'row',
    padding: 4,
    marginTop: 10,
    marginBottom: 10,
  },
  TextInputStyleClass: {
    textAlign: 'center',
    marginBottom: 7,
    height: 40,
    borderWidth: 1,
    // Set border Hex Color Code Here.
    borderColor: '#FF5722',
  },
  headline2: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 48,
    marginTop: 30,
    marginBottom: 30,
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
