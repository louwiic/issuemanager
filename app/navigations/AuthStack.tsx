import * as React from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import colorTheme from '../config/theme';
import HomeView from '../screens/Home/HomeView';
import AddIssueView from '../screens/Profil/AddIssueView';
import {IconButton} from 'react-native-paper';
import {View} from 'react-native';
import LoginView from '../screens/Auth/Login';
import SignInView from '../screens/Auth/SignInView';

const Stack = createNativeStackNavigator();

const config = {
  initialRouteName: 'TabStack',
  screens: {
    ProjectsDetails: 'project/:id',
    PostDetails: 'post/:id',
  },
};

export const navigationRef = React.createRef();

export const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName={'LoginView'}>
      <Stack.Screen
        name="LoginView"
        component={LoginView}
        options={{
          title: ' ',
          headerShown: false,
          headerStyle: {
            backgroundColor: colorTheme.main,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="SignInView"
        component={SignInView}
        options={{
          title: ' ',
          headerShown: false,
          headerStyle: {
            backgroundColor: colorTheme.main,
          },
          headerLeft: props => {
            return (
              <View>
                <IconButton
                  {...props}
                  icon="arrow-left"
                  iconColor={colorTheme.greyLight}
                  size={20}
                  onPress={() => {
                    //navigation.goBack();
                  }}
                />
              </View>
            );
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};
