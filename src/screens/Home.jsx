import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { logUserIn } from "../apollo";
import logo from "../assets/ch-logo.gif";
import ReactHelmet from "../components/ReactHelmet";

const LOGIN_MUTATION = gql`
  mutation adminlogin($email: String!, $password: String!) {
    adminlogin(email: $email, password: $password) {
      ok
      token
      error
    }
  }
`;

export default function Home() {
  const navigation = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();
  const [adminLoginMutation, { data }] = useMutation(LOGIN_MUTATION);

  const onValid = (data) => {
    adminLoginMutation({
      variables: {
        email: data.email,
        password: data.password,
      },
      update: (_, result) => {
        const {
          data: {
            adminlogin: { ok, token, error },
          },
        } = result;
        if (ok) {
          logUserIn(token);
          navigation("/statistics");
        } else {
          if (error === "잘못된 비밀번호입니다.") {
            setError("wrongpassword", {
              message: error,
            });
          } else if (error === "잘못된 이메일 주소입니다.") {
            setError("wrongemail", {
              message: error,
            });
          }
        }
      },
    });
  };

  return (
    <>
      <ReactHelmet title="홈" />
      <div className="sm:w-screen h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="w-24 h-24 mb-5">
          <img src={logo} />
        </div>
        <h3 className="text-3xl font-bold text-center mb-10 ">
          청춘온 관리자 페이지
        </h3>
        <form
          onSubmit={handleSubmit(onValid)}
          className="flex flex-col items-center sm:w-screen"
        >
          <input
            {...register("email", {
              required: "이메일을 기입해주세요.",
              onChange: (e) => clearErrors("wrongemail"),
            })}
            type="text"
            placeholder="이메일"
            className="px-3 w-80 h-12 shadow-sm placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:border-2"
          />
          <span className="text-pink-600 font-medium mb-2 text-sm">
            {errors.email?.message || errors.wrongemail?.message}
          </span>
          <input
            {...register("password", {
              required: "비밀번호를 기입해주세요.",
              onChange: (e) => clearErrors("wrongpassword"),
            })}
            type="password"
            placeholder="비밀번호"
            className="px-3 w-80 h-12 shadow-sm placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:border-2"
          />
          <span className="text-pink-600 font-medium mb-5 text-sm">
            {errors.password?.message || errors.wrongpassword?.message}
          </span>
          <button
            type="submit"
            className="bg-[#FF2D78] w-72 h-10 rounded-sm text-white shadow-md text-lg cursor-pointer"
          >
            로그인
          </button>
        </form>
      </div>
    </>
  );
}
