import React from 'react';
import {Button, DataTable, Card, Text} from 'react-native-paper';
import {AsyncStorage} from 'react-native';
import * as firebase from 'firebase';
import {Delivery} from '../model/delivery';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  scrollView: {
    textAlign: 'center',
    padding: '2%',
  },
});

export default class HomeScreen extends React.Component {
  constructor({navigation}) {
    super({navigation});
    this.state = {
      deliveries: [],
      user: null,
    };

    firebase.firestore().settings({experimentalForceLongPolling: true});
  }

  componentDidMount() {
    AsyncStorage.getItem('user').then((u: any) => {
      console.log('u', u);
      if (u) {
        this.setState({user: JSON.parse(u)});
      } else {
        this.props.navigation.navigate('Login');
      }
    });
    firebase
      .firestore()
      .collection('deliveries')
      .get()
      .then((snaps) => {
        console.log('snaps.length', snaps.length);
        const deliveries = [];
        snaps.docs.forEach((doc) => {
          const delivery: Delivery = doc.data();
          if (delivery.status && delivery.status !== 'delivere') {
            console.log('delivery', delivery);
            deliveries.push(
              <Card elevation={5}>
                <Card.Content>
                  <DataTable key={delivery.createdTimeStamp}>
                    <DataTable.Row>
                      <DataTable.Cell>Restaurante</DataTable.Cell>
                      <DataTable.Cell>{delivery.restaurantName}</DataTable.Cell>
                      <DataTable.Cell>
                        <Button mode={'contained'}>Aceitar</Button>
                      </DataTable.Cell>
                    </DataTable.Row>
                    <DataTable.Row>
                      <DataTable.Cell>Morada do Restaurante</DataTable.Cell>
                      <DataTable.Cell>
                        {delivery.restaurantAddress &&
                          delivery.restaurantAddress.address}
                      </DataTable.Cell>
                    </DataTable.Row>
                  </DataTable>
                </Card.Content>
              </Card>,
            );
          }
        });
        this.setState({deliveries});
      });
  }

  render() {
    return (
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          {this.state && this.state.deliveries}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
