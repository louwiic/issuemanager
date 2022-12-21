import * as React from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import colorTheme from '../config/theme';
import HomeView from '../screens/Home/HomeView';
import AddIssueView from '../screens/AddIssueView';
import {IconButton} from 'react-native-paper';
import {View} from 'react-native';
import {AuthStack} from './AuthStack';
import LoginView from '../screens/Auth/Login';
import auth from '@react-native-firebase/auth';
import ProfilView from '../screens/Profil/ProfilView';

const Stack = createNativeStackNavigator();

const config = {
  initialRouteName: 'TabStack',
  screens: {
    ProjectsDetails: 'project/:id',
    PostDetails: 'post/:id',
  },
};

export const navigationRef = React.createRef();

export const MainStack = () => {
  return (
    <NavigationContainer ref={navigationRef} /* theme={theme} */>
      <Stack.Navigator initialRouteName={'Home'}>
        <Stack.Screen
          name="HomeView"
          component={HomeView}
          options={{
            title: '  ',
            headerShown: false,
            headerTintColor: '#fff',
            headerBackTitle: '',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="ProfileView"
          component={ProfilView}
          options={({navigation}) => ({
            title: '',
            headerShown: true,
            headerBackTitle: '',
            headerLeft: props => {
              return (
                <View>
                  <IconButton
                    {...props}
                    icon="arrow-left"
                    iconColor={colorTheme.greyLight}
                    size={20}
                    onPress={() => {
                      navigation.goBack();
                    }}
                  />
                </View>
              );
            },
            headerStyle: {
              backgroundColor: colorTheme.main,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        />
        <Stack.Screen
          name="AddIssueView"
          options={({navigation}) => ({
            title: 'Tickets',
            headerShown: true,
            headerBackTitle: '',
            headerLeft: props => {
              return (
                <View>
                  <IconButton
                    {...props}
                    icon="arrow-left"
                    iconColor={colorTheme.greyLight}
                    size={20}
                    onPress={() => {
                      navigation.goBack();
                    }}
                  />
                </View>
              );
            },
            headerStyle: {
              backgroundColor: colorTheme.main,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}>
          {() => <AddIssueView />}
        </Stack.Screen>
        <Stack.Screen
          options={({navigation}) => ({
            title: 'Tickets',
            headerShown: true,
            headerBackTitle: '',
            headerLeft: props => {
              return (
                <View>
                  <IconButton
                    {...props}
                    icon="arrow-left"
                    iconColor={colorTheme.greyLight}
                    size={20}
                    onPress={() => {
                      navigation.goBack();
                    }}
                  />
                </View>
              );
            },
            headerStyle: {
              backgroundColor: colorTheme.main,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
          name="AuthStack"
          component={AuthStack}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
