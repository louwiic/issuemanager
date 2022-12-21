import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import React, {
  FC,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar, Button, HelperText, TextInput} from 'react-native-paper';
import colorTheme from '../config/theme';
import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {UserContext} from '../context/UserContext';
import BottomSheet from '@gorhom/bottom-sheet';
import MyBottomSheet from '../components/MyBottomSheet';
import {Controller, Resolver, useForm} from 'react-hook-form';

const PickerComponent = ({type, selected, items}) => {
  return (
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
  );
};

interface UserContextProps {
  user: FirebaseAuthTypes.User;
  setUser: (newValue: object) => void;
}

type ChildProps = {
  route?: RouteProp<ParamListBase>;
  isConnected?: boolean;
  cb: () => void;
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

const AddIssueView: FC<ChildProps> = ({cb}): ReactElement => {
  const [type, setType] = useState<BottomSheetValues>({
    label: '',
    value: '',
  });
  const [priority, setPriority] = useState<object>({
    label: '',
    value: '',
  });

  const [open, setOpen] = useState<Boolean>(false);
  const [date, setDate] = useState(new Date());
  const navigation = useNavigation();
  const {user, setUser} = useContext<UserContextProps>(UserContext);
  const [userList, setUserList] = useState<BottomSheetValues[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    control,
    watch,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>({
    resolver,
    defaultValues: {
      status: {label: 'Nouveau', value: 'new'},
      priority: {label: 'Normal', value: 'normal'},
    },
  });

  const bottomSheetRef1 = useRef<BottomSheet>(null);
  const bottomSheetRef2 = useRef<BottomSheet>(null);
  const bottomSheetRef3 = useRef<BottomSheet>(null);
  const priorityValue = watch('priority');
  const statusValue = watch('status');
  const userValue = watch('users');
  const issueRef = firestore().collection('issues');
  const usersRef = firestore().collection('users');

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

  const onSubmit = async data => {
    const userId = data?.users?.value;
    const ref = firestore().collection('users').doc(userId);
    //assignTo: `/users/${data.users.value}`,

    const issue = {
      author: `${user.uid}`,
      assignTo: ref,
      date: firestore.FieldValue.serverTimestamp(),
      priority: data.priority.value,
      status: data.status.value,
      type: 'Maintenance',
      request: data.description,
    };

    try {
      const docRef = await issueRef.add(issue);
      if (docRef?.id) {
        Alert.alert('Infos', 'Votre ticket a bien été créé !');
        cb();
        navigation.goBack();
      }
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.ticketsContainer}>
        <Text style={styles.ticketsText}>Créer une demande</Text>
      </View>
      <View style={styles.content}>
        {/* Picker 1 */}
        <TextInput
          editable={false}
          mode="outlined"
          label="Status"
          value={statusValue?.label}
          onPressIn={() => bottomSheetRef1.current.snapToIndex(1)}
          onBlur={() => bottomSheetRef1.current.close()}
        />
        {errors.status && (
          <HelperText type="error" visible={errors.status}>
            {errors.status?.message}
          </HelperText>
        )}
        <MyBottomSheet
          ref={bottomSheetRef1}
          snapPoints={['2%', '45%']}
          onChange={(index: number) => {
            if (index == 0) {
              bottomSheetRef1.current.close();
            }
          }}>
          <View style={styles.contentBottomSheet}>
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
            <Button
              mode="contained"
              style={{marginHorizontal: 10}}
              onPress={() => bottomSheetRef1.current.close()}>
              Sélectionner
            </Button>
          </View>
        </MyBottomSheet>
        {/* Picker type */}
        <View style={{marginTop: 10}}>
          <TextInput
            editable={false}
            mode="outlined"
            label="Priorité"
            value={priorityValue?.label}
            onPressIn={() => bottomSheetRef2.current.snapToIndex(1)}
          />
        </View>
        {errors.priority && (
          <HelperText type="error" visible={errors.priority}>
            {errors.priority?.message}
          </HelperText>
        )}
        <MyBottomSheet
          ref={bottomSheetRef2}
          snapPoints={['2%', '45%']}
          onChange={(index: number) => {
            if (index == 0) {
              bottomSheetRef2.current.close();
            }
          }}>
          <View style={styles.contentBottomSheet}>
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
            <Button
              mode="contained"
              style={{marginHorizontal: 10}}
              onPress={() => bottomSheetRef2.current.close()}>
              Sélectionner
            </Button>
          </View>
        </MyBottomSheet>
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
            onPressIn={() => bottomSheetRef3.current.snapToIndex(1)}
          />
        </View>
        {errors.users && (
          <HelperText type="error" visible={errors.users}>
            {errors.users?.message}
          </HelperText>
        )}
        <MyBottomSheet
          ref={bottomSheetRef3}
          snapPoints={['2%', '45%']}
          onChange={(index: number) => {
            if (index == 0) {
              bottomSheetRef3.current.close();
            }
          }}>
          <View style={styles.contentBottomSheet}>
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
            <Button
              mode="contained"
              style={{marginHorizontal: 10}}
              onPress={() => bottomSheetRef3.current.close()}>
              Sélectionner
            </Button>
          </View>
        </MyBottomSheet>
        <Button
          mode="contained"
          style={{marginTop: 40}}
          onPress={handleSubmit(onSubmit)}>
          Envoyer
        </Button>
      </View>
    </View>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
