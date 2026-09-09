import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { ReactLenis } from 'lenis/react';

import g1 from './assets/g1.webp';
import g2 from './assets/g2.webp';
import g3 from './assets/g3.webp';
import g4 from './assets/g4.webp';
import g5 from './assets/g5.webp';
import g6 from './assets/g6.webp';
import g7 from './assets/g7.webp';
import logoImg from './assets/Logo.webp';
import marciImg from './assets/Marci.webp';
import firstImg from './assets/first image.webp';
import secondImg from './assets/second.webp';
import thirdImg from './assets/third.webp';
import service1Img from './assets/service1.webp';
import service2Img from './assets/service2.webp';
import service3Img from './assets/service3.webp';
import equalhousingImg from './assets/equalhousing.webp';
import parhumpImg from './assets/parhump.webp';
import p1 from './assets/p1.webp';
import searchImg from './assets/search.jpg';
import realtorImg from './assets/realtor.webp';
import ridgeImg from './assets/ridge.webp';
import s1 from './assets/s1.jpg';
import s2 from './assets/s2.jpg';
import s3 from './assets/s3.jpg';
import { FaFacebook, FaInstagram, FaLinkedin, FaYelp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Award, TrendingUp, Menu, X, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
// Replaced MapLibre map with Leaflet (loaded via CDN in index.html)

const portfolioImages = [
  { id: 1, src: g1, title: 'Luxury Estate', type: 'Residential', location: 'Pahrump, NV' },
  { id: 2, src: g2, title: 'Modern Villa', type: 'Residential', location: 'Pahrump, NV' },
  { id: 3, src: g3, title: 'Desert Oasis', type: 'Estate', location: 'Pahrump, NV' },
  { id: 4, src: g4, title: 'Mountain Retreat', type: 'Luxury', location: 'Pahrump, NV' },
  { id: 5, src: g5, title: 'City Penthouse', type: 'Residential', location: 'Las Vegas, NV' },
  { id: 6, src: g6, title: 'Suburban Haven', type: 'Family Home', location: 'Pahrump, NV' },
  { id: 7, src: g7, title: 'Custom Build', type: 'New Build', location: 'Pahrump, NV' },
];

const getSlidePosition = (index, activeIndex, totalSlides) => {
  const normalized = (index - activeIndex + totalSlides) % totalSlides;

  if (normalized === 0) return 'active';
  if (normalized === 1) return 'next';
  if (normalized === totalSlides - 1) return 'prev';
  return 'hidden';
};

const testimonials = [
  {
    name: 'Laura & David M.',
    detail: 'Buyers • Pahrump',
    quote: 'Marci made the entire process feel easy. She listened to what we wanted, found the right fit quickly, and negotiated with confidence from day one.',
  },
  {
    name: 'Renee S.',
    detail: 'Seller • Pahrump',
    quote: 'Our home sold above asking in a very competitive market. Marci understood pricing, marketing, and what buyers in this area truly value.',
  },
  {
    name: 'Chris T.',
    detail: 'Investor • Nevada',
    quote: 'The local knowledge was the difference. She knew the neighborhoods, timing, and strategy that would actually move a deal forward.',
  },
];

const recentSales = [
  {
    address: '1258 Desert Willow Dr',
    price: '$865,000',
    detail: '4 Bed • 3 Bath • 2,420 sq ft',
    status: 'Sold in 11 days',
    image: s1,
  },
  {
    address: '2140 Sagebrush Court',
    price: '$742,000',
    detail: '3 Bed • 2 Bath • 1,980 sq ft',
    status: 'Above asking',
    image: s2,
  },
  {
    address: '489 Mesa Vista Lane',
    price: '$1,240,000',
    detail: '5 Bed • 4 Bath • 3,560 sq ft',
    status: 'Luxury sale',
    image: s3,
  },
];

const areaGuides = [
  {
    title: 'Desert living, without the rush',
    text: 'Pahrump gives you room to breathe, wide-open views, and a welcoming pace that feels more balanced for everyday life.',
    image: p1,
  },
  {
    title: 'Value with long-term upside',
    text: 'Buyers are drawn to the area for its affordability, flexibility, and ability to stretch their budget without sacrificing comfort.',
    image: g3,
  },
  {
    title: 'A strong base for family life',
    text: 'From growing families to retirees, the community offers a quieter rhythm with the convenience of nearby access to Las Vegas.',
    image: g6,
  },
];

const faqs = [
  {
    question: 'How do I know if Pahrump is the right place for me?',
    answer: 'If you want a little more space, a slower pace, and a better value than many nearby markets, Pahrump is worth a closer look. It offers room to grow without giving up access to Las Vegas, which makes it especially appealing for buyers who want a more balanced lifestyle.',
  },
  {
    question: 'What makes Marci different from other agents?',
    answer: 'It comes down to local knowledge, honesty, and a thoughtful process. Marci is focused on strategy, timing, and communication so clients feel informed and confident every step of the way.',
  },
  {
    question: 'Can you help if I am relocating to the area?',
    answer: 'Absolutely. Relocating can be stressful, especially from a distance, so the process is built around clarity, trusted local guidance, and a search that fits your lifestyle, timeline, and budget.',
  },
  {
    question: 'Do you work with both buyers and sellers?',
    answer: 'Yes. Whether you are searching for your next home or preparing to sell, the approach is tailored to your goals and the realities of the local market.',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
};

function CountUp({ end, suffix = '', duration = 1.6 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    let frame;

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(end * eased));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.45 });

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end, duration]);

  return <span ref={ref}>{value}{suffix}</span>;
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const container = useRef(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const mapRef = useRef(null);
  const [leafletMap, setLeafletMap] = useState(null);

  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    gsap.to('.hero-bg', {
      yPercent: 16,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    });

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('.hero-subtitle span', { y: 22, opacity: 0, duration: 0.9, stagger: 0.08 })
      .from('.hero h1', { y: 64, opacity: 0, duration: 1.1 }, '-=0.6')
      .from('.hero-rule', { scaleX: 0, duration: 0.7, ease: 'power2.out' }, '-=0.75')
      .from('.hero .btn', { y: 16, opacity: 0, duration: 0.85 }, '-=0.5');

    gsap.fromTo('.cert-logo',
      { y: 18, opacity: 0 },
      {
        y: 0,
        opacity: 0.55,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.about-certs', start: 'top 88%', once: true },
      }
    );

    gsap.to('.blended-image-side img', {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: '.blended-about-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    gsap.fromTo('.info-card',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.95,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.info-grid', start: 'top 82%', once: true },
      }
    );

    const mm = gsap.matchMedia();
    mm.add('(hover: hover) and (pointer: fine)', () => {
      const btns = gsap.utils.toArray('.btn');
      const cleanups = btns.map((btn) => {
        const move = (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(btn, { x: x * 0.22, y: y * 0.22, duration: 0.35, ease: 'power2.out' });
        };
        const leave = () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1, 0.4)' });
        };
        btn.addEventListener('mousemove', move);
        btn.addEventListener('mouseleave', leave);
        return () => {
          btn.removeEventListener('mousemove', move);
          btn.removeEventListener('mouseleave', leave);
        };
      });
      return () => cleanups.forEach((fn) => fn());
    });
  }, { scope: container });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % portfolioImages.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    let mapInstance = null;
    let attempts = 0;
    const lat = 36.21;
    const lng = -115.98;

    const tryInit = () => {
      attempts += 1;
      if (!mapRef.current) {
        if (attempts < 20) return setTimeout(tryInit, 200);
        return;
      }

      if (typeof window.L === 'undefined') {
        if (attempts < 20) return setTimeout(tryInit, 200);
        return;
      }

      const rect = mapRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        if (attempts < 20) return setTimeout(tryInit, 200);
        return;
      }

      mapInstance = window.L.map(mapRef.current, { scrollWheelZoom: false }).setView([lat, lng], 16);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance);

      window.L.marker([lat, lng]).addTo(mapInstance).bindPopup('3190 HW-160, Suite F<br/>Pahrump, NV 89048').openPopup();

      // Ensure proper rendering if the container was previously hidden or resized
      setTimeout(() => { try { mapInstance.invalidateSize(); } catch (e) { } }, 300);
    };

    tryInit();

    return () => {
      try { if (mapInstance) mapInstance.remove(); } catch (e) { }
    };
  }, []);

  const onSubmit = (data) => {
    alert('Message sent successfully!');
    console.log(data);
    reset();
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <ReactLenis root options={{ lerp: 0.09, duration: 1.35, smoothWheel: true }}>
      <div className="app-container" ref={container}>
        <img
          id="anim-logo"
          src={logoImg}
          alt="Marci Metzger Logo"
          className={scrolled || menuOpen ? 'docked' : ''}
        />
        <nav className={`navbar ${scrolled || menuOpen ? 'scrolled glass-nav' : ''}`}>
          <a
            href="#home"
            className="logo-link"
            aria-label="Back to home"
            onClick={(e) => {
              if (window.location.hash === '#home' || !window.location.hash) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <img src={logoImg} alt="Marci Metzger Logo" className="navbar-logo" />
          </a>
          <button
            className="nav-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><a href="#home" onClick={closeMenu}>Home</a></li>
            <li><a href="#about" onClick={closeMenu}>About</a></li>
            <li><a href="#services" onClick={closeMenu}>Services</a></li>
            <li><a href="#listings" onClick={closeMenu}>Listings</a></li>
            <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
            <li><a href="tel:206-919-6886" className="nav-phone" onClick={closeMenu}>206-919-6886</a></li>
          </ul>
        </nav>

        <header id="home" className="hero">
          <div className="hero-bg"></div>
          <div className="hero-veil"></div>
          <div className="hero-content">
            <div className="hero-subtitle">
              <span className="accent">Marci Metzger</span>
              <span className="divider">|</span>
              <span className="sub">Proudly representing The Ridge Realty Group</span>
            </div>
            <h1>Pahrump Realtor</h1>
            <div className="hero-rule"></div>
            <p className="hero-lead">Luxury homes, strategic guidance, and neighborhood insight for buyers and sellers in Pahrump and beyond.</p>
            <div className="hero-actions">
              <a href="#contact" className="btn btn-primary">Call Now</a>
              <a href="#listings" className="btn btn-ghost">View Listings</a>
            </div>
          </div>
          <div className="scroll-indicator">
            <div className="mouse">
              <div className="wheel"></div>
            </div>
            <span>Scroll</span>
          </div>
        </header>

        <section id="listings" className="search-section">
          <div className="search-content">
            <div className="section-header">
              <span className="section-label">Pahrump, Nevada</span>
              <motion.h3 {...fadeUp} className="search-title">Find Your Dream Home</motion.h3>
              <motion.h2 {...fadeUp}>Search Listings</motion.h2>
            </div>
            <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
              <div className="input-group">
                <label htmlFor="loc">Location</label>
                <select id="loc">
                  <option>Any</option>
                  <option>Alamo</option><option>Alton</option><option>Amargosa Valley</option>
                  <option>Beatty</option><option>Beryl</option><option>Blue Diamond</option>
                  <option>Boulder City</option><option>Brian Head</option><option>Cal Nev Ari</option>
                  <option>Caliente</option><option>Cold Creek</option><option>Crystal</option>
                  <option>Duck Creek Village</option><option>Dyer</option><option>Elko</option>
                  <option>Ely</option><option>Goldfield</option><option>Goodsprings</option>
                  <option>Hatch</option><option>Henderson</option><option>Indian Springs</option>
                  <option>Jean</option><option>Las Vegas</option><option>Laughlin</option>
                  <option>Logandale</option><option>Manhattan</option><option>Mc Gill</option>
                  <option>Mesquite</option><option>Moapa</option><option>Mount Charleston</option>
                  <option>Mountain Springs</option><option>North Las Vegas</option>
                  <option>Overton</option><option>Pahrump</option><option>Palm Gardens</option>
                  <option>Panaca</option><option>Parowan</option><option>Pioche</option>
                  <option>Round Mountain</option><option>Sandy Valley</option>
                  <option>Searchlight</option><option>Tonopah</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="type">Type</label>
                <select id="type">
                  <option>Any Type</option>
                  <option>Land</option>
                  <option>Residential Lease</option>
                  <option>High Rise</option>
                  <option>Residential</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="sort">Sort By</label>
                <select id="sort">
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>Least Expensive to Most</option>
                  <option>Most Expensive to Least</option>
                  <option>Bedrooms (Low to High)</option>
                  <option>Bedrooms (High to Low)</option>
                  <option>Bathrooms (Low to High)</option>
                  <option>Bathrooms (High to Low)</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="beds">Bedrooms</label>
                <select id="beds">
                  <option>Any Number</option>
                  <option>Studio</option>
                  <option>1+</option><option>2+</option><option>3+</option>
                  <option>4+</option><option>5+</option><option>6+</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="baths">Baths</label>
                <select id="baths">
                  <option>Any Number</option>
                  <option>1+</option><option>2+</option><option>3+</option>
                  <option>4+</option><option>5+</option><option>6+</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="min">Min Price</label>
                <input type="number" id="min" placeholder="No Min" min="0" />
              </div>
              <div className="input-group">
                <label htmlFor="max">Max Price</label>
                <input type="number" id="max" placeholder="No Max" min="0" />
              </div>
              <button type="submit" className="btn btn-primary search-submit">Search Now</button>
            </form>
          </div>
        </section>

        <section id="about" className="blended-about-section">
          <motion.div
            className="blended-text-side"
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="blended-eyebrow">Over 3 decades of excellence</span>
            <h2>Meet Your Expert Guide</h2>
            <p className="blended-paragraph">
              Realtor providing luxury experiences and top-tier results in Pahrump, Nevada.
              With over 30 years in the industry, Marci Metzger ensures every client receives
              unparalleled attention to detail, comprehensive market analysis, and a seamless
              transaction process from start to finish.
            </p>

            <div className="blended-cta-row">
              <a href="tel:206-919-6886" className="btn btn-primary">Call Now</a>
              <a href="#services" className="btn btn-outline">Learn More</a>
            </div>

            <div className="trust-row">
              <div className="trust-item">
                <Award size={18} />
                <div>
                  <strong><CountUp end={30} suffix="+" /></strong>
                  <span>Years Experience</span>
                </div>
              </div>
              <div className="trust-item">
                <TrendingUp size={18} />
                <div>
                  <strong><CountUp end={500} suffix="+" /></strong>
                  <span>Homes Sold</span>
                </div>
              </div>
              <div className="trust-item">
                <Star size={18} />
                <div>
                  <strong>$28.5M</strong>
                  <span>Closed Volume</span>
                </div>
              </div>
            </div>

            <div className="about-certs">
              <span className="about-certs-label">Certified &amp; Affiliated With</span>
              <div className="about-certs-row">
                <div className="about-cert-item"><img src={ridgeImg} alt="The Ridge" className="cert-logo" /></div>
                <div className="about-cert-item"><img src={realtorImg} alt="Realtor" className="cert-logo" /></div>
                <div className="about-cert-item"><img src={equalhousingImg} alt="Equal Housing Opportunity" className="cert-logo" /></div>
                <div className="about-cert-item"><img src={parhumpImg} alt="Pahrump" className="cert-logo" /></div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="blended-image-side"
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={marciImg} alt="Marci Metzger" loading="lazy" />
          </motion.div>
        </section>

        <section className="info-sections">
          <div className="section-header">
            <span className="section-label">Top Residential Sales</span>
            <motion.h2 {...fadeUp}>Get It SOLD.</motion.h2>
          </div>
          <div className="info-grid">
            <article className="info-card glass-card">
              <div className="img-wrapper">
                <img src={firstImg} alt="Residential sales" loading="lazy" />
              </div>
              <div className="info-card-content">
                <span className="info-index">01</span>
                <h3>Strong Results in the Local Market</h3>
                <p>We helped nearly 90 clients in 2021 and closed $28.5 million in sales. Our team works hard every day to grow and learn, so we may continue to excel in our market. Our clients deserve our best — and we make sure our best gets better every year.</p>
              </div>
            </article>

            <article className="info-card glass-card">
              <div className="img-wrapper">
                <img src={secondImg} alt="Home listings" loading="lazy" />
              </div>
              <div className="info-card-content">
                <span className="info-index">02</span>
                <h3>Don't Just List It... Get It SOLD!</h3>
                <p>We exhaust every avenue to ensure our listings are at the fingertips of every possible buyer, getting you top dollar for your home.</p>
              </div>
            </article>

            <article className="info-card glass-card">
              <div className="img-wrapper">
                <img src={thirdImg} alt="Buyer guidance" loading="lazy" />
              </div>
              <div className="info-card-content">
                <span className="info-index">03</span>
                <h3>Guide to Buyers</h3>
                <p>Nobody knows the market like we do. Enjoy having a pro at your service — market analysis, upgrades lists, contractors on speed dial, and more!</p>
              </div>
            </article>
          </div>
        </section>

        <section id="services" className="services-section">
          <div className="section-header">
            <span className="section-label">What We Offer</span>
            <motion.h2 {...fadeUp}>Our Services</motion.h2>
          </div>

          <div className="svc-grid">
            <motion.a
              href="#contact"
              className="svc-card svc-tall"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              <img src={service1Img} alt="Buying a Home" loading="lazy" />
              <div className="svc-overlay">
                <span className="svc-number">01</span>
                <div className="svc-text">
                  <h3>Real Estate Done Right</h3>
                  <p>Nervous about your property adventure? Don't be. Whether you're getting ready to buy or sell your residence, looking at investment properties, or just curious about the markets — our team ensures you get the best experience possible.</p>
                  <span className="svc-cta">Work with Marci →</span>
                </div>
              </div>
            </motion.a>

            <div className="svc-col">
              <motion.div
                className="svc-card svc-short"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.12 }}
              >
                <img src={service2Img} alt="Commercial & Residential" loading="lazy" />
                <div className="svc-overlay">
                  <span className="svc-number">02</span>
                  <div className="svc-text">
                    <h3>Commercial &amp; Residential</h3>
                    <p>Large or small, condo or mansion — we can find it at the price that's right. Fixer-uppers? Luxury? We live, work, and play in this community and we're happy to help you find where to put your hard-earned dollars.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="svc-card svc-short"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.22 }}
              >
                <img src={service3Img} alt="Expert Guidance" loading="lazy" />
                <div className="svc-overlay">
                  <span className="svc-number">03</span>
                  <div className="svc-text">
                    <h3>Rely on Expertise</h3>
                    <p>If you have questions about affordability, credit, and loan options — trust us to connect you with the right people. We make sure you feel confident and educated every step of the way.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>



        <section className="recent-sales-section">
          <div className="section-header">
            <span className="section-label">Recent results</span>
            <motion.h2 {...fadeUp}>Recently Sold</motion.h2>
          </div>

          <div className="recent-sales-grid info-grid">
            {recentSales.map((sale, idx) => (
              <motion.article
                key={sale.address}
                className="info-card sale-card"
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
              >
                <div className="img-wrapper">
                  <img src={sale.image} alt={sale.address} loading="lazy" />
                </div>
                <div className="info-card-content sale-card-content">
                  <span className="info-index">{sale.status}</span>
                  <h3>{sale.address}</h3>
                  <p>{sale.detail}</p>
                  <span className="sale-price">{sale.price}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="testimonials-section">
          <div className="section-header">
            <span className="section-label">Client Feedback</span>
            <motion.h2 {...fadeUp}>Testimonials</motion.h2>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((item, idx) => (
              <motion.article
                key={item.name}
                className={`testimonial-card ${idx === 1 ? 'testimonial-featured' : ''}`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.08 }}
              >
                <span className="testimonial-quote-mark">“</span>
                <div className="testimonial-stars" aria-label="Five star rating">★★★★★</div>
                <p>“{item.quote}”</p>
                <div className="testimonial-author">
                  <span className="testimonial-avatar">{item.name.charAt(0)}</span>
                  <div className="testimonial-author-text">
                    <strong>{item.name}</strong>
                    <span>{item.detail}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="area-guide-section">
          <div className="section-header">
            <span className="section-label">Explore the area</span>
            <motion.h2 {...fadeUp}>Pahrump Lifestyle</motion.h2>
          </div>

          <div className="area-grid">
            {areaGuides.map((item, idx) => (
              <motion.article
                key={item.title}
                className="area-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.09 }}
              >
                <div className="area-card-image">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <span className="area-number">0{idx + 1}</span>
                </div>
                <div className="area-card-body">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="portfolio-section">
          <div className="portfolio-header">
            <span className="section-label">Featured Properties</span>
            <motion.h2 {...fadeUp}>Curated Excellence</motion.h2>
          </div>

          <div className="portfolio-carousel-wrap">
            <div className="portfolio-stage" aria-label="Featured property gallery">
              {portfolioImages.map((img, index) => {
                const slidePosition = getSlidePosition(index, activeSlide, portfolioImages.length);

                return (
                  <article
                    key={img.id}
                    className={`portfolio-card ${slidePosition}`}
                  >
                    <img src={img.src} alt={img.title} />
                    <div className="slide-overlay">
                      <span className="slide-index">0{index + 1} / 0{portfolioImages.length}</span>
                      <div className="slide-info">
                        <span className="slide-type">{img.type}</span>
                        <h3>{img.title}</h3>
                        <span className="slide-location">{img.location}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="portfolio-nav">
              <button
                type="button"
                className="portfolio-control"
                onClick={() => setActiveSlide((current) => (current - 1 + portfolioImages.length) % portfolioImages.length)}
                aria-label="Previous property"
              >
                ←
              </button>

              <div className="portfolio-dots" aria-label="Property gallery pagination">
                {portfolioImages.map((img, index) => (
                  <button
                    key={img.id}
                    type="button"
                    className={`portfolio-dot ${index === activeSlide ? 'active' : ''}`}
                    onClick={() => setActiveSlide(index)}
                    aria-label={`View ${img.title}`}
                  />
                ))}
              </div>

              <button
                type="button"
                className="portfolio-control"
                onClick={() => setActiveSlide((current) => (current + 1) % portfolioImages.length)}
                aria-label="Next property"
              >
                →
              </button>
            </div>
          </div>
        </section>

        <section className="faq-section">
          <div className="section-header">
            <span className="section-label">Frequently Asked Questions</span>
            <motion.h2 {...fadeUp}>FAQ</motion.h2>
          </div>

          <div className="faq-list">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <motion.div
                  key={faq.question}
                  className={`faq-item ${isOpen ? 'open' : ''}`}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.55, delay: idx * 0.06 }}
                >
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-toggle">
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {isOpen ? '−' : '+'}
                      </motion.div>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="faq-answer-wrapper"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      >
                        <div className="faq-answer">
                          <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                          >
                            {faq.answer}
                          </motion.p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>


        <section id="contact" className="contact-section">
          <div className="contact-bg-split"></div>
          <div className="contact-container">
            <motion.div
              className="contact-info"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="section-label">Get in Touch</span>
              <h2>Marci Metzger</h2>
              <h4 className="subtitle">The Ridge Realty Group</h4>

              <div className="info-block">
                <MapPin className="info-icon" size={20} />
                <p>3190 HW-160, Suite F<br />Pahrump, NV 89048</p>
              </div>

              <div className="info-block">
                <Phone className="info-icon" size={20} />
                <a href="tel:206-919-6886" className="contact-phone">(206) 919-6886</a>
              </div>

              <div className="info-block">
                <h4>Office Hours</h4>
                <p>Open daily 8:00 am – 7:00 pm<br />Appointments outside office hours available upon request. Just call!</p>
              </div>

              <div className="map-container">
                <div id="leaflet-map" ref={mapRef} style={{ width: '100%', height: '100%' }} />
              </div>
            </motion.div>

            <motion.div
              className="contact-form-wrapper"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.12 }}
            >
              <h2>Send Message</h2>
              <p className="form-intro">Tell us about your move. We’ll respond promptly.</p>
              <form onSubmit={handleSubmit(onSubmit)} className="modern-form">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Name"
                    {...register("name", { required: true })}
                    className={errors.name ? "error-input" : ""}
                  />
                  {errors.name && <span className="error-text">Name is required</span>}
                </div>

                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Email Address *"
                    {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                    className={errors.email ? "error-input" : ""}
                  />
                  {errors.email && <span className="error-text">Valid email is required</span>}
                </div>

                <div className="input-group">
                  <textarea
                    placeholder="How can we help you?"
                    rows="4"
                    {...register("message", { required: true })}
                    className={errors.message ? "error-input" : ""}
                  ></textarea>
                  {errors.message && <span className="error-text">Message is required</span>}
                </div>

                <button type="submit" className="btn btn-primary full-width">Send Message</button>

                <p className="recaptcha-notice">
                  This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.
                </p>
              </form>
            </motion.div>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <h3>Marci Metzger</h3>
              <p>Luxury Real Estate &mdash; Pahrump, Nevada</p>
            </div>

            <div className="footer-divider"></div>

            <div className="footer-socials">
              <a href="#" className="social-icon" aria-label="Facebook"><FaFacebook size={17} /></a>
              <a href="#" className="social-icon" aria-label="Instagram"><FaInstagram size={17} /></a>
              <a href="#" className="social-icon" aria-label="LinkedIn"><FaLinkedin size={17} /></a>
              <a href="#" className="social-icon" aria-label="Yelp"><FaYelp size={17} /></a>
            </div>

            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} Marci Metzger &mdash; The Ridge Realty Group. All Rights Reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </ReactLenis>
  );
}
