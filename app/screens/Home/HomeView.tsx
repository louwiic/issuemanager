import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import moment from 'moment';

import React, {FC, ReactElement} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import {colorTheme} from '../../config/theme';

type ChildProps = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

const HomeView: FC<ChildProps> = (
  {
    /* destructured props */
  },
): ReactElement => {
  const marginHorizontal = 4;
  const cols = 3;
  const width =
    Dimensions.get('window').width / cols - marginHorizontal * (cols + 1);

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
  const Row = () => {
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
          <TouchableOpacity style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: 14,
                color: colorTheme.regularBlue,
                fontWeight: '600',
              }}>
              #34{' '}
            </Text>
            <Text numberOfLines={2} style={{fontSize: 12}}>
              Bug lorsqu'on clique sur le bouton participer à un évenement Bug
            </Text>
          </TouchableOpacity>
        </View>
        {/* Status */}
        <View style={{width: 80, padding: 4}}>
          <Text style={{fontSize: 12}}>Status</Text>
        </View>
        {/* Assign to */}
        <View style={{width: 80, padding: 4, alignItems: 'center'}}>
          <Avatar.Image size={48} />
        </View>
      </View>
    );
  };

  const Item = ({title}) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  const renderItem = ({item}) => <Row />;

  return (
    <View style={styles.container}>
      {/*  <View style={{}}>
        <Text style={{fontSize: 12}}>Home view</Text>
      </View> */}
      {/* Issue  List */}

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
