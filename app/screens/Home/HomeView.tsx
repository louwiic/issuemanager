import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';

import React, {
  FC,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
import colorTheme from '../../config/theme';
import {IconButton, Button} from 'react-native-paper';
import {UserContext} from '../../context/UserContext';
import {Icon} from 'react-native-paper/lib/typescript/components/Avatar/Avatar';

type ChildProps = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

interface UserContextProps {
  user: string;
  setUser: (newValue: string) => void;
}

/**
 * HomeView
 * List All Issues
 *
 */
const HomeView: FC<ChildProps> = ({navigation}): ReactElement => {
  const [issuesList, setIssuesList] = useState([]);
  const {user} = useContext<UserContextProps>(UserContext);
  const [numberIssueHigthPrio, setNumberIssueHigthPrio] = useState<Number>(0);
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: props => <AddIssue {...props} />,
      headerLeft: props => <FilterIssue {...props} />,
    });
  }, [navigation, user]);

  const FilterIssue = () => {
    return (
      <View>
        <IconButton
          icon="tune"
          iconColor={colorTheme.greyLight}
          size={20}
          onPress={() => console.log('Pressed')}
        />
      </View>
    );
  };

  const AddIssue = () => {
    return (
      <View>
        <IconButton
          icon="plus-circle"
          iconColor={colorTheme.greyLight}
          size={20}
          onPress={() => {
            !!user
              ? navigation.navigate('ProfileView')
              : navigation.navigate('AuthStack');
          }}
        />
      </View>
    );
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('issues')
      .onSnapshot(querySnapshot => {
        const issues = [];

        querySnapshot.forEach(issueDoc => {
          // Récupération des données de l'issue
          const issueData = issueDoc.data();

          // Récupération de la référence de l'utilisateur assigné
          const assignTo = issueData.assignTo;

          // Filtrage des documents de la collection "users" en fonction de leur référence
          const usersRef = firestore()
            .collection('users')
            .where('uid', '==', assignTo.id);

          // Récupération des données de tous les utilisateurs correspondant à la référence
          usersRef.get().then(querySnapshot => {
            querySnapshot.forEach(userDoc => {
              // Récupération des données de l'utilisateur
              const userData = userDoc.data();
              // Stockage des données de l'utilisateur dans le tableau de correspondance
              // usersData['userAssigned'] = userData;
            });
          });

          issues.push({
            ...issueDoc.data(),
            key: issueDoc.id,
            //...{userAssigned: userData},
          });
          const priorityHigth = issues.filter(i => i.priority === 'higth');
          const priorityHigthCount = priorityHigth.length;
          setNumberIssueHigthPrio(priorityHigthCount);
          // Mise à jour de la liste des issues
          setIssuesList(issues);
        });
      });
    return () => subscriber();
  }, []);

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
    const ref = item.key?.slice(0, 3);

    return <RowListItem key={ref} issue={item} />;
  };

  return (
    <View style={styles.container}>
      <View style={{marginHorizontal: '4%'}}>
        {/*  <View style={styles.ticketsContainer}>
          <Text style={styles.ticketsText}>Tickets</Text>
        </View>
        <View style={styles.statsContainer}>
          <View
            style={[styles.statContainer, {backgroundColor: colorTheme.new}]}>
            <Text style={styles.statNumber}>1{numberIssueHigthPrio}</Text>
            <Text style={styles.statText}>A traiter</Text>
          </View>
          <View
            style={[styles.statContainer, {backgroundColor: colorTheme.higth}]}>
            <Text style={styles.statNumber}>{numberIssueHigthPrio}</Text>
            <Text style={styles.statText}>Priorité élévé</Text>
          </View>
          <View
            style={[
              styles.statContainer,
              {backgroundColor: colorTheme.inprogress},
            ]}>
            <Text style={styles.statNumber}>4{numberIssueHigthPrio}</Text>
            <Text style={styles.statText}>A traiter</Text>
          </View>
        </View> */}
        <FlatList
          horizontal
          data={issuesList}
          renderItem={renderItem}
          ListHeaderComponent={() => <HeaderTab />}
          contentContainerStyle={{
            marginTop: 20,
            flexDirection: 'column',
          }}
          ItemSeparatorComponent={() => (
            <View style={{height: 10, backgroundColor: 'orange'}} />
          )}
          keyExtractor={item => item.id}
        />
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
  headText: {fontSize: 14, fontWeight: '600'},
  headRow: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  containerStat: {
    marginHorizontal: '4%',
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
    justifyContent: 'space-between',
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
