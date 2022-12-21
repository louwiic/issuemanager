import React, {FC, ReactElement} from 'react';
import {View, ViewBase, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import colorTheme from '../config/theme';

type ChildProps = {
  //define props
  navigation?: NavigationProp<ParamListBase>;
  route?: RouteProp<ParamListBase>;
  numberIssuesDone: string;
  numberIssueHigthPrio: string;
  numberNewIssues: string;
};
const Stats: FC<ChildProps> = ({
  numberIssuesDone,
  numberIssueHigthPrio,
  numberNewIssues,
}): ReactElement => {
  return (
    <>
      <View style={styles.ticketsContainer}>
        <Text style={styles.ticketsText}>Tickets</Text>
      </View>
      <View style={styles.statsContainer}>
        <View
          style={[styles.statContainer, {backgroundColor: colorTheme.done}]}>
          <Text style={styles.statNumber}>{numberIssuesDone}</Text>
          <Text style={styles.statText}>Terminé</Text>
        </View>
        <View
          style={[styles.statContainer, {backgroundColor: colorTheme.higth}]}>
          <Text style={styles.statNumber}>{numberIssueHigthPrio}</Text>
          <Text style={styles.statText}>Priorité élévé</Text>
        </View>
        <View style={[styles.statContainer, {backgroundColor: colorTheme.new}]}>
          <Text style={styles.statNumber}>{numberNewIssues}</Text>
          <Text style={styles.statText}>A traiter</Text>
        </View>
      </View>
    </>
  );
};

Stats.propTypes = {};
Stats.defaultProps = {};
export default Stats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  ticketsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketsText: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  statContainer: {
    flex: 1,
    height: 110,
    marginRight: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 54,
    color: '#fff',
    fontWeight: 'bold',
  },
  statText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
});
