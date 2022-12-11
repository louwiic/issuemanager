import React, {FC, ReactElement} from 'react';
import {StyleSheet, Text, View} from 'react-native';

/* type ChildProps = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
}; */

type ChildProps = {};
const HomeView: FC<ChildProps> = (
  {
    /* destructured props */
  },
): ReactElement => {
  return (
    <View style={styles.container}>
      <View style={{}}>
        <Text style={{fontSize: 12}}>Home view</Text>
      </View>
    </View>
  );
};

HomeView.defaultProps = {};
export default HomeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
