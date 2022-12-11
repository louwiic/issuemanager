import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {colorTheme} from '../styles/theme.styles';

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
  //const {theme} = useTheme();

  //const {isReady, isConnected} = useAPI();

  return (
    <NavigationContainer ref={navigationRef} /* theme={theme} */>
      <Stack.Navigator initialRouteName={'Home'}>
        <Stack.Screen
          name="HomeView"
          component={HomeView}
          options={{
            title: 'Sessions',
            headerShown: true,
            headerStyle: {
              backgroundColor: colorTheme.freshMile,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        {/* <Stack.Screen
          name="DetailsTab"
          component={DetailsTab}
          options={{
            title: 'Details',
            headerShown: true,
            headerBackTitle: '',
            header: ({navigation}) => <HeaderDetail navigation={navigation} />,
          }}
        />
        <Stack.Screen
          name="DetailSessionView"
          component={DetailSessionView}
          options={{
            title: 'Details',
            headerShown: true,
            headerBackTitle: '',
            header: ({navigation}) => <HeaderDetail navigation={navigation} />,
          }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
