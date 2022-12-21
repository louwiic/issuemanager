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
import {ActivityIndicator, Avatar} from 'react-native-paper';
import RowListItem from '../../components/RowListItem';
import colorTheme from '../../config/theme';
import {IconButton, Button} from 'react-native-paper';
import {UserContext} from '../../context/UserContext';
import {Icon} from 'react-native-paper/lib/typescript/components/Avatar/Avatar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

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
  const [loading, setLoading] = useState<Boolean>(false);
  const [numberIssueHigthPrio, setNumberIssueHigthPrio] = useState<Number>(0);
  const [numberNewIssues, setNumberNewIssues] = useState<Number>(0);
  const [numberIssuesDone, setNumberIssuesDone] = useState<Number>(0);
  const insets = useSafeAreaInsets();
  const issuesRef = firestore().collection('issues');

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

  /**
   * Get stats - number of issues with ermengy priority
   */
  useEffect(() => {
    const subscriber = () => {
      const queryStatEmergency = issuesRef.where('priority', '==', 'emergency');
      queryStatEmergency.get().then(querySnapshot => {
        const issues = [];
        querySnapshot.forEach(documentSnapshot => {
          issues.push(documentSnapshot.data());
        });
        const priorityHigthCount = issues.length;
        setNumberIssueHigthPrio(priorityHigthCount);
      });
      /* query new issue */
      const queryStatNew = issuesRef.where('status', '==', 'new');
      queryStatNew.get().then(querySnapshot => {
        const newIssues = [];
        querySnapshot.forEach(documentSnapshot => {
          newIssues.push(documentSnapshot.data());
        });
        const newIssuesCount = newIssues.length;
        setNumberNewIssues(newIssuesCount);
      });
      /* query new issue */
      const queryStatDone = issuesRef.where('status', '==', 'done');
      queryStatDone.get().then(querySnapshot => {
        const issuesDone = [];
        querySnapshot.forEach(documentSnapshot => {
          issuesDone.push(documentSnapshot.data());
        });
        const issuesDoneCount = issuesDone.length;
        setNumberIssuesDone(issuesDoneCount);
      });
    };
    subscriber();
  }, []);

  /**
   * Get all issues
   */
  useEffect(() => {
    setLoading(true);
    const subscriber = issuesRef.limit(4).onSnapshot(querySnapshot => {
      const issues = [];
      querySnapshot.forEach(issueDoc => {
        // get issues data
        const issueData = issueDoc.data();

        // get ref user assigned to issue
        const assignTo = issueData.assignTo;

        // filters user with id
        const usersRef = firestore()
          .collection('users')
          .where('uid', '==', assignTo.id);

        // get user info affected to issue
        usersRef.get().then(querySnapshot => {
          setLoading(false);

          querySnapshot.forEach(userDoc => {
            const userData = userDoc.data();
            issues.push({
              ...issueDoc.data(),
              key: issueDoc.id,
              ...{userAssigned: userData},
            });
            setIssuesList(issues);
          });
        });
      });
    });
    return () => subscriber();
  }, []);

  const HeaderTab = () => {
    return (
      <View style={styles.headerContainerTab}>
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

  if (loading) {
    return <ActivityIndicator />;
  }
  return (
    <View style={styles.container}>
      <View style={{marginHorizontal: '4%'}}>
        <View style={styles.ticketsContainer}>
          <Text style={styles.ticketsText}>Tickets</Text>
        </View>
        <View style={styles.statsContainer}>
          <View
            style={[styles.statContainer, {backgroundColor: colorTheme.done}]}>
            <Text style={styles.statNumber}>{numberIssuesDone.toString()}</Text>
            <Text style={styles.statText}>Terminé</Text>
          </View>
          <View
            style={[styles.statContainer, {backgroundColor: colorTheme.higth}]}>
            <Text style={styles.statNumber}>
              {numberIssueHigthPrio.toString()}
            </Text>
            <Text style={styles.statText}>Priorité élévé</Text>
          </View>
          <View
            style={[styles.statContainer, {backgroundColor: colorTheme.new}]}>
            <Text style={styles.statNumber}>{numberNewIssues.toString()}</Text>
            <Text style={styles.statText}>A traiter</Text>
          </View>
        </View>
        <FlatList
          horizontal
          data={issuesList}
          renderItem={renderItem}
          ListHeaderComponent={() => <HeaderTab />}
          contentContainerStyle={{
            marginTop: 20,
            flexDirection: 'column',
          }}
          keyExtractor={item => item.id}
        />

        <View style={{marginTop: 20, width: 120}}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              //
            }}
            style={{
              height: 30,
              padding: 8,
              backgroundColor: colorTheme.main,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
            }}>
            <Text style={{fontSize: 14, color: colorTheme.white}}>
              Voir plus
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/*  add issue button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          !!user
            ? navigation.navigate('ProfileView')
            : navigation.navigate('AuthStack');
        }}
        style={[styles.btnAddContainer, {bottom: insets.bottom + 10}]}>
        <Text style={styles.textBtn}>+</Text>
      </TouchableOpacity>
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
  headerContainerTab: {
    backgroundColor: colorTheme.headerTab,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
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
  btnAddContainer: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: colorTheme.main,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
  },
  textBtn: {
    fontSize: 32,
    color: colorTheme.white,
    fontWeight: '500',
  },
});
