// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .problem-card, .step, .diff-card, .audience-card').forEach(el => {
    observer.observe(el);
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
    });
});

// Header scroll effect
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const scrollY = window.scrollY;
    if (scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
    lastScrollY = scrollY;
});

// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Back to Top functionality
const backToTopBtn = document.querySelector('.back-to-top');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Pricing tabs logic + billing & currency controls
const planTabs = document.querySelectorAll('.plan-tab');
const priceAmount = document.getElementById('priceAmount');
const planDesc = document.getElementById('planDesc');
const planFeatures = document.getElementById('planFeatures');
const billingButtons = document.querySelectorAll('.billing-btn');
const currencySelect = document.getElementById('currency');

let currentPlan = 'basic';
let currentBilling = 'monthly';
let currentCurrency = 'USD';

const CURRENCY_SYMBOL = { USD: '$', UGX: 'UGX', KES: 'KSh', NGN: '₦' };
const FX = { USD: 1, UGX: 3800, KES: 128, NGN: 1550 }; // display-only FX

const plans = {
    basic: {
        desc: 'Perfect for For SACCOs & Early-stage fintechs.',
        features: [
            'Predefined static fraud rules (plug-and-play)',
            'Shared intelligence (basic alerts from network)',
            'Anomaly detection (threshold-based)',
            'Upload CSV/Excel OR basic API access',
            'Basic fraud detection across our network',
            '5000 monthly transaction limit',
            'Dashboard for tracking payments',
            'Standard support via email'
        ],
        priceUSD: { monthly: 99, yearly: 99 * 12 * 0.8 }
    },
    business: {
        desc: 'Built For MFI, scaling fintechs, Saccos & mid-size banks',
        features: [
            'All Lite Features',
            'Unlimited payment methods and channels',
            'Advanced fraud detection with shared intelligence',
            'API-first integration with core banking/payment systems',
            'Fraud scoring engine (dynamic risk scores)',
            'Team access and roles with audit logs',
            'Alerts via SMS, webhook, email',
            'Priority support with SLA'
        ],
        priceUSD: { monthly: 499, yearly: 499 * 12 * 0.8 }
    },
    enterprise: {
        desc: 'For Banks, MFIs and Telcos &  National Fintechs.',
        features: [
            'All Business features',
            'AI/ML fraud detection (custom models per institution)',
            'Dedicated region-aware infrastructure',
            'On-prem or VPC deployments',
            'Custom risk rules and data residency controls',
            'Market expansion tools (multi-country, regulatory compliance)',
            'Dedicated account manager & support',
            'Compliance & security reviews (KYC/KYB/PCI)'
        ],
        priceUSD: { monthly: null, yearly: null }
    }
};

function formatPrice(amount, currency) {
    if (amount === null) return { isCustom: true, display: 'Custom' };
    const symbol = CURRENCY_SYMBOL[currency];
    const long = symbol.length > 1; // e.g., USh, KSh
    if (currency === 'USD') {
        return { isCustom: false, symbol, long, amountText: amount.toFixed(0) };
    }
    const valueInCurrency = Math.round(amount * FX[currency]);
    return { isCustom: false, symbol, long, amountText: valueInCurrency.toLocaleString() };
}

function renderPlan() {
    const plan = plans[currentPlan];
    const price = formatPrice(plan.priceUSD[currentBilling], currentCurrency);
    if (price.isCustom) {
        priceAmount.textContent = price.display;
    } else {
        priceAmount.innerHTML = `<span class="currency ${price.long ? 'long' : ''}">${price.symbol}</span>${price.amountText}`;
    }
    planDesc.textContent = plan.desc;
    planFeatures.innerHTML = plan.features.map(f => `<li>${f}</li>`).join('');
}

planTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        planTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentPlan = tab.dataset.plan;
        renderPlan();
    });
});

billingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        billingButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentBilling = btn.dataset.billing;
        renderPlan();
    });
});

if (currencySelect) {
    currencySelect.addEventListener('change', (e) => {
        currentCurrency = e.target.value;
        renderPlan();
    });
}

// initial render
if (priceAmount) renderPlan();

// Footer: dynamic year
const yearEl = document.getElementById('copyrightYear');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}


