import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import React, {FC, ReactElement, useContext, useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Avatar, Button, HelperText, TextInput} from 'react-native-paper';
import colorTheme from '../config/theme';
import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {UserContext} from '../context/UserContext';
import BottomSheet from '@gorhom/bottom-sheet';
import MyBottomSheet from '../components/MyBottomSheet';
import {Controller, Resolver, useForm} from 'react-hook-form';
import ModalPicker from '../components/ModalPicker';
import {Issue} from '../type/IssueType';

const PickerComponent = ({type, selected, items}) => {
  return (
    <View>
      <Picker
        selectedValue={type?.value}
        accessibilityLabel="Basic Picker Accessibility Label"
        onValueChange={(itemValue: string | number, itemIndex: number) => {
          selected({
            value: itemValue,
            label: items[itemIndex].label,
          });
        }}>
        {items.map((item, index) => {
          return (
            <Picker.Item key={index} label={item.label} value={item.value} />
          );
        })}
      </Picker>
    </View>
  );
};

interface UserContextProps {
  user: FirebaseAuthTypes.User;
  setUser: (newValue: object) => void;
}

type IssueProps = {
  isConnected?: boolean;
};

type BottomSheetValues = {
  label: string;
  value: string;
};

type FormValues = {
  status: BottomSheetValues;
  priority: BottomSheetValues;
  description: string;
  users: object;
};

const resolver: Resolver<FormValues> = async values => {
  return {
    values: values.status ? values : {},
    errors: !values.status
      ? {
          status: {
            type: 'required',
            message: 'Choissisez un status',
          },
        }
      : !values.priority
      ? {
          priority: {
            type: 'required',
            message: 'Choissisez la priorité',
          },
        }
      : !values.description
      ? {
          description: {
            type: 'required',
            message: 'Ajouter une description',
          },
        }
      : !values.users
      ? {
          description: {
            type: 'required',
            message: 'Vous devez choisir un utilisateur',
          },
        }
      : {},
  };
};

const AddIssueView: FC<IssueProps> = ({}): ReactElement => {
  const navigation = useNavigation();
  const route = useRoute();
  const {issue, cb}: {issue: Issue; cb: () => void} = route?.params || {};
  const {user, setUser} = useContext<UserContextProps>(UserContext);
  const [userList, setUserList] = useState<BottomSheetValues[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    control,
    watch,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm<FormValues>({
    resolver,
    defaultValues: {
      status: {label: 'Nouveau', value: 'new'},
      priority: {label: 'Normal', value: 'normal'},
    },
  });
  const [modalVisible1, setModalVisible1] = useState<Boolean>(false);
  const [modalVisible2, setModalVisible2] = useState<Boolean>(false);
  const [modalVisible3, setModalVisible3] = useState<Boolean>(false);
  const [title, setTitle] = useState('Créer une demande');
  const priorityValue = watch('priority');
  const statusValue = watch('status');
  const userValue = watch('users');
  const issueRef = firestore().collection('issues');
  const usersRef = firestore().collection('users');

  useEffect(() => {
    if (!!issue && user) {
      setTitle(
        issue.ref ? 'Modifier le demande ' + issue?.ref : 'Modifier le demande',
      );
      setValue('status', {label: issue.status, value: issue.status});
      setValue('priority', {label: issue.priority, value: issue.priority});
      setValue('description', issue.request);
    }
  }, [issue]);

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    setLoading(true);

    usersRef
      .get()
      .then(snapshot => {
        const users = [];
        snapshot.forEach(doc => {
          users.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        const userFormatted = users?.map(item => {
          return {
            label: item?.nickname,
            value: item?.uid,
          };
        });
        if (!!issue) {
          setValue(
            'users',
            userFormatted.filter(u => u.value === issue.assignTo.id)?.[0],
          );
        }
        setUserList(userFormatted);

        setLoading(false);
      })
      .catch(error => {
        // Gestion de l'erreur
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function LogoutButton() {
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

  /*  useEffect(() => {
    const fetchUsers = async () => {};

    fetchUsers();
  }, []); */

  const generateFakeRef = () => {
    const characters = '123456789';
    let fakeRef = '';

    for (let i = 0; i < 3; i++) {
      fakeRef += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    return fakeRef;
  };

  const onSubmit = async data => {
    const userId = data?.users?.value;
    const ref = firestore().collection('users').doc(userId);
    const obj = {
      author: `${user.uid}`,
      assignTo: ref,
      date: firestore.FieldValue.serverTimestamp(),
      priority: data.priority.value,
      status: data.status.value,
      type: 'Maintenance',
      request: data.description,
      ref: `#${generateFakeRef()}`,
    };

    try {
      if (!!issue) {
        const docRefUpdated = issueRef.doc(issue.id);
        await docRefUpdated.set(obj);
        Alert.alert('Infos', 'Votre ticket a bien été mise à jour !');
        cb();
        navigation.goBack();

        return;
      }
      const docRef = await issueRef.add(obj);
      if (docRef?.id) {
        Alert.alert('Infos', 'Votre ticket a bien été créé !');
        cb();
        navigation.goBack();
      }
    } catch (error) {}
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={{flex: 1}}>
        <View style={styles.ticketsContainer}>
          <Text style={styles.ticketsText}>{title}</Text>
        </View>
        <View style={styles.content}>
          {/* Picker 1 */}
          <TextInput
            editable={false}
            mode="outlined"
            label="Status"
            value={statusValue?.label}
            onPressIn={() => setModalVisible1(true)}

            //onBlur={() => bottomSheetRef1.current.close()}
          />
          {errors.status && (
            <HelperText type="error" visible={errors.status}>
              {errors.status?.message}
            </HelperText>
          )}
          {/*   Status choice */}
          <ModalPicker
            modalVisible={modalVisible1}
            setModalVisible={setModalVisible1}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <PickerComponent
                  type={value}
                  selected={onChange}
                  items={[
                    {label: 'Nouveau', value: 'new'},
                    {label: 'En cours', value: 'inprogress'},
                    {label: 'Terminé', value: 'done'},
                  ]}
                />
              )}
              name="status"
            />
          </ModalPicker>

          {/* Picker type */}
          <View style={{marginTop: 10}}>
            <TextInput
              editable={false}
              mode="outlined"
              label="Priorité"
              value={priorityValue?.label}
              onPressIn={() => setModalVisible2(true)}
            />
          </View>
          {errors.priority && (
            <HelperText type="error" visible={errors.priority}>
              {errors.priority?.message}
            </HelperText>
          )}
          <ModalPicker
            modalVisible={modalVisible2}
            setModalVisible={setModalVisible2}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <PickerComponent
                  type={value}
                  selected={onChange}
                  items={[
                    {label: 'Normal', value: 'normal'},
                    {label: 'Urgent', value: 'higth'},
                    {label: 'Prioritaire', value: 'emergency'},
                  ]}
                />
              )}
              name="priority"
            />
          </ModalPicker>

          {/* Description */}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                numberOfLines={4}
                style={{
                  height: 100,
                  marginTop: 10,
                }}
                mode="outlined"
                label="Description"
                placeholder=" "
              />
            )}
            name="description"
          />
          {errors.description && (
            <HelperText type="error" visible={errors.description}>
              {errors.description?.message}
            </HelperText>
          )}

          {/* Picker user */}
          <View style={{marginTop: 10}}>
            <TextInput
              editable={false}
              mode="outlined"
              label="Utilisateurs"
              value={userValue?.label}
              onPressIn={() => setModalVisible3(true)}
            />
          </View>
          {errors.users && (
            <HelperText type="error" visible={errors.users}>
              {errors.users?.message}
            </HelperText>
          )}
          <ModalPicker
            modalVisible={modalVisible3}
            setModalVisible={setModalVisible3}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <PickerComponent
                  type={value}
                  selected={onChange}
                  items={userList}
                />
              )}
              name="users"
            />
          </ModalPicker>

          <Button
            mode="contained"
            style={{marginTop: 40}}
            onPress={handleSubmit(onSubmit)}>
            Envoyer
          </Button>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

AddIssueView.defaultProps = {};
export default AddIssueView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    marginHorizontal: '4%',
    marginTop: 30,
  },
  contentBottomSheet: {
    backgroundColor: colorTheme.bottomsheetbg,

    flex: 1,
  },
  ticketsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  ticketsText: {
    fontSize: 26,
    fontWeight: 'bold',
  },
});
