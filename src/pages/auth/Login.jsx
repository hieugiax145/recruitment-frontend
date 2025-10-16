import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import { useTranslation } from "react-i18next"; 

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className="flex flex-col space-y-4 w-full max-w-md
       bg-white rounded-xl shadow-md p-8 border border-[#f3f3f3]"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">{t("login")}</h2>
        <form onSubmit={handleLogin} className="space-y-2">
          <TextInput
            label={t("username")}
            name="username"
            onChange={handleChange}
            required
          />
          <TextInput
            label={t("password")}
            name="password"
            type="password"
            onChange={handleChange}
            required
          />
          <Button  type="submit" onClick={handleLogin} children={t("login")} />
        </form>
      </div>
    </div>
  );
};

export default Login;
