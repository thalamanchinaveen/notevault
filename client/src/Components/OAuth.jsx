import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logInSuccess } from "../Redux/user/userSlice";
import axios from "axios";
axios.defaults.withCredentials = true
export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await axios.post("http://localhost:8000/api/auth/google", {
        username: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      },{withCredentials:true});

      dispatch(logInSuccess(res.data));
      navigate("/");
    } catch (error) {
      console.log("could not sign in with google", error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-yellow-400 text-black px-4 py-2 rounded-full w-full focus:outline-none hover:bg-yellow-600 mt-2 disbled:opacity-80"
    >
      Continue with google
    </button>
  );
}
