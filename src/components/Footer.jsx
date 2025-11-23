import { BsFacebook, BsTwitter, BsLinkedin, BsYoutube } from "react-icons/bs";

export default function Footer() {
  return (
    <footer className="bg-white text-dark pt-5 pb-4 mt-5">
      <div className="container">
        <div className="row gy-4">
          {/* Company Info */}
          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="text-center text-md-start">
              <div className="d-flex align-items-center justify-content-center justify-content-md-start mb-3">
                <img 
                  width="80" 
                  className="d-inline-block align-text-top img-fluid" 
                  src="/images/image.png" 
                  alt="QuizApp Logo"
                />
              </div>
              <p className="text-muted small mb-3">
                Create and share engaging quizzes, tests, and assessments. Learn, teach, and have fun!
              </p>
              <div className="d-flex gap-2 justify-content-center justify-content-md-start">
                <a href="#" className="btn btn-outline-secondary btn-sm rounded-circle p-2">
                  <BsFacebook size={18}/>
                </a>
                <a href="#" className="btn btn-outline-secondary btn-sm rounded-circle p-2">
                  <BsTwitter size={18}/>
                </a>
                <a href="#" className="btn btn-outline-secondary btn-sm rounded-circle p-2">
                  <BsLinkedin size={18}/>
                </a>
                <a href="#" className="btn btn-outline-secondary btn-sm rounded-circle p-2">
                  <BsYoutube size={18}/>
                </a>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="col-xl-2 col-lg-2 col-md-6 col-sm-6 col-6">
            <div className="text-center text-md-start">
              <h6 className="text-dark fw-bold mb-3">Products</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-muted small text-decoration-none">Quiz Maker</a></li>
                <li className="mb-2"><a href="#" className="text-muted small text-decoration-none">Survey Maker</a></li>
                <li className="mb-2"><a href="#" className="text-muted small text-decoration-none">Poll Maker</a></li>
                <li className="mb-2"><a href="#" className="text-muted small text-decoration-none">Training Maker</a></li>
                <li className="mb-2"><a href="#" className="text-muted small text-decoration-none">Assessment Software</a></li>
              </ul>
            </div>
          </div>

          {/* Resources */}
          <div className="col-xl-2 col-lg-2 col-md-6 col-sm-6 col-6">
            <div className="text-center text-md-start">
              <h6 className="text-dark fw-bold mb-3">Resources</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-muted small text-decoration-none">Blog</a></li>
                <li className="mb-2"><a href="#" className="text-muted small text-decoration-none">Help Center</a></li>
                <li className="mb-2"><a href="#" className="text-muted small text-decoration-none">Tutorials</a></li>
                <li className="mb-2"><a href="#" className="text-muted small text-decoration-none">Case Studies</a></li>
                <li className="mb-2"><a href="#" className="text-muted small text-decoration-none">Webinars</a></li>
              </ul>
            </div>
          </div>

          {/* Company */}
          <div className="col-xl-2 col-lg-2 col-md-6 col-sm-6 col-6">
            <div className="text-center text-md-start">
              <h6 className="text-dark fw-bold mb-3">Company</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-muted small text-decoration-none">About Us</a></li>
                <li className="mb-2"><a href="#" className="text-muted small text-decoration-none">Careers</a></li>
                <li className="mb-2"><a href="/contact" className="text-muted small text-decoration-none">Contact</a></li>
                <li className="mb-2"><a href="#" className="text-muted small text-decoration-none">Partners</a></li>
                <li className="mb-2"><a href="#" className="text-muted small text-decoration-none">Affiliates</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="text-center text-md-start">
              <h6 className="text-dark fw-bold mb-3">Stay Updated</h6>
              <p className="text-muted small mb-3">Subscribe to our newsletter for the latest quizzes and updates.</p>
              <div className="input-group mb-3">
                <input 
                  type="email" 
                  className="form-control form-control-sm" 
                  placeholder="Enter your email" 
                />
                <button className="btn btn-primary btn-sm" type="button">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        {/* Bottom Section - NO ADMIN BUTTON HERE */}
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            <p className="text-muted small mb-0">
              © 2025 ProProfs. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <a href="#" className="text-muted text-decoration-none small">Privacy Policy</a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="#" className="text-muted text-decoration-none small">Terms of Service</a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="#" className="text-muted text-decoration-none small">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};