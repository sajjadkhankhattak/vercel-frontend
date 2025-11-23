import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      console.log("Login data:", data);
      
      // Use your service function
      const response = await login({
        email: data.email,
        password: data.password
      });

      console.log("Login response:", response.data);
      
      // Store token or user data
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      
      alert("✅ Login successful!");
      reset();
      navigate("/");
      
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      setError("root", { message: errorMessage });
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-body p-4">
              <div className="text-center mb-3">
                <h2 className="fw-bold text-primary mb-2">Welcome Back</h2>
                <p className="text-muted">Sign in to your QuizWizzes account</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Email Field */}
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label">Email Address</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    id="loginEmail"
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    id="loginPassword"
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">
                      {errors.password.message}
                    </div>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="rememberMe" 
                      {...register("rememberMe")}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <a href="#forgot" className="text-primary text-decoration-none">Forgot password?</a>
                </div>

                {/* Root Error Message */}
                {errors.root && (
                  <div className="alert alert-danger" role="alert">
                    {errors.root.message}
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>

                {/* Social Login Divider */}
                <div className="text-center mb-3">
                  <div className="position-relative">
                    <hr />
                    <span className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted">
                      or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary w-100" 
                      onClick={() => alert("Google Login Coming Soon")}
                    >
                      <i className="bi bi-google me-2"></i>
                      Google
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary w-100" 
                      onClick={() => alert("Facebook Login Coming Soon")}
                    >
                      <i className="bi bi-facebook me-2"></i>
                      Facebook
                    </button>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <span className="text-muted">Don't have an account? </span>
                  <a href="/signup" className="text-primary fw-semibold text-decoration-none">Sign Up</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}