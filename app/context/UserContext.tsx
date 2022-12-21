import React, {useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

interface UserContextProps {
  user: string;
  setUser: (newValue: string) => void;
}

const UserContext = React.createContext<UserContextProps>();

function UserProvider({children}) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const handleAuthStateChanged = user => {
    setUser(user);
  };

  React.useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(handleAuthStateChanged);
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
}

export {UserContext, UserProvider};
