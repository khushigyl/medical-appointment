import { useContext, useState } from "react";
import { authContext } from "../../context/AuthContext";
import MyBookings from "./MyBookings";
import Profile from "./Profile";
import useGetProfile from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";

const MyAccount = () => {
  const { dispatch } = useContext(authContext);
  const [tab, setTab] = useState("bookings");

  const { data: userData, loading, error } = useGetProfile(
    `${BASE_URL}/users/profile/me`
  );

  console.log(userData, "userdata");

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };
  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        {loading && !error && <Loading />}

        {error && !loading && <Error errMessage={error} />}

        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-10">
            <div className="pb-[50px] px-[30px] rounded-md">
              <div className="flex items-center justify-center">
                <figure className="w-[100px] h-[100px] rounded-full border-2 border-solid border-primaryColor">
                  <img
                    src="data:image/png;base64,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"
                    alt=""
                    className="w-full h-full rounded-full"
                  />
                </figure>
              </div>
              <div className="text-center mt-4">
                <h3 className="text-[18px] leading-[30px] text-headingColor font-bold">
                  {userData.name}
                </h3>
                <p className="text-textColor text-[15px] leading-6 font-medium">
                  {userData.email}
                </p>
                <p className="text-textColor text-[15px] leading-6 font-medium">
                  Blood Type:{" "}
                  <span className="ml-2 text-headingColor text-[22px] leading-8">
                    {userData.bloodType}
                  </span>
                </p>
              </div>

              <div className="mt-[50px] md:mt-[100px]">
                <button
                  onClick={handleLogout}
                  className="w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white"
                >
                  Logout
                </button>
                <button className="w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white">
                  Delete account
                </button>
              </div>
            </div>

            <div className="md:col-span-2 md:px-[30px]">
              <div>
                <button
                  onClick={() => setTab("bookings")}
                  className={`${
                    tab === "bookings" &&
                    "bg-primaryColor text-white font-normal"
                  }p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}
                >
                  My Bookings
                </button>

                <button
                  onClick={() => setTab("settings")}
                  className={` ${
                    tab === "settings" &&
                    "bg-primaryColor text-white font-normal"
                  }py-2 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}
                >
                  Profile Settings
                </button>
              </div>

              {tab === "bookings" && <MyBookings />}
              {tab === "settings" && <Profile user={userData} />}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyAccount;
