import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const {
    register: registerForm,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    setError
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const { signup: authSignup } = useAuth();
  const password = watch("password");

  // Get return path from navigation state
  const returnTo = location.state?.returnTo || '/';
  const checkoutData = location.state?.checkoutData;

  // Send data to backend using AuthContext
  const onSubmit = async (data) => {
    try {
      console.log("Form data:", data);
      
      // Prepare data for backend
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      };

      // Use AuthContext signup function
      const result = await authSignup(userData);
      
      if (result.success) {
        console.log("Signup successful:", result.user);
        alert("✅ Account created successfully!");
        reset();
        
        // Navigate to return path (checkout page if came from premium button)
        if (returnTo === '/checkout' && checkoutData) {
          navigate('/checkout', { state: checkoutData });
        } else {
          navigate(returnTo);
        }
      } else {
        setError("root", { message: result.message || "Signup failed. Please try again." });
      }
      
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage = error.response?.data?.message || error.message;
      setError("root", { message: `❌ Error: ${errorMessage}` });
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center px-2"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-body p-3 p-md-4">
              <div className="text-center mb-3">
                <h2 className="fw-bold text-primary mb-1">Create Account</h2>
                <p className="text-muted small">Join QuizWizzes today!</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Name Fields */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-semibold">First Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.firstName && "is-invalid"}`}
                      placeholder="First name"
                      {...registerForm("firstName", { 
                        required: "First name is required" 
                      })}
                    />
                    {errors.firstName && (
                      <div className="invalid-feedback">
                        {errors.firstName.message}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-semibold">Last Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.lastName && "is-invalid"}`}
                      placeholder="Last name"
                      {...registerForm("lastName", { 
                        required: "Last name is required" 
                      })}
                    />
                    {errors.lastName && (
                      <div className="invalid-feedback">
                        {errors.lastName.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Email Address</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email && "is-invalid"}`}
                    placeholder="Enter your email"
                    {...registerForm("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
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
                  <label className="form-label small fw-semibold">Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password && "is-invalid"}`}
                    placeholder="••••••••"
                    {...registerForm("password", { 
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

                {/* Confirm Password Field */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Confirm Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword && "is-invalid"}`}
                    placeholder="••••••••"
                    {...registerForm("confirmPassword", { 
                      required: "Please confirm your password",
                      validate: value => 
                        value === password || "Passwords do not match"
                    })}
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">
                      {errors.confirmPassword.message}
                    </div>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="form-check mb-3">
                  <input 
                    className={`form-check-input ${errors.terms && "is-invalid"}`}
                    type="checkbox" 
                    id="terms" 
                    {...registerForm("terms", { 
                      required: "You must accept the terms and conditions" 
                    })}
                  />
                  <label className="form-check-label text-muted small">
                    I agree to the <a href="#">Terms</a> & <a href="#">Privacy Policy</a>
                  </label>
                  {errors.terms && (
                    <div className="invalid-feedback d-block">
                      {errors.terms.message}
                    </div>
                  )}
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
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="small text-muted">
                    Already have an account? <a href="/login">Sign In</a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}