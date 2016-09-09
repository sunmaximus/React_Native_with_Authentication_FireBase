import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  ListView,
  TouchableOpacity
} from 'react-native';

import styles from '../styles';

import {firebaseApp, topicsRef} from './auth/authentication';


// Make sure react-native does not commmit dupilcate coding when it commit
// update to the ListView
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});

class Topics extends Component{

  constructor(props){
    super(props)

    this.state = {
      displayName: '',
      title: '',
      dataSource: ds.cloneWithRows([{
        title: 'why is the sky blue?',
        author: 'Hank'
      }])
    }
  }

  componentDidMount(){
    let user = firebaseApp.auth().currentUser;

    console.log('WHat is user data type: ', user, typeof user );
    // Check if User doesn't have a display name and navigate to chooseName page
    if(!user.displayName){
      this.props.navigator.push({
        name: 'chooseName'
      })
    } else {
      // proceed normally with application
      this.setState({
        displayName: user.displayName
      })
      this.listenForItems(topicsRef);

    }
  }
  // This is a listener whenever something changes on the refrence of
  // the database.
  // so that way we can update our listview accordingly. By doing this when a
  // different user add something, the view can be automatically re-render and
  // update for other user or you to see
  listenForItems(ref){
    ref.on('value', (snap) => {  // snap is a special object return by FireBase
      let topics = [];          // which will hold all topics in the DB. We then
      snap.forEach(topic => {   // call an anonymous function to deal with that object
        console.log('topic', topic);
        topics.push({                   //iterate through the object to update
          title: topic.val().title,     // a local array and use that data to update DataSource
          author: topic.val().author,
          key: topic.key                // Unique hash key values from firebase
        })
      })
      this.setState({dataSource: ds.cloneWithRows(topics)});
    })
  }

  signOut(){
    // signOut the user
    firebaseApp.auth().signOut()
      .then(()=> {
        //Sign out successful
        this.props.navigator.popToTop();
      }, (error) => {
        console.log(error);
      })
  }

  details(data){
    this.props.navigator.push({

      // This is why in main.js renderScene() have the following attribute
      name: 'topicDetail',
      displayName: this.state.displayName,

      title: data.title,
      author: data.author,

      row_uid: data.key // This is how to identify different topic detail from firebase
    })
  }

  renderRow(rowData){
    return(
      <TouchableOpacity style={styles.row}
        onPress={() => this.details(rowData)}
      >
        <Text style={styles.rowTitle}>
          {rowData.title}
        </Text>
        <Text>
          {rowData.author}
        </Text>
      </TouchableOpacity>
    )
  }

  addTopic(){
    topicsRef.push({
      title: this.state.title,
      author: this.state.displayName
    })
  }

  render(){
    return (
      <View style={styles.flexContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.signOut()}
          >
            <Text style={styles.link}>
              Sign Out
            </Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {this.state.displayName}
          </Text>
        </View>
        <View style={styles.body}>
          <TextInput
            placeholder='Something on your mind?'
            style={styles.input}
            onChangeText={(text) => this.setState({title: text})}
            onEndEditing={() => this.addTopic()}
          />
          <ListView
            style={styles.list}
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={(rowData) => this.renderRow(rowData)}
          />
        </View>
      </View>
    );
  }
}

module.exports = Topics;
