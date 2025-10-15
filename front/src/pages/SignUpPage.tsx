import { useState } from "react";
import Input from "../components/Input";
import { KeyRound, Mail, MessageCircleIcon, UserIcon } from "lucide-react";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const SignUpPage = () => {
  const { isSigningUp, signUp } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
        <BorderAnimatedContainer>
          <div className="w-full flex">
            {/* left */}
            <div className="w-full min-w-[500px] p-8 flex flex-col items-center justify-center md:border-r border-slate-600/30">
              <div className="flex flex-col items-center mb-8">
                <MessageCircleIcon className="mb-3 size-8" />
                <h2 className="text-2xl font-bold text-slate-200 mb-2">
                  회원가입
                </h2>
                <p className="text-slate-400">새로운 계정을 만들어보세요!</p>
              </div>
              <form className="space-y-6 w-full max-w-[300px]">
                {/* full name */}
                <Input
                  type="text"
                  title={"이름"}
                  value={formData.fullName}
                  placeholder="홍길동"
                  onChange={(data: string) => {
                    setFormData({ ...formData, fullName: data });
                  }}
                  icon={UserIcon}
                />

                {/* email */}
                <Input
                  type={"email"}
                  title={"이메일"}
                  value={formData.email}
                  placeholder={"example@test.com"}
                  onChange={(data: string) => {
                    setFormData({ ...formData, email: data });
                  }}
                  icon={Mail}
                />

                {/* password */}
                <Input
                  type={"password"}
                  title={"비밀번호"}
                  value={formData.password}
                  placeholder={"비밀번호를 입력하세요"}
                  onChange={(data: string) => {
                    setFormData({ ...formData, password: data });
                  }}
                  icon={KeyRound}
                />
                <Button
                  text="회원가입"
                  className="mt-10"
                  disabled={
                    isSigningUp ||
                    formData.fullName === "" ||
                    formData.email === "" ||
                    formData.password === ""
                  }
                  isLoading={isSigningUp}
                  onClick={() => {
                    signUp(formData);
                  }}
                />
              </form>
              <p className="mt-3 select-none text-sm">
                이미 계정이 있으신가요?{" "}
                <Link
                  to={"/login"}
                  className="cursor-pointer font-semibold ml-3 bg-slate-700 rounded-lg py-1 px-2"
                >
                  로그인
                </Link>
              </p>
            </div>
            {/* right */}
            <div className="w-full lg:flex justify-center items-center hidden">
              <img src="/signup.png" alt="sign up" className="max-w-[500px]" />
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
};
export default SignUpPage;
