import { useRouter } from "next/dist/client/router";
import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

let initialState = {
  user: {
    username: "",
    token: "",
    avatar: "",
  },
};

if (typeof window !== "undefined") {
  if (localStorage.getItem("token")) {
    initialState.user.username = localStorage.getItem("username");
    initialState.user.token = localStorage.getItem("token");
    initialState.user.avatar = localStorage.getItem("avatar");
  }
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      return {
        ...state,
        user: action.payload,
      };
    }
    case "LOGOUT": {
      console.log("logout called");
      return { ...state, user: null };
    }
    default: {
      throw new Error(`Unhandled action type ${action.type}`);
    }
  }
};

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(authReducer, initialState);

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("avatar");
    }
    router.replace("/login");
    dispatch({ type: "LOGOUT" });
  };

  const login = ({ username, token, avatar }) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("avatar", avatar);
    }

    dispatch({ type: "LOGIN", payload: { username, token, avatar } });
  };

  return (
    <AuthContext.Provider value={{ user: state.user, logout: logout, login: login }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};

export { useAuth, AuthProvider };
