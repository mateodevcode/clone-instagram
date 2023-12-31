import { doc, getDocs, setDoc } from "firebase/firestore";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/firebase";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import { collection, query, where } from "firebase/firestore";



const useSignUpWithEmailAndPassword = () => {
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const loginUser = useAuthStore(state => state.login)
  const showToast = useShowToast()

  const signup = async (inputs) => {
    if (!inputs.email || !inputs.password || !inputs.username || !inputs.fullName) {
        showToast("Error", "Por favor rellena los campos", "error");
        return
    } 
    

    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("username", "==", inputs.username));
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      showToast("Error", "Username already exists", "error")
      return
    }

    try {
        const newUser = await createUserWithEmailAndPassword(inputs.email,inputs.password)
        if (!newUser && error) {
          showToast("Error", error.message, "error");
          return
        }
        if (newUser) {
            const userDoc = {
              uid:newUser.user.uid,
              email:inputs.email,
              username:inputs.username,
              fullName:inputs.fullName,
              bio:"",
              profilePicURL:"",
              followers:[],
              following:[],
              posts:[],
              createAt:Date.now(),
            }

            await setDoc(doc(firestore, "users", newUser.user.uid), userDoc);
            localStorage.setItem("user-info",JSON.stringify(userDoc))
            loginUser(userDoc)
        }

    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return {loading,error,signup,user};
};

export default useSignUpWithEmailAndPassword;
