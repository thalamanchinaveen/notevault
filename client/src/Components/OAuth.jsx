import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logInSuccess } from "../Redux/user/userSlice";
import axios from "axios";
import api from "./api";

axios.defaults.withCredentials = true;

const authService = {
  signInWithGoogle: async (auth, provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      return {
        username: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      };
    } catch (error) {
      throw new Error(`Could not sign in with Google: ${error.message}`);
    }
  },
};

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const userData = await authService.signInWithGoogle(auth, provider);

      const res = await api.post(`/api/auth/google`, userData);

      dispatch(logInSuccess(res.data));
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-yellow-400 text-black px-4 py-2 rounded-full w-full focus:outline-none hover:bg-yellow-600 mt-2 disabled:opacity-80"
    >
      Continue with Google
    </button>
  );
}
