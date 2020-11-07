import React from 'react';
import {Paragraph, Button, Card, Title, Text} from 'react-native-paper';
import {AsyncStorage, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import * as firebase from 'firebase';
import {Order} from '../model/order';
import {showLocation} from 'react-native-map-link';
import moment from 'moment';

const styles = StyleSheet.create({
  scrollView: {
    textAlign: 'center',
    padding: '2%',
  },
  button: {
    marginLeft: 'auto',
    // position: 'absolute',
    // right: 0,
    // height: 300,
    // marginBottom: '5%',
  },
  card: {
    margin: '1%',
  },
  label: {
    fontWeight: 'bold',
  },
  value: {},
  stateDisabled: {
    color: '#919090',
  },
  stateEnabled: {
    color: '#6dbc28',
  },
  link: {
    color: '#50959d',
  },
  para: {
    marginBottom: '2%',
  },
  atm: {
    fontSize: 20,
    color: '#c83333',
  },
  paid: {
    fontSize: 20,
    color: '#6dbc28',
  },
});

const states = {
  completed: 'Entregue',
  pending: 'Nova',
  viewed: 'Em Preparação',
  sent: 'Pronta para Entrega',
  ready: 'Pronta para Entrega',
  assigned: 'A Recolher',
  bringing: 'A Entregar',
  delivered: 'Entregue',
};

export default class HomeScreen extends React.Component {
  constructor({navigation}) {
    super({navigation});
    this.state = {
      orders: [],
      user: null,
      viewedOrders: 0,
      preparedOrders: 0,
      deliveringOrder: null,
    };

    //firebase.database().settings({experimentalForceLongPolling: true});
  }

  componentDidMount() {
    this.getCurrentUser();
    this.subscribeOrders();
  }

  openMap(lat, lng) {
    showLocation({
      latitude: lat,
      longitude: lng,
    });
  }

  formatHours(date) {
    return moment(date).format('HH:mm');
  }

  getCurrentUser() {
    AsyncStorage.getItem('user').then((u: any) => {
      // console.log('u', u);
      if (u) {
        this.setState({user: JSON.parse(u)});
      } else {
        this.props.navigation.navigate('Login');
      }
    });
  }

  subscribeOrders() {
    firebase
      .database()
      .ref('/order')
      .orderByChild('status')
      // .equalTo('completed')
      .on('value', (results) => {
        // console.log('User data: ', results.val());
        const orders = [];
        let viewedOrders = 0;
        let preparedOrders = 0;
        results.forEach((doc: DataSnapshot) => {
          const order: Order = doc.val();
          // console.log('order', order);
          if (
            order.orderType === 'delivery' &&
            (order.status === 'viewed' ||
              order.status === 'sent' ||
              order.status === 'ready')
          ) {
            order.status === 'viewed' ? viewedOrders++ : preparedOrders++;
            orders.push(this.renderOrder(order));
          }
        });
        this.setState({orders, viewedOrders, preparedOrders});
      });
  }

  renderOrder(order: Order) {
    return (
      <Card key={order.key} style={styles.card}>
        <Card.Content>
          <Paragraph>
            <Text style={styles.label}>Estado: </Text>
            <Text
              style={
                order.status === 'ready' || order.status === 'sent'
                  ? styles.stateEnabled
                  : styles.stateDisabled
              }>
              {states[order.status || 'pending']}
            </Text>
          </Paragraph>
          <Paragraph>
            <Text style={styles.label}>Hora Preferencial: </Text>
            <Text style={styles.value}>
              {this.formatHours(order.deliveryDate)}
            </Text>
          </Paragraph>
          <Paragraph>
            <Text style={styles.label}>Referência: </Text>
            <Text style={styles.value}>{order.reference}</Text>
          </Paragraph>
          <Paragraph>
            <Text style={styles.label}>Restaurante: </Text>
            <Text style={styles.value}>{order.restaurantName}</Text>
          </Paragraph>
          <Paragraph style={styles.para}>
            <Text style={styles.label}>Morada Restaurante: </Text>
            {'\n'}
            <Text
              style={
                order.restaurantAddress.coordinates.latitude
                  ? styles.link
                  : null
              }
              onPress={() =>
                this.openMap(
                  order.restaurantAddress.coordinates.latitude,
                  order.restaurantAddress.coordinates.longitude,
                )
              }>
              {(order.restaurantAddress.address || '') + ' '}
              {(order.restaurantAddress.floor || '') + ' '}
              {(order.restaurantAddress.doorNumber || '') + ' '}
              {(order.restaurantAddress.postalCode || '') + ' '}
              {order.restaurantAddress.local || ''}
            </Text>
          </Paragraph>
          <Paragraph>
            <Text style={styles.label}>Cliente: </Text>
            <Text style={styles.value}>{order.userName}</Text>
          </Paragraph>
          <Paragraph>
            <Text style={styles.label}>Telefone: </Text>
            <Text style={styles.value}>{order.phoneNumber}</Text>
          </Paragraph>
          <Paragraph style={styles.para}>
            <Text style={styles.label}>Morada Cliente: </Text>
            {'\n'}
            <Text
              style={order.address.coordinates.latitude ? styles.link : null}
              onPress={() =>
                this.openMap(
                  order.address.coordinates.latitude,
                  order.address.coordinates.longitude,
                )
              }>
              {(order.address.address || '') + ' '}
              {(order.address.floor || '') + ' '}
              {(order.address.doorNumber || '') + ' '}
              {(order.address.postalCode || '') + ' '}
              {order.address.local || ''}
            </Text>
          </Paragraph>
          <Paragraph>
            <Text style={styles.label}>Notas: </Text>
            <Text style={styles.value}>{order.notes}</Text>
          </Paragraph>
          <Paragraph>
            <Text style={styles.label}>Artigos: </Text>
            <Text style={styles.value}>
              {order.items.map((o) => o.quantity + ' ' + o.name + '\n')}
            </Text>
          </Paragraph>
          <Paragraph>
            <Text style={styles.label}>Total: </Text>
            <Text style={styles.value}>{order.total}</Text>
          </Paragraph>
          <Paragraph>
            <Text style={styles.label}>Estado Pagamento: </Text>
            <Text
              style={order.paymentMethod === 'atm' ? styles.atm : styles.paid}>
              {order.paymentMethod === 'atm' ? 'ATM' : 'PAGO'}
            </Text>
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          {(order.status === 'viewed' ||
            order.status === 'sent' ||
            order.status === 'ready') && (
            <Button
              style={styles.button}
              mode={'contained'}
              onPress={() => this.accept(order)}
              disabled={!(order.status === 'ready' || order.status === 'sent')}>
              Aceitar
            </Button>
          )}
          {order.status === 'assigned' && (
            <Button
              style={styles.button}
              mode={'contained'}
              onPress={() => this.bringing(order)}>
              Recolhido
            </Button>
          )}
          {order.status === 'bringing' && (
            <Button
              style={styles.button}
              mode={'contained'}
              onPress={() => this.complete(order)}>
              Entregue
            </Button>
          )}
        </Card.Actions>
      </Card>
    );
  }

  accept(order: Order) {
    this.setState({
      deliveringOrder: {...order, status: 'assigned'},
    });
    firebase
      .database()
      .ref('/order/' + order.key)
      .update({status: 'assigned'});
  }

  bringing(order: Order) {
    this.setState({
      deliveringOrder: {...order, status: 'bringing'},
    });
    firebase
      .database()
      .ref('/order/' + order.key)
      .update({status: 'bringing'});
  }

  complete(order: Order) {
    this.setState({
      deliveringOrder: null,
    });
    firebase
      .database()
      .ref('/order/' + order.key)
      .update({status: 'completed'});
  }

  render() {
    return (
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          {this.state && !this.state.deliveringOrder && (
            <>
              <Paragraph>
                <Text style={styles.label}>Encomendas em Preparação: </Text>
                <Text style={styles.value}>
                  {this.state && this.state.viewedOrders}
                </Text>
              </Paragraph>
              <Paragraph>
                <Text style={styles.label}>Encomendas para Entrega: </Text>
                <Text style={styles.value}>
                  {this.state && this.state.preparedOrders}
                </Text>
              </Paragraph>
            </>
          )}
          {this.state && this.state.deliveringOrder
            ? this.renderOrder(this.state.deliveringOrder)
            : this.state.orders}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
