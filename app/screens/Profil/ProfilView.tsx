import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useIsFocused,
} from '@react-navigation/native';
import React, {FC, ReactElement, useContext, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {UserContext} from '../../context/UserContext';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import moment from 'moment';
import colorTheme from '../../config/theme';
import {ActivityIndicator} from 'react-native-paper';
import {statusColor, statusTypeLabel} from '../../helpers/helpers';
import {Issue} from '../../type/IssueType';

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
  const [userIssuesList, setUserIssuesList] = useState<Issue[]>([]);
  const {user, setUser} = useContext<UserContextProps>(UserContext);
  const [loading, setLoading] = useState<Boolean>(false);
  const collectionRef = firestore().collection('issues');
  const [userInfos, setUserInfos] = useState<FirebaseAuthTypes.User>(null);
  const [filter, setFilter] = useState<string>('assignMe');
  const [userAssignToIssue, setUserAssignToIssue] = useState([]);

  useEffect(() => {
    if (user) {
      loadIssues();
      loadUserProfil();
    }
  }, [user]);

  /**
   * get info user profil
   */
  const loadUserProfil = async () => {
    const usersRef = firestore().collection('users');
    const query = usersRef.where('uid', '==', user.uid);
    const snapshot = await query.get();
    snapshot.forEach(doc => {
      const user = doc.data();
      setUserInfos(user);
    });
  };

  const getUserAssignTo = async (id: string) => {
    const userDoc = firestore()
      .collection('users')
      .where('uid', '==', id)
      .get();

    userDoc.then(querySnapshot => {
      const u = [];
      setLoading(false);
      querySnapshot.forEach(userDoc => {
        const userData = userDoc.data();
        u.push({
          ...userData,
          key: userData.id,
        });
      });
      setUserAssignToIssue(u);
    });
  };

  /**
   * get issue assigned to me or issue added
   * @param filter
   */
  const loadIssues = async (filter = 'assignMe') => {
    setLoading(true);
    try {
      const snapRef = await firestore().doc(`users/${user?.uid}`).get();
      const userRef = snapRef.ref;
      const query =
        filter == 'assignMe'
          ? collectionRef.where('assignTo', '==', userRef)
          : collectionRef.where('author', '==', user?.uid);
      const snapshot = await query.get();
      const userTasks = [];
      snapshot.forEach(doc => {
        const assignTo = doc.data().assignTo;
        getUserAssignTo(assignTo.id);

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

  /**
   * Delete an issue
   * @param item
   * @returns
   */
  const handleDeleteIssue = (item: Issue) => {
    if (filter === 'assignMe') {
      return Alert.alert(
        'Attention',
        "Vous devez être l'auteur du ticket pour pouvoir le supprimer",
      );
    }
    Alert.alert('Suppression', 'Voulez-vous supprimer cette demande', [
      {
        text: 'Annuler',
        onPress: () => {},
      },
      {
        text: 'Supprimer',
        onPress: () => deleteTask(),
      },
    ]);
  };

  const deleteTask = async () => {
    const docRef = collectionRef.doc(item.id);
    await docRef.delete();

    Alert.alert('Informations', 'Votre ticket a bien été supprimé');
    loadIssues();
  };

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
                {/* Filter show issue */}
                <View style={styles.buttonsContainer}>
                  <View style={[{flex: 1}]}>
                    <TouchableOpacity
                      style={[
                        styles.myrequestBtn,
                        {
                          backgroundColor:
                            filter === 'request'
                              ? colorTheme.active
                              : colorTheme.disabled,
                        },
                      ]}
                      activeOpacity={0.7}
                      onPress={() => {
                        setFilter('request');
                        loadIssues('request');
                      }}>
                      <Text style={styles.addButtonText}>Mes demandes</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{width: 10}} />
                  <View style={[{flex: 1}]}>
                    <TouchableOpacity
                      style={[
                        styles.assignBtn,
                        {
                          backgroundColor:
                            filter === 'assignMe'
                              ? colorTheme.active
                              : colorTheme.disabled,
                        },
                      ]}
                      activeOpacity={0.7}
                      onPress={() => {
                        setFilter('assignMe');
                        loadIssues('assignMe');
                      }}>
                      <Text style={styles.logoutButtonText}>Assigné à moi</Text>
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
          const userAssigned = userAssignToIssue.filter(
            u => u.uid === item.assignTo.id,
          )?.[0];
          return (
            <View style={styles.containerItem}>
              <TouchableOpacity
                activeOpacity={0.7}
                onLongPress={() => handleDeleteIssue(item)}
                onPress={() => {
                  navigation.navigate('AddIssueView', {
                    issue: item,
                    cb: () => {
                      loadUserProfil();
                      loadIssues();
                    },
                  });
                }}
                style={{}}>
                <View style={styles.statusContainer}>
                  {statusColor(item?.status)}
                  <Text style={{paddingLeft: 5, fontWeight: 'bold'}}>
                    {statusTypeLabel(item.status)}
                  </Text>
                  <View style={styles.dateContainer}>
                    <Text>{isssueDate}</Text>
                  </View>
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={styles.descriptionTitle}>Description :</Text>
                  <Text style={styles.descriptionText}>{item.request}</Text>
                </View>
                {!!userAssigned && (
                  <>
                    <View
                      style={{
                        height: 1,
                        width: '100%',
                        backgroundColor: colorTheme.new,
                        marginVertical: 8,
                      }}
                    />
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontSize: 12}}>Assigner à :</Text>
                      <Text style={{fontSize: 12}}>
                        {userAssigned.nickname}
                      </Text>
                    </View>
                  </>
                )}
              </TouchableOpacity>
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
    backgroundColor: colorTheme.active,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  myrequestBtn: {
    flex: 2,
    height: 60,
    backgroundColor: colorTheme.active,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  assignBtn: {
    flex: 2,
    height: 60,
    backgroundColor: colorTheme.active,
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
    backgroundColor: colorTheme.active,
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
