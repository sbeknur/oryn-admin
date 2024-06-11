import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import MyRestaurant from "./pages/myRestaurant/MyRestaurant";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";
import { restaurantColumns, placeColumns, userColumns, foodColumns } from "./datatablesource";
import NewRestaurant from "./pages/newRestaurant/NewRestaurant";
import NewPlace from "./pages/newPlace/NewPlace";
import NewFood from "./pages/newFood/NewFood";

function App() {
    const { darkMode } = useContext(DarkModeContext);

    const ProtectedRoute = ({ children, allowedRoles }) => {
        const { user } = useContext(AuthContext);

        if (!user) {
            return <Navigate to="/login" />;
        }

        if (allowedRoles && !allowedRoles.includes(user.role)) {
            return <Navigate to="/" />;
        }

        return children;
    };

    return (
        <div className={darkMode ? "app dark" : "app"}>
            <BrowserRouter>
                <Routes>
                    <Route path="/">
                        <Route path="login" element={<Login />} />
                        <Route
                            index
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="users">
                            <Route
                                index
                                element={
                                    <ProtectedRoute allowedRoles={["admin"]}>
                                        <List columns={userColumns} />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path=":id"
                                element={
                                    <ProtectedRoute allowedRoles={["admin"]}>
                                        <Single />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="new"
                                element={
                                    <ProtectedRoute allowedRoles={["admin"]}>
                                        <New inputs={userInputs} title="Add New User" />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>
                        <Route path="restaurants">
                            <Route
                                index
                                element={
                                    <ProtectedRoute allowedRoles={["admin", "restaurant"]}>
                                        <List columns={restaurantColumns} />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path=":id"
                                element={
                                    <ProtectedRoute allowedRoles={["admin", "restaurant"]}>
                                        <Single />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="new"
                                element={
                                    <ProtectedRoute allowedRoles={["admin"]}>
                                        <NewRestaurant />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>
                        <Route path="places">
                            <Route
                                index
                                element={
                                    <ProtectedRoute allowedRoles={["admin", "restaurant"]}>
                                        <List columns={placeColumns} />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path=":id"
                                element={
                                    <ProtectedRoute allowedRoles={["admin", "restaurant"]}>
                                        <Single />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="new"
                                element={
                                    <ProtectedRoute allowedRoles={["admin", "restaurant"]}>
                                        <NewPlace />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>
                        <Route path="foods">
                            <Route
                                index
                                element={
                                    <ProtectedRoute allowedRoles={["admin", "restaurant"]}>
                                        <List columns={foodColumns} />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="new"
                                element={
                                    <ProtectedRoute allowedRoles={["admin", "restaurant"]}>
                                        <NewFood />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>
                        <Route
                            path="myRestaurant"
                            element={
                                <ProtectedRoute allowedRoles={["restaurant"]}>
                                    <MyRestaurant />
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
