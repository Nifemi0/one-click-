import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, Clock, Users, Shield } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section className="section">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="h2 text-charcoal">
            Get in <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-large text-gray-600 max-w-3xl mx-auto">
            Have questions about our security platform? Need help with deployment? 
            Our team is here to help you secure your DeFi assets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="card">
            <div className="card-body">
              <h3 className="h3 text-charcoal mb-6">Send us a Message</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="form-input"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="form-input"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <select id="subject" name="subject" className="form-select" required>
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="deployment">Deployment Help</option>
                    <option value="security">Security Questions</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="form-input"
                    placeholder="Tell us how we can help you..."
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="space-y-6">
              <h3 className="h3 text-charcoal">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal mb-1">Email</h4>
                    <p className="text-gray-600">support@oneclick.com</p>
                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal mb-1">Live Chat</h4>
                    <p className="text-gray-600">Available 24/7</p>
                    <p className="text-sm text-gray-500">Get instant help from our team</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal mb-1">Phone</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal mb-1">Office</h4>
                    <p className="text-gray-600">123 Security Street</p>
                    <p className="text-sm text-gray-500">New York, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Hours */}
            <div className="bg-gradient-to-r from-primary/5 to-orange-600/5 rounded-xl p-6 border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-primary" />
                <h4 className="h4 text-charcoal">Support Hours</h4>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span>10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span>Emergency Support Only</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h4 className="h4 text-charcoal">Quick Actions</h4>
              <div className="grid grid-cols-1 gap-3">
                <a href="/docs" className="btn btn-utility w-full justify-center">
                  📚 Documentation
                </a>
                <a href="/support" className="btn btn-utility w-full justify-center">
                  🆘 Support Center
                </a>
                <a href="/status" className="btn btn-utility w-full justify-center">
                  📊 System Status
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="h3 text-charcoal">Frequently Asked Questions</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about our platform and services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="card-body">
                <h4 className="h4 text-charcoal mb-3">How do I deploy a security trap?</h4>
                <p className="text-gray-600">
                  Simply navigate to our deploy page, choose a template, customize your settings, 
                  and click deploy. Our AI will generate and deploy your contract in minutes.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h4 className="h4 text-charcoal mb-3">What networks do you support?</h4>
                <p className="text-gray-600">
                  We support Ethereum, Polygon, Arbitrum, Base, and many other EVM-compatible networks. 
                  More networks are added regularly.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h4 className="h4 text-charcoal mb-3">Is my data secure?</h4>
                <p className="text-gray-600">
                  Absolutely. We use enterprise-grade encryption and never store your private keys. 
                  All security measures follow industry best practices.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h4 className="h4 text-charcoal mb-3">Can I customize security templates?</h4>
                <p className="text-gray-600">
                  Yes! All our templates are fully customizable. You can modify security levels, 
                  add custom logic, and integrate with your existing systems.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-primary/5 to-orange-600/5 rounded-2xl p-8 border border-primary/20">
            <h3 className="h3 text-charcoal mb-4">
              Ready to Secure Your DeFi Assets?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of users who trust One Click to protect their protocols. 
              Start deploying security traps today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/deploy" className="btn btn-primary btn-lg">
                🚀 Start Deploying
              </a>
              <a href="/marketplace" className="btn btn-secondary btn-lg">
                🏪 Browse Templates
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
