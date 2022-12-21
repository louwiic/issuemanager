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
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ActivityIndicator, Avatar, TextInput} from 'react-native-paper';
import RowListItem from '../../components/RowListItem';
import colorTheme from '../../config/theme';
import {IconButton, Button} from 'react-native-paper';
import {UserContext} from '../../context/UserContext';
import {Icon} from 'react-native-paper/lib/typescript/components/Avatar/Avatar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Stats from '../../components/Stats';
import {Issue} from '../../type/IssueType';

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
  const [issuesList, setIssuesList] = useState<Issue[]>([]);
  const {user} = useContext<UserContextProps>(UserContext);
  const [loading, setLoading] = useState<Boolean>(false);
  const [numberIssueHigthPrio, setNumberIssueHigthPrio] = useState<Number>(0);
  const [numberNewIssues, setNumberNewIssues] = useState<Number>(0);
  const [numberIssuesDone, setNumberIssuesDone] = useState<Number>(0);
  const insets = useSafeAreaInsets();
  const issuesQuery = firestore().collection('issues');
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Get stats - number of issues with ermengy priority
   */
  useEffect(() => {
    const subscriber = () => {
      const docRef = firestore().collection('issues');

      const queryStatEmergency = docRef.where('priority', '==', 'higth');
      queryStatEmergency.onSnapshot(querySnapshot => {
        const issues = [];
        querySnapshot.forEach(documentSnapshot => {
          issues.push(documentSnapshot.data());
        });
        const priorityHigthCount = issues.length;
        setNumberIssueHigthPrio(priorityHigthCount);
      });

      /* query new issue */
      const queryStatNew = docRef.where('status', '==', 'new');
      queryStatNew.onSnapshot(querySnapshot => {
        const newIssues = [];
        querySnapshot.forEach(documentSnapshot => {
          newIssues.push(documentSnapshot.data());
        });
        const newIssuesCount = newIssues.length;
        setNumberNewIssues(newIssuesCount);
      });

      /* query done issue */
      const queryStatDone = docRef.where('status', '==', 'done');
      queryStatDone.onSnapshot(querySnapshot => {
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
    loadIssues();
  }, []);

  const loadIssues = () => {
    const docRef = firestore().collection('issues');
    const subscriber = docRef
      //.orderBy('date', 'desc')
      //.limit(4)
      .onSnapshot(querySnapshot => {
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
  };

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

  const handleSearch = () => {
    if (!Boolean(searchQuery)) return loadIssues();
    issuesQuery
      .where('ref', '==', searchQuery)
      .get()
      .then(querySnapshot => {
        const searchResults = [];
        querySnapshot.forEach(documentSnapshot => {
          searchResults.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        console.log(' *** searchResults ***', searchResults);
        setIssuesList(searchResults);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={true}>
        <View style={styles.ticketsContainer}>
          <Image style={{}} source={require('../../assets/logo.png')} />
          <Text style={styles.ticketsText}>Outils de gestion des demandes</Text>
        </View>
        <View style={{marginHorizontal: 16, marginTop: 30}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              mode="outlined"
              value={searchQuery}
              onChangeText={text => setSearchQuery(text)}
              onSubmitEditing={handleSearch}
              placeholder="Ex : #lbx"
              returnKeyLabel="Rechercher"
              returnKeyType="search"
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                flex: 1,
                fontSize: 16,
              }}
            />
            <IconButton
              icon="magnify"
              iconColor={colorTheme.inprogress}
              size={30}
              onPress={handleSearch}
            />
          </View>
          <Text
            style={{
              fontSize: 12,
              marginTop: 10,
              fontWeight: '300',
              fontStyle: 'italic',
            }}>
            Vous pouvez effectuer la recherche d'un ticket en tapant sa
            référence ci-dessus ☝️
          </Text>
          <Stats
            numberNewIssues={numberNewIssues.toString()}
            numberIssuesDone={numberIssuesDone.toString()}
            numberIssueHigthPrio={numberIssueHigthPrio.toString()}
          />
          <FlatList
            horizontal
            data={issuesList}
            renderItem={renderItem}
            ListEmptyComponent={() => (
              <View style={{marginVertical: 16}}>
                <Text style={{fontSize: 16}}>Il n'y pas de ticket</Text>
              </View>
            )}
            ListHeaderComponent={() => (
              <>
                <HeaderTab />
              </>
            )}
            contentContainerStyle={{
              //minHeight: '100%',
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
      </ScrollView>
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
    </SafeAreaView>
  );
};

HomeView.defaultProps = {};
export default HomeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  ticketsContainer: {
    marginTop: 20,
    alignItems: 'center',
    marginLeft: 16,
  },
  ticketsText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
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
    marginHorizontal: 16,
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
