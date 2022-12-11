import React, {FC, ReactElement} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import moment from 'moment';
import {Avatar} from 'react-native-paper';
import {colorTheme} from '../config/theme';
type ChildProps = {
  //define props
  navigation?: NavigationProp<ParamListBase>;
  route?: RouteProp<ParamListBase>;
};
const RowListItem: FC<ChildProps> = (
  {
    /* destructured props */
  },
): ReactElement => {
  return (
    <View
      style={{
        backgroundColor: colorTheme.greyLight,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
      }}>
      {/* date */}
      <View style={{padding: 4, width: 100}}>
        <Text style={{fontSize: 14, fontWeight: '300'}}>
          {moment().format('L')}
        </Text>
      </View>
      {/* Type */}
      <View style={[styles.headRow, {alignItems: 'center', width: 80}]}>
        <View
          style={{
            height: 20,
            width: 20,
            backgroundColor: '#78909c',
            borderRadius: 10,
          }}
        />
      </View>
      {/* Priority */}
      <View style={[styles.headRow, {alignItems: 'center', width: 80}]}>
        <View
          style={{
            height: 20,
            width: 20,
            backgroundColor: '#558b2f',
            borderRadius: 10,
          }}
        />
      </View>
      {/* Issue */}
      <View style={{flex: 2, width: 250}}>
        <TouchableOpacity style={{}}>
          <Text
            style={{
              fontSize: 14,
              color: colorTheme.regularBlue,
              fontWeight: '600',
            }}>
            Ref : #34{' '}
          </Text>
          <Text numberOfLines={2} style={{fontSize: 12}}>
            Bug lorsqu'on clique sur le bouton participer à un évenement Bug
          </Text>
        </TouchableOpacity>
      </View>
      {/* Status */}
      <View style={{width: 80, padding: 4}}>
        <Text style={{fontSize: 12}}>En cours</Text>
      </View>
      {/* Assign to */}
      <View style={{width: 80, padding: 4, alignItems: 'center'}}>
        <Avatar.Image size={48} />
      </View>
    </View>
  );
};

RowListItem.propTypes = {};
RowListItem.defaultProps = {};
export default RowListItem;

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
