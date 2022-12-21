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
import colorTheme from '../config/theme';
import firebase from '@react-native-firebase/app';
import {priorityType, statusColor, typeColor} from '../helpers/helpers';
interface Issue {
  request: string;
  status: string;
  type: string;
  assignTo: string;
  author: string;
  date: {
    nanoseconds: Number;
    seconds: Number;
  };
  priority: string;
}

type ChildProps = {
  navigation?: NavigationProp<ParamListBase>;
  route?: RouteProp<ParamListBase>;
  issue?: Issue;
};
const RowListItem: FC<ChildProps> = ({issue}): ReactElement => {
  const t = issue?.date;
  const isssueDate = moment(t?.toDate?.()).format('L à HH:mm');
  const assignTo = issue?.userAssigned?.nickname;
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
        <Text style={{fontSize: 14, fontWeight: '300'}}>{isssueDate}</Text>
      </View>
      {/* Type */}
      <View style={[styles.headRow, {alignItems: 'center', width: 80}]}>
        {typeColor(issue?.type)}
      </View>
      {/* Priority */}
      <View style={[styles.headRow, {alignItems: 'center', width: 80}]}>
        <Text style={{fontSize: 12}}>{priorityType(issue?.priority)}</Text>
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
            Ref : {issue?.ref}{' '}
          </Text>
          <Text numberOfLines={2} style={{fontSize: 12}}>
            {issue?.request}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Status */}
      <View style={{width: 80, padding: 4}}>
        <Text style={{fontSize: 12}}>{statusColor(issue?.status)}</Text>
      </View>
      {/* Assign to */}
      <View style={{width: 80, padding: 4, alignItems: 'center'}}>
        <Text style={{fontWeight: '400'}}>{assignTo}</Text>
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
