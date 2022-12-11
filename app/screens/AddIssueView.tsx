import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import moment from 'moment';

import React, {FC, ReactElement, useEffect} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import RowListItem from '../../components/RowListItem';
import {colorTheme} from '../../config/theme';
import {IconButton, Button} from 'react-native-paper';

type ChildProps = {
  navigation?: NavigationProp<ParamListBase>;
  route?: RouteProp<ParamListBase>;
};

const AddIssueView: FC<ChildProps> = ({navigation}): ReactElement => {
  return <View style={styles.container}></View>;
};

AddIssueView.defaultProps = {};
export default AddIssueView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
