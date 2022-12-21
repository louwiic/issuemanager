import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useIsFocused,
} from '@react-navigation/native';
import React, {FC, ReactElement, useContext, useEffect, useState} from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {UserContext} from '../../context/UserContext';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import moment from 'moment';
import colorTheme from '../../config/theme';
import {ActivityIndicator} from 'react-native-paper';
import {statusColor} from '../../helpers/helpers';

type ChildProps = {
  //define props
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

interface UserContextProps {
  user: FirebaseAuthTypes.User;
  setUser: (newValue: object) => void;
}

const ProfilView: FC<ChildProps> = ({navigation}): ReactElement => {
  const [userIssuesList, setUserIssuesList] = useState<
    FirebaseFirestoreTypes.FieldValue[]
  >([]);
  const {user, setUser} = useContext<UserContextProps>(UserContext);
  const [loading, setLoading] = useState<Boolean>(false);
  const collectionRef = firestore().collection('issues');
  const [userInfos, setUserInfos] = useState(null);

  useEffect(() => {
    if (user) {
      loadIssues();
      loadUserProfil();
    }
  }, [user]);

  const loadUserProfil = async () => {
    const usersRef = firestore().collection('users');

    const query = usersRef.where('uid', '==', user.uid);
    const snapshot = await query.get();
    snapshot.forEach(doc => {
      const user = doc.data();
      setUserInfos(user);
    });
  };

  const loadIssues = async () => {
    setLoading(true);

    try {
      const snapRef = await firestore().doc(`users/${user?.uid}`).get();
      const userRef = snapRef.ref;
      const query = collectionRef.where('assignTo', '==', userRef);
      const snapshot = await query.get();
      const userTasks = [];
      snapshot.forEach(doc => {
        userTasks.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUserIssuesList(userTasks);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  function logout() {
    auth().signOut();
    setUser(null);
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'HomeView',
        },
      ],
    });
  }

  if (loading)
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
        <Text style={{marginTop: 20}}>Chargment des données ...</Text>
      </View>
    );

  return (
    <View style={{flex: 1}}>
      {/* Issues List */}
      <FlatList
        data={userIssuesList}
        ListHeaderComponent={() => {
          return (
            <>
              <View style={styles.containerHeader}>
                <Text style={styles.greetingText}>
                  Bonjour 👋 {userInfos?.nickname}
                </Text>
                <View style={styles.buttonsContainer}>
                  <View style={styles.addButton}>
                    <TouchableOpacity
                      style={styles.addButton}
                      activeOpacity={0.7}
                      onPress={() => {
                        navigation.navigate('AddIssueView', {
                          cb: () => loadIssues(),
                        });
                      }}>
                      <Text style={styles.addButtonText}>
                        Ajouter un ticket
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{width: 10}} />
                  <View style={styles.logoutButton}>
                    <TouchableOpacity
                      style={styles.logoutButton}
                      activeOpacity={0.7}
                      onPress={logout}>
                      <Text style={styles.logoutButtonText}>Deconnexion</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          );
        }}
        contentContainerStyle={{marginHorizontal: '4%'}}
        ItemSeparatorComponent={() => (
          <View style={{height: 10}}>{/* Element */}</View>
        )}
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 40,
              }}>
              <Text style={{fontSize: 16, fontWeight: '600'}}>
                Vous n'avez pas de ticket à traiter
              </Text>
            </View>
          );
        }}
        renderItem={({item}) => {
          const t = item?.date;
          const isssueDate = moment(t?.toDate?.()).format('L à HH:mm');
          return (
            <View style={styles.containerItem}>
              <View style={styles.statusContainer}>
                {statusColor(item?.status)}
                <Text style={{paddingLeft: 5, fontWeight: 'bold'}}>
                  {item.status}
                </Text>
                <View style={styles.dateContainer}>
                  <Text>{isssueDate}</Text>
                </View>
              </View>
              <View style={{marginTop: 10}}>
                <Text style={styles.descriptionTitle}>Description :</Text>
                <Text style={styles.descriptionText}>{item.request}</Text>
              </View>
            </View>
          );
        }}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

ProfilView.propTypes = {};
ProfilView.defaultProps = {};
export default ProfilView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  containerHeader: {
    marginVertical: 20,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '600',
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: 'row',
  },
  addButton: {
    flex: 2,
    height: 90,
    backgroundColor: '#009688',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  logoutButton: {
    flex: 1,
    height: 90,
    backgroundColor: '#009688',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  containerItem: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    position: 'absolute',
    right: 10,
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionText: {
    marginTop: 5,
    fontWeight: '400',
    textAlign: 'justify',
  },
});
