import React, {useState} from 'react';
import {Linking, StyleSheet} from 'react-native';
import {
  Snackbar,
  Button,
  Card,
  Divider,
  Paragraph,
  TextInput,
  Text,
} from 'react-native-paper';
import * as firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('goncalo.p.gomes@hotmail.com');
  const [password, setPassword] = useState('tmp12345');
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackText, setSnackText] = useState(false);

  const signIn = () => {
    console.log('email', email);
    console.log('password', password);
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        firebase
          .auth()
          .signInWithEmailAndPassword(email || ' ', password || ' ')
          .then((user) => {
            console.log('user', user);
            if (user) {
              AsyncStorage.setItem('user', JSON.stringify(user));
              navigation.navigate('Home');
            }
          })
          .catch((err: any) => {
            console.log('err.message', err.message);
            setSnackText(err.message);
            setSnackVisible(true);
          });
      });
  };

  return (
    <>
      <Card>
        <Card.Content>
          <Paragraph style={styles.paragraph1}>
            Insira as credenciais de estafeta abaixo.
          </Paragraph>
          <Divider />
          <TextInput
            label="Email"
            value={email}
            mode={'outlined'}
            onChangeText={(text: string) => setEmail(text)}
          />
          <TextInput
            label="Password"
            value={password}
            mode={'outlined'}
            onChangeText={(text: string) => setPassword(text)}
          />
        </Card.Content>
        <Card.Actions>
          <Button style={styles.button} mode={'contained'} onPress={signIn}>
            ENTRAR
          </Button>
        </Card.Actions>
      </Card>
      <Card>
        <Card.Content>
          <Paragraph style={styles.paragraph2}>
            Se não tem o registo envie um e-mail para
          </Paragraph>
          <Button
            onPress={() =>
              Linking.openURL(
                'mailto:scuverpt@gmail.com?subject=Inscricao Estafeta',
              )
            }>
            scuverpt@gmail.com
          </Button>
          <Paragraph style={styles.paragraph3}>
            {' '}
            com o seu nome e número de telefone e experiência profissional.
          </Paragraph>
        </Card.Content>
      </Card>
      <Snackbar
        visible={snackVisible}
        style={styles.snack}
        onDismiss={() => setSnackVisible(false)}>
        <Text style={styles.snackText}>{snackText}</Text>
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  paragraph1: {
    marginTop: '10%',
    textAlign: 'center',
    marginBottom: '5%',
    fontSize: 20,
  },
  paragraph2: {
    marginTop: '10%',
    textAlign: 'center',
  },
  paragraph3: {
    textAlign: 'center',
    marginBottom: '5%',
  },
  button: {
    width: '90%',
    marginLeft: '5%',
    marginTop: '5%',
  },
  snackText: {
    color: '#ffffff',
  },
});

export default LoginScreen;
