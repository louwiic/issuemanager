import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {FC, ReactElement, useEffect, useState} from 'react';
import {
  Alert,
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
  nickname: string;
};

const resolver: Resolver<FormValues> = async values => {
  return {
    values: values.login ? values : {},
    errors: !values.login
      ? {
          login: {
            type: 'required',
            message: 'Choissisez une adresse e-mail',
          },
        }
      : !values.password
      ? {
          password: {
            type: 'required',
            message: 'Choissisez un mot de passe',
          },
        }
      : !values.nickname
      ? {
          nickname: {
            type: 'required',
            message: "Choissisez un nom d'utilisateur",
          },
        }
      : {},
  };
};
const SignInView: FC<ChildProps> = ({navigation}): ReactElement => {
  const [email, setEmail] = useState('');
  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>({resolver});
  const [loading, setLoading] = useState<Boolean>(false);

  const onSubmit = data => {
    signIn(data);
  };

  const signIn = data => {
    auth()
      .createUserWithEmailAndPassword(data?.login, data?.password)
      .then(credential => {
        console.log('User account created & signed in!');

        const uid = credential.user.uid;

        // Add the user to Cloud Firestore
        const userRef = firestore().collection('users').doc();
        userRef.set({nickname: data?.nickname, email: data?.login, uid});
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
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Attention', 'Cette adresse e-mail existe déjà');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };
  return (
    <View style={{flex: 1, marginHorizontal: '4%'}}>
      <View style={{marginTop: 30}}>
        <Text style={{fontSize: 22, fontWeight: 'bold'}}>Mon espace</Text>
      </View>
      <View style={{marginTop: 8}}>
        <Text style={{fontSize: 14, fontWeight: '300'}}>
          Nous vous invitons à créer un compte sur notre plateforme de gestion
          des tickets.
          {'\n'}En créant un compte, vous aurez accès à des fonctionnalités
          avancées, comme la possibilité de soumettre de nouvelles demandes de
          maintenance ou de consulter l'historique de vos demandes précédentes
        </Text>
      </View>

      <View style={{marginTop: 10}}>
        <TextInput
          {...register('nickname')}
          mode="outlined"
          label="Nom d'utilisateur"
          onChangeText={text => setValue('nickname', text)}
        />
        {errors.nickname && (
          <HelperText type="error" visible={errors.nickname}>
            {errors.nickname.message}
          </HelperText>
        )}
      </View>

      <View style={{marginTop: 10}}>
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
            {errors.login.message}
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
        {errors.password && (
          <HelperText type="error" visible={errors.password}>
            {errors.password.message}
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
        Créer mon compte
      </Button>
    </View>
  );
};

SignInView.defaultProps = {};
export default SignInView;

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
