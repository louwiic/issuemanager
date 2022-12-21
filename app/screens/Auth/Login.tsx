import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import React, {FC, ReactElement, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, HelperText, TextInput} from 'react-native-paper';
import {Resolver, useForm} from 'react-hook-form';
import colorTheme from '../../config/theme';
import {RFC_2822} from 'moment';

type ChildProps = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

type FormValues = {
  login: string;
  password: string;
};

const resolver: Resolver<FormValues> = async values => {
  return {
    values: values.login ? values : {},
    errors: !values.password
      ? {
          login: {
            type: 'required',
            message: 'Adresse email obligatoire',
          },
        }
      : {},
  };
};

const LoginView: FC<ChildProps> = ({navigation}): ReactElement => {
  const [email, setEmail] = useState('');
  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>({resolver});
  const [loading, setLoading] = useState<Boolean>(false);

  const signUp = (login: string, password: string) => {
    setLoading(true);
    auth()
      .signInWithEmailAndPassword(login, password)
      .then(res => {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'HomeView',
            },
            {
              name: 'ProfileView',
            },
          ],
        });
      })
      .catch(error => {
        // Erreur lors de la connexion, affichez un message d'erreur à l'utilisateur
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmit = data => {
    signUp(data?.login, data?.password);
  };

  /*  const signIn = () => {
    auth()
      .createUserWithEmailAndPassword(
        'jane.doe@example.com',
        'SuperSecretPassword!',
      )
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  }; */
  return (
    <View style={{flex: 1, marginHorizontal: '4%'}}>
      <View style={{marginTop: 30}}>
        <Text style={{fontSize: 22, fontWeight: 'bold'}}>Mon espace</Text>
      </View>
      <View style={{marginTop: 8}}>
        <Text style={{fontSize: 14, fontWeight: '300'}}>
          Une fois connecté, vous pourrez accéder à toutes vos demandes de
          tickets et suivre l'état de leur traitement. Vous pourrez également
          soumettre de nouvelles demandes et communiquer avec l'équipe de
          support pour obtenir de l'aide.
        </Text>
      </View>
      <View style={{marginTop: 20}}>
        <TextInput
          {...register('login')}
          mode="outlined"
          label="Email"
          //name="login"
          onChangeText={text => setValue('login', text)}
        />
        {/* {errors.login && <Text>Adresse email obligatoire</Text>} */}
        {errors.login && (
          <HelperText type="error" visible={errors.login}>
            {errors.login?.message}
          </HelperText>
        )}
      </View>

      <View style={{marginTop: 10}}>
        <TextInput
          {...register('password')}
          mode="outlined"
          label="Mot de passe"
          onChangeText={text => setValue('password', text)}
          secureTextEntry={true}
        />
        {errors.login && (
          <HelperText type="error" visible={errors.password}>
            {'Mot de passe obligatoire'}
          </HelperText>
        )}
      </View>

      <Button
        mode="contained"
        loading={loading}
        style={{marginTop: 40}}
        contentStyle={{padding: 5}}
        buttonColor={colorTheme.main}
        onPress={handleSubmit(onSubmit)}>
        Se connecter
      </Button>
      <Button
        mode="text"
        loading={loading}
        style={{marginTop: 10}}
        contentStyle={{padding: 5}}
        onPress={() => {
          navigation.navigate('SignInView');
        }}>
        S'inscrire
      </Button>
    </View>
  );
};

LoginView.defaultProps = {};
export default LoginView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headText: {fontSize: 14, fontWeight: '600'},
  headRow: {
    paddingHorizontal: 4,

    paddingVertical: 8,
  },
});
