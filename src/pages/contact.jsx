import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, User } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactMethods = [
    {
      icon: <Mail size={24} />,
      title: 'Email Us',
      description: 'Send us an email anytime',
      value: 'sajjadkhankhattak@gmail.com',
      link: 'sajjadkhankhattak20@gmail.com'
    },
    {
      icon: <Phone size={24} />,
      title: 'Call Us',
      description: 'Mon to Fri from 9am to 6pm',
      value: '+923159831745',
      link: 'tel:+923159831745'
    },
    {
      icon: <MessageCircle size={24} />,
      title: 'Live Chat',
      description: 'Instant support via chat',
      value: 'Start Chat',
      link: '#chat'
    },
    {
      icon: <MapPin size={24} />,
      title: 'Visit Us',
      description: 'Come say hello at our office',
      value: 'comsats university abbottabad',
      link: '#map'
    }
  ];

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="fw-bold text-dark mb-3">Get in Touch</h1>
        <p className="text-muted fs-5">
          Have questions about our quizzes? We're here to help!
        </p>
      </div>

      <div className="row">
        {/* Contact Information */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="fw-semibold text-dark mb-4">Contact Information</h5>
              
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.link}
                  className="d-flex align-items-center text-decoration-none text-dark mb-4 p-3 rounded hover-shadow"
                >
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                    <div className="text-primary">
                      {method.icon}
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="fw-semibold mb-1">{method.title}</h6>
                    <p className="text-muted small mb-1">{method.description}</p>
                    <span className="text-primary small fw-medium">{method.value}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-semibold text-dark mb-4">Send us a Message</h5>
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label fw-medium text-dark">
                      <User size={16} className="me-2" />
                      Full Name
                      </label>
                    <input
                      type="text"
                      className="form-control py-2"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label fw-medium text-dark">
                      <Mail size={16} className="me-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control py-2"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label fw-medium text-dark">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="form-control py-2"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="message" className="form-label fw-medium text-dark">
                    <MessageCircle size={16} className="me-2" />
                    Message
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary d-flex align-items-center px-4 py-2"
                >
                  <Send size={18} className="me-2" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      FAQ Section
      <div className="row mt-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-semibold text-dark mb-4">Frequently Asked Questions</h5>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <h6 className="fw-semibold text-dark">How do I create a quiz?</h6>
                    <p className="text-muted mb-0">Click the "Create Quiz" button in the navigation bar and follow the simple step-by-step process.</p>
                  </div>
                  <div className="mb-3">
                    <h6 className="fw-semibold text-dark">Is there a mobile app?</h6>
                    <p className="text-muted mb-0">Yes! Our website is fully responsive and works perfectly on all mobile devices.</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <h6 className="fw-semibold text-dark">Can I share my quizzes?</h6>
                    <p className="text-muted mb-0">Absolutely! Every quiz has a unique shareable link you can send to friends.</p>
                  </div>
                  <div className="mb-3">
                    <h6 className="fw-semibold text-dark">Are the quizzes free?</h6>
                    <p className="text-muted mb-0">Yes, all our quizzes are completely free to take and create.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;