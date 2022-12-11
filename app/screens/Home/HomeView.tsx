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
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

const HomeView: FC<ChildProps> = ({navigation}): ReactElement => {
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: props => <AddIssue {...props} />,
      headerLeft: props => <FilterIssue {...props} />,
    });
  }, [navigation]);

  const FilterIssue = () => {
    return (
      <View style={{}}>
        <IconButton
          icon="menu"
          iconColor={colorTheme.greyLight}
          //iconColor={MD3Colors.error50}
          size={20}
          onPress={() => console.log('Pressed')}
        />
      </View>
    );
  };

  const AddIssue = () => {
    return (
      <View style={{}}>
        <IconButton
          icon="plus-circle"
          iconColor={colorTheme.greyLight}
          //iconColor={MD3Colors.error50}
          size={20}
          onPress={() => console.log('Pressed')}
        />
      </View>
    );
  };

  const HeaderTab = () => {
    return (
      <View
        style={{
          backgroundColor: colorTheme.headerTab,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: 50,
        }}>
        <View style={[styles.headRow, {width: 100}]}>
          <Text style={styles.headText}>Date d'ajout</Text>
        </View>
        <View style={[styles.headRow, {width: 80, alignItems: 'center'}]}>
          <Text style={styles.headText}>Type</Text>
        </View>
        <View style={[styles.headRow, {width: 80, alignItems: 'center'}]}>
          <Text style={styles.headText}>Priorité</Text>
        </View>
        <View style={[styles.headRow, {flex: 2}]}>
          <Text style={styles.headText}>Demande</Text>
        </View>
        <View style={[styles.headRow, {width: 80}]}>
          <Text style={styles.headText}>Status</Text>
        </View>
        <View style={[styles.headRow, {width: 80}]}>
          <Text style={styles.headText}>Assigné à</Text>
        </View>
      </View>
    );
  };

  const renderItem = ({item}) => {
    return <RowListItem />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={[0, 1, 2, 3, 4, 5]}
        renderItem={renderItem}
        ListHeaderComponent={() => <HeaderTab />}
        contentContainerStyle={{
          marginTop: 20,
          flexDirection: 'column',
          flexWrap: 'wrap',
        }}
        ItemSeparatorComponent={() => (
          <View style={{height: 10, backgroundColor: 'orange'}} />
        )}
        keyExtractor={item => item.id}
      />
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
  headText: {fontSize: 14, fontWeight: '600'},
  headRow: {
    paddingHorizontal: 4,

    paddingVertical: 8,
  },
});
