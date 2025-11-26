import React, { useState, useMemo } from "react";
import axios from "axios";
import style from "./LoginStyle.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faArrowRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";

const copyMap = {
  en: {
    title: "Welcome back",
    subtitle: "Sign in to your stock management dashboard",
    emailLabel: "Email address",
    emailPlaceholder: "Enter your email",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    rememberMe: "Remember me",
    submit: "Sign in",
    noAccount: "Don't have an account?",
    signupLink: "Contact admin to create one",
    requiredError: "Username and password are required",
    success: "Login successful!",
    failure: "Login failed",
  },
  ar: {
    title: "مرحباً بعودتك",
    subtitle: "سجّل الدخول إلى لوحة تحكم إدارة المخزون",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "أدخل بريدك الإلكتروني",
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "أدخل كلمة المرور",
    rememberMe: "تذكرني",
    submit: "تسجيل الدخول",
    noAccount: "لا تملك حساباً؟",
    signupLink: "تواصل مع المسؤول لإنشاء حساب",
    requiredError: "اسم المستخدم وكلمة المرور مطلوبان",
    success: "تم تسجيل الدخول بنجاح!",
    failure: "فشل تسجيل الدخول",
  },
};

export default function Login() {
  const { language } = useLanguage();
  const copy = useMemo(() => copyMap[language], [language]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(null);

    if (!username || !password) {
      setError(copy.requiredError);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/api/login", {
        username,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("storage")); // notify other tabs / components

      setMessage(copy.success);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError(copy.failure);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.pageWrapper}>
      <div className={style.gradientBg} />

      <div className={style.centerWrapper}>
        <div className={style.loginCard}>
          <div className={style.brandSide}>
            <div className={style.brandBadge}>Stock Manager</div>
            <h1 className={style.brandTitle}>
              {language === "ar"
                ? "نظام إدارة المخزون"
                : "Inventory Management System"}
            </h1>
            <p className={style.brandSubtitle}>
              {language === "ar"
                ? "سيطر على المنتجات، المخزون، الأرباح وكل شيء في مكان واحد."
                : "Control products, stock and profit from a single modern dashboard."}
            </p>
            <div className={style.brandFooterHint}>
              {language === "ar"
                ? "تم تطويره خصيصًا لاحتياجات شركتك."
                : "Designed specifically for your company's workflow."}
            </div>
          </div>

          <div className={style.formSide}>
            <div className={style.formHeader}>
              <div className={style.iconCircle}>
                <FontAwesomeIcon icon={faArrowRightToBracket} />
              </div>
              <h2 className={style.formTitle}>{copy.title}</h2>
              <p className={style.formSubtitle}>{copy.subtitle}</p>
            </div>

            <form className={style.form} onSubmit={handleLogin}>
              {/* Email */}
              <div className={style.inputGroup}>
                <label className={style.inputLabel}>
                  {copy.emailLabel}
                </label>
                <div className={style.inputWrapper}>
                  <span className={style.inputIcon}>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <input
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={copy.emailPlaceholder}
                    className={style.inputField}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div className={style.inputGroup}>
                <label className={style.inputLabel}>
                  {copy.passwordLabel}
                </label>
                <div className={style.inputWrapper}>
                  <span className={style.inputIcon}>
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={copy.passwordPlaceholder}
                    className={style.inputField}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={style.passwordToggle}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
              </div>

              {/* Remember + status */}
              <div className={style.formFooterRow}>
                <label className={style.rememberMe}>
                  <input type="checkbox" />
                  <span>{copy.rememberMe}</span>
                </label>
              </div>

              {/* Button */}
              <button
                type="submit"
                className={style.submitBtn}
                disabled={loading}
              >
                {loading ? (
                  <span className={style.loadingDotRow}>
                    <span className={style.loadingDot} />
                    <span className={style.loadingDot} />
                    <span className={style.loadingDot} />
                  </span>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faArrowRightToBracket} />
                    <span>{copy.submit}</span>
                  </>
                )}
              </button>

              <p className={style.signupHint}>
                {copy.noAccount}{" "}
                <span className={style.signupLink}>{copy.signupLink}</span>
              </p>

              {error && <p className={style.errorText}>{error}</p>}
              {message && !error && (
                <p className={style.successText}>{message}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}