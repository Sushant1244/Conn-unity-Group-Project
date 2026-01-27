document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('link[href="/styles.css"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/styles.css'
    document.head.appendChild(link)
  }

  document.title = 'Conn-Unity — Community for Creators'

  document.body.innerHTML = `
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <img src="logo.jpeg" alt="Conn-Unity" class="logo-img">
                    <span class="logo-text">Conn-Unity</span>
                </div>
                <nav class="nav">
                    <a href="/auth.html#login" class="btn btn-text">Login</a>
                    <a href="/auth.html#register" class="btn btn-primary">Sign Up →</a>
                </nav>
            </div>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <div class="hero-left">
                    <div class="badge">⭐ Join thousands of creators</div>
                    <h1 class="hero-title">Conn-Unity</h1>
                    <p class="hero-description">A warm and welcoming place where your thoughts truly matter. Share your ideas, connect with others, and explore meaningful conversations in a community built on real, honest expression.</p>
                    <div class="hero-buttons">
                        <a href="/auth.html#register" class="btn btn-large btn-primary">Get Started Free →</a>
                        <a href="/auth.html#register" class="btn btn-large btn-secondary">Explore Posts →</a>
                    </div>
                    <div class="hero-stats">
                        <div class="stat">
                            <div class="stat-number" data-target="8700">8.7K+</div>
                            <div class="stat-label">Active Users</div>
                        </div>
                        <div class="stat">
                            <div class="stat-number" data-target="65000">65K+</div>
                            <div class="stat-label">Posts Shared</div>
                        </div>
                        <div class="stat">
                            <div class="stat-number" data-target="100000">100K+</div>
                            <div class="stat-label">Conversations</div>
                        </div>
                        <div class="stat">
                            <div class="stat-number" data-percentage="99.99">99.99%</div>
                            <div class="stat-label">Satisfaction</div>
                        </div>
                    </div>
                </div>

                <div class="hero-right">
                    <div class="floating-card">
                        <h3 class="card-title">Join the Community</h3>
                        <p class="card-subtitle">Start your journey today</p>
                        <ul class="card-features">
                            <li>
                                <span class="feature-icon-wrapper">
                                    <svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                </span>
                                <span>Share your thoughts and stories</span>
                            </li>
                            <li>
                                <span class="feature-icon-wrapper">
                                    <svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                </span>
                                <span>Join meaningful discussions</span>
                            </li>
                            <li>
                                <span class="feature-icon-wrapper">
                                    <svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                                </span>
                                <span>Discover content with tags</span>
                            </li>
                            <li>
                                <span class="feature-icon-wrapper">
                                    <svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                </span>
                                <span>Connect with like-minded people</span>
                            </li>
                        </ul>
                        <a href="/auth.html#register" class="btn btn-card-cta">Start Creating</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="hero-decoration hero-decoration-1"></div>
        <div class="hero-decoration hero-decoration-2"></div>
    </section>

    <section class="features">
        <div class="container">
            <div class="features-content">
                <h2 class="section-title">Why Choose Conn-Unity?</h2>
                <p class="section-subtitle">Experience the perfect blend of simplicity and powerful features designed for meaningful conversations and genuine connections.</p>
                
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">💖</div>
                        <h3 class="feature-title">Express Yourself</h3>
                        <p class="feature-description">Share your thoughts with a beautiful, intuitive interface designed for meaningful expression.</p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">👥</div>
                        <h3 class="feature-title">Connect & Engage</h3>
                        <p class="feature-description">Join vibrant discussions and connect with people who share your interests and passions.</p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">📈</div>
                        <h3 class="feature-title">Discover Trends</h3>
                        <p class="feature-description">Stay updated with trending topics and discover fresh perspectives from our community.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="cta-section">
        <div class="container">
            <div class="cta-content">
                <h2 class="cta-title">Start Your Journey With Conn-Unity</h2>
                <p class="cta-description">Share your ideas, discover new perspectives, and connect with a community that celebrates meaningful conversations.</p>
                <div class="cta-buttons">
                    <a href="/auth.html#register" class="btn btn-large btn-primary">Join Conn-Unity →</a>
                    <a href="/auth.html#login" class="btn btn-large btn-secondary">Sign In</a>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-left">
                    <h3 class="footer-title">Conn-Unity</h3>
                    <p class="footer-subtitle">Community Guidelines</p>
                    <p class="footer-description">Share your thoughts freely, but let's keep our community respectful and welcoming for everyone. No controversial or harmful content.</p>
                </div>
                <div class="footer-right">
                    <p class="footer-help">Need help or have questions?</p>
                    <a href="#" class="footer-link">Contact Us →</a>
                    <a href="/auth.html#admin" class="footer-link">Admin Login →</a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>© 2025 Conn-Unity. Built with ❤️ by creators.</p>
            </div>
        </div>
    </footer>
  `

  document.querySelectorAll('.btn, .btn-large, .btn-primary, .btn-text').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const el = e.currentTarget
      if (el.matches('.btn-primary') && el.closest('.hero')) {
        window.location.href = '/auth.html#register'
      }
    })
  })

  const statNumbers = document.querySelectorAll('.stat-number')
  statNumbers.forEach(stat => {
    const target = parseInt(stat.dataset.target)
    const percentage = parseFloat(stat.dataset.percentage)
    if (percentage) {
      stat.textContent = percentage.toFixed(2) + '%'
    } else if (target) {
      if (target >= 1000) stat.textContent = (target/1000) + 'K+'
      else stat.textContent = String(target)
    }
  })
})
